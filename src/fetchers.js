const { XMLParser } = require('fast-xml-parser');
const { BskyAgent } = require('@atproto/api');
const cheerio = require('cheerio');

const { Article } = require("./article");
const utils = require('./utils');

const fetchers = {
  NewYorkTimesAPI: async(feed) => {
    const secrets = await utils.getSecrets();

    if (secrets) {
      const response = await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=type%3AInteractive&fl=web_url,headline,pub_date,body,type_of_material,multimedia&sort=newest&api-key=${secrets.nyt.key}`);
      const data = await response.json();

      let articles = data.response.docs;

      articles = articles.filter(article => article.web_url.includes('interactive'));

      articles = articles.map(article => {
        return new Article({
          publication: feed.publication,
          twitterHandle: feed.twitterHandle,
          blueSkyHandle: feed.blueSkyHandle,
          url: article.web_url,
          image: article.multimedia.default.url,
          headline: article.headline.main,
          timestamp: article.pub_date
        });
      });

      // filter out recurring features
      articles = articles.filter(article => !article.headline.includes("New Paperbacks"));
      articles = articles.filter(article => !article.headline.includes("Best of Late Night"));
      articles = articles.filter(article => !article.headline.includes("To Do This Weekend"));
      articles = articles.filter(article => !article.headline.includes("Paperbacks"));
      articles = articles.filter(article => !article.headline.includes("News Quiz"));
      articles = articles.filter(article => !article.headline.includes("Weekender"));

      // filter out staging pieces that some how end up on their API
      articles = articles.filter(article => !article.url.includes('stg.nytimes'));

      // filter out pilot/burst templated interactives
      for (let article of articles) {
        const articleResponse = await fetch(article.url);
        const articleBody = await articleResponse.text();
        article.isTemplated = articleBody.includes('rendered by pilot');
      }

      articles = articles.filter(article => !article.isTemplated);

      return articles;
    } else {
      console.log("Unable to fetch feed for The New York Times. Please check your secrets.json file");
    }
  },

  WashingtonPost: async(feed) => {
    const response = await fetch(`https://www.washingtonpost.com/prism/api/prism-query?_website=washpost&query=%7B%22query%22%3A%22prism%3A%2F%2Fprism.query%2Fsubtype%2Cinteractive%26limit%3D30%22%7D&filter=%7Bitems%7B_id%20canonical_url%20display_date%20promo_items%20headlines%20publish_date%20taxonomy%7Btags%7D%7D%7D`, {
      signal: AbortSignal.timeout(10000)
    });

    const data = await response.json();
    let articles = data.items;
    articles = articles.filter(article => !article.taxonomy.tags.map(tag => tag.description).includes('stamp'));
    articles = articles.map(article => new Article({
      publication: feed.publication,
      twitterHandle: feed.twitterHandle,
      blueSkyHandle: feed.blueSkyHandle,
      url: article.canonical_url,
      image: article.promo_items.basic.url,
      headline: article.headlines.basic,
      timestamp: article.display_date
    }));

    return articles;
  },

  TheGuardianAPI: async(feed) => {
    const secrets = await utils.getSecrets();

    if (secrets) {
      const response = await fetch(`https://content.guardianapis.com/search?api-key=${secrets.guardian}&type=interactive&q=NOT%20cartoon&order-by=newest`);
      const data = await response.json();

      let articles = data.response.results;
      articles = articles.map(article => new Article({
        publication: feed.publication,
        twitterHandle: feed.twitterHandle,
        blueSkyHandle: feed.blueSkyHandle,
        url: article.webUrl,
        headline: article.webTitle,
        timestamp: article.webPublicationDate
      }));

      return articles;
    } else {
      console.log("Unable to fetch feed for The Guardian. Please check your secrets.json file");
    }
  },

  PhiladelphiaInquirerAPI: async(feed) => {
    const secrets = await utils.getSecrets();
    if (secrets) {
      const response = await fetch(`${secrets.inquirer.baseUrl}/content/v4/search/published?website=philly-media-network&q=type:story AND (taxonomy.tags.text:"interactive-bespoke")&size=10&_sourceInclude="_id,headlines,display_date,canonical_url,promo_items,canonical_website"&sort=display_date:desc`, {
        'method': 'GET',
        'headers': {
          'Authorization': `Bearer ${secrets.inquirer.bearerToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      let articles = data.content_elements;
      articles = articles.map(article => new Article({
        publication: feed.publication,
        twitterHandle: feed.twitterHandle,
        blueSkyHandle: feed.blueSkyHandle,
        url: 'https://inquirer.com' + article.canonical_url,
        headline: article.headlines.meta_title !== '' ? article.headlines.meta_title : article.headlines.basic,
        image: article?.promo_items?.basic?.url,
        timestamp: article.display_date
      }));

      articles = articles.filter(article => !article.url.includes('zzz-systest'));

      return articles;
    } else {
      console.log("Unable to fetch feed for The Philadelphia Inquirer. Please check your secrets.json file");
    }
  },

  SouthChinaMorningPost: async(feed) => {
    try {
      const response = await fetch('https://interactive-static.scmp.com/sheet/graphics/arcade.json');
      let data = await response.json();
      let articles = data.entries.reverse();
      articles = articles.slice(0, 10);
      articles = articles.map(article => new Article({
        publication: feed.publication,
        twitterHandle: feed.twitterHandle,
        blueSkyHandle: feed.blueSkyHandle,
        url: article.url,
        headline: article.title,
        image: article.imageurl,
        timestamp: utils.getTimeStamp(article.date, 'DD/MM/YYYY'),
      }));

      return articles;
    } catch (e) {
      utils.logError(feed.publication, e);
      console.log(e);
    }
  },

  XML: async(feed) => {
    try {
      const parser = new XMLParser({
        ignoreAttributes: false
      });
      const response = await fetch(feed.path);
      let data = parser.parse(await response.text());
      let articles;

      if (feed.format == 'RSS') {
        data = data.rss.channel.item;

        if (feed.domain) {
          data = data.filter(item => item.link.includes(feed.domain))
        }

        articles = data.map(article => new Article({
          publication: feed.publication,
          twitterHandle: feed.twitterHandle,
          blueSkyHandle: feed.blueSkyHandle,
          url: article.link,
          headline: article.title,
          timestamp: article.isoDate || article.pubDate,
          image: article?.enclosure?.["@_url"]
        }))
      } else if (feed.format == 'Atom') {
        data = data.feed.entry;

        if (feed.domain) {
          data = data.filter(entry => entry.id.includes(feed.domain))
        }

        articles = data.map(article => new Article({
          publication: feed.publication,
          twitterHandle: feed.twitterHandle,
          blueSkyHandle: feed.blueSkyHandle,
          url: article.id,
          headline: article.title,
          timestamp: article.published
        }));
      } else if (feed.format == 'Sitemap') {
        data = data.urlset.url;
        articles = data.map(article => new Article({
          publication: feed.publication,
          twitterHandle: feed.twitterHandle,
          blueSkyHandle: feed.blueSkyHandle,
          url: article.loc,
          headline: article?.['news:news']?.['news:title'],
          image: article?.['image:image']?.['image:loc'],
          timestamp: article?.['news:news']?.['news:publication_date'] || article.lastmod
        }));
      }

      if (feed?.filters?.in) {
        for (const key of Object.keys(feed.filters.in)) {
          articles = articles.filter(article => article[key].includes(feed.filters.in[key]));
        }
      }

      if (feed?.filters?.out) {
        for (const key of Object.keys(feed.filters.out)) {
          articles = articles.filter(article => !article[key].includes(feed.filters.out[key]))
        }
      }

      return articles;
    } catch (e) {
      utils.logError(feed.publication, e);
      console.log(e);
    }
  },

  Website: async(feed) => {
    try {
      const response = await fetch(feed.path);
      const html = await response.text();

      const $ = cheerio.load(html, {
        xmlMode: true
      });

      let data = $(feed.selector);

      let articles = data.map((i, article) => {
        let timestamp = $(article).find(feed.timestamp).text();

        if (feed.timestampAttribute) {
          timestamp = $(article).find(feed.timestamp).attr(feed.timestampAttribute);
        } else if (feed.timestampFormat) {
          timestamp = utils.getTimeStamp(timestamp, feed.timestampFormat);
        }

        const image = feed.image ? $(article).find(feed.image).attr('src') : null;

        let url = feed.url ? $(article).find(feed.url).attr('href') : $(article).attr('href');
        url = feed.baseUrl ? feed.baseUrl + url : url;

        if (!feed.domain || url.includes(feed.domain)) {
          return new Article({
            publication: feed.publication,
            twitterHandle: feed.twitterHandle,
  
            blueSkyHandle: feed.blueSkyHandle,
            url: url,
            headline: $(article).find(feed.headline).text(),
            image: image || null,
            timestamp: timestamp
          })
        }
      });

      return articles;
    } catch (e) {
      utils.logError(feed.publication, e);
      console.log(e);
    }
  },

  BlueSky: async(feed) => {
    try {
      const idResponse = await fetch(`https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${feed.handle}`);
      const idData = await idResponse.json();

      const client = new BskyAgent({
        service: 'https://bsky.social/'
      });

      const secrets = await utils.getSecrets();

      await client.login({
        identifier: secrets.bluesky.identifier,
        password: secrets.bluesky.password
      })

      const { data } = await client.getAuthorFeed({
        actor: idData.did,
        filter: 'posts_and_author_threads',
        limit: 100,
      });

      let articles = data.feed.filter(entry => entry.post?.embed?.external);
      articles = articles.map(entry => {
        const external = entry.post.embed.external;

        return new Article({
          publication: feed.publication,
          twitterHandle: feed.twitterHandle,
          blueSkyHandle: feed.blueSkyHandle,
          url: external.uri,
          headline: external.title,
          image: external.thumb,
          timestamp: entry.post.record.createdAt // this is when the link was shared, which isn't ideal
        })
      });

      if (feed?.filters?.in) {
        for (const key of Object.keys(feed.filters.in)) {
          articles = articles.filter(article => article[key].includes(feed.filters.in[key]));
        }
      }

      if (feed?.filters?.out) {
        for (const key of Object.keys(feed.filters.out)) {
          articles = articles.filter(article => !article[key].includes(feed.filters.out[key]))
        }
      }

      return articles;
    } catch (e) {
      utils.logError(feed.publication, e);
      console.log(e);
    }
  }
}

module.exports = {
  fetch: async(feed) => {
    try {
      let articles = new Array;

      const {sources, ...feedInformation} = feed 

      for (let source of sources) {
        source = {...source, ...feedInformation};
        const sourceArticles = await fetchers[source.type](source);
        console.log(`Fetched ${source.publication} from ${source.type} source. ${sourceArticles.length} articles found`);
        articles.push(...sourceArticles);
      }

      return articles;
    } catch (e) {
      utils.logError(feed.publication, e);
      console.log(`Error fetching ${feed.publication}`);
      console.log(e);
    }
  }
}
