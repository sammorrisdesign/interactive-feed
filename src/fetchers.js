const fetch = require('node-fetch');
const { XMLParser } = require('fast-xml-parser');
const { TwitterApi } = require('twitter-api-v2');

const { Article } = require("./article");
const utils = require('./utils');

const NewYorkTimesAPI = async(feed) => {
  const secrets = await utils.getSecrets();

  if (secrets) {
    const response = await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=document_type:("multimedia")&fl=web_url,headline,pub_date,type_of_material&sort=newest&api-key=${secrets.nyt.key}`);
    const data = await response.json();
    let articles = data.response.docs;
    articles = articles.filter(article => article.web_url.includes('interactive'));
    articles = articles.map(article => new Article(
      publication = feed.publication,
      handle = feed.handle,
      url = article.web_url,
      headline = article.headline.main,
      timestamp = article.pub_date
    ));

    return articles;
  } else {
    console.log("Unable to fetch feed for The New York Times. Please check your secrets.json file");
  }
}

const TheGuardianAPI = async(feed) => {
  const secrets = await utils.getSecrets();

  if (secrets) {
    const response = await fetch(`https://content.guardianapis.com/search?api-key=${secrets.guardian}&type=interactive&q=NOT%20cartoon&order-by=newest`);
    const data = await response.json();
    let articles = data.response.results;
    articles = articles.map(article => new Article(
      publication = feed.publication,
      handle = feed.handle,
      url = article.webUrl,
      headline = article.webTitle,
      timestamp = article.webPublicationDate
    ));

    return articles;
  } else {
    console.log("Unable to fetch feed for The Guardian. Please check your secrets.json file");
  }
}

const TheWashingtonPost = async(feed) => {
  const secrets = await utils.getSecrets();

  if (secrets) {
    const response = await fetch(secrets.waPo);
    let articles = await response.json();
    articles = articles.filter(article => article.published == true && article.template == 'Custom template');
    articles = articles.map(article => new Article(
      publication = feed.publication,
      handle = feed.handle,
      url = "https://www.washingtonpost.com/" + article.canonical_url,
      headline = article.headlines.basic,
      timestamp = article.first_publish_date
    ));

    return articles;
  }
}

const XML = async(feed) => {
  try {
    const parser = new XMLParser();
    const response = await fetch(feed.path);
    let data = parser.parse(await response.text());
    let articles;

    if (feed.format == 'RSS') {
      data = data.rss.channel.item;

      if (feed.domain) {
        data = data.filter(item => item.link.includes(feed.domain))
      }

      articles = data.map(article => new Article(
        publication = feed.publication,
        handle = feed.handle,
        url = article.link,
        headline = article.title,
        timestamp = article.isoDate || article.pubDate
      ))
    } else if (feed.format == 'Sitemap') {
      data = data.urlset.url;
      articles = data.map(article => new Article(
        publication = feed.publication,
        handle = feed.handle,
        url = article.loc,
        headline = article?.['news:news']?.['news:title'],
        timestamp = article?.['news:news']?.['news:publication_date'] || article.lastmod
      ));
    }

    if (feed.filters) {
      for (const key of Object.keys(feed.filters)) {
        articles = articles.filter(article => article[key].includes(feed.filters[key]));
      }
    }

    return articles;
  } catch(e) {
    console.log(e);
  }
}

const Twitter = async(feed) => {
  try {
    const secrets = await utils.getSecrets();

    if (secrets) {
      const client = new TwitterApi({
        appKey: secrets.twitter.key,
        appSecret: secrets.twitter.secret,
        accessToken: secrets.twitter.accessToken,
        accessSecret: secrets.twitter.accessSecret,
      });

      // get all tweets from given account and retweets
      let { tweets = _realdata.data } = await client.v2.userTimeline(feed.twitterID, { exclude: ['replies'],
        "expansions": "referenced_tweets.id"
      });
      tweets = tweets.map(tweet => tweet.referenced_tweets ? tweet.referenced_tweets[0].id : tweet.id);
      tweets = await client.v2.tweets(tweets, {
        "tweet.fields": ["entities"]
      });

      // get a unique set of links from tweet that match the domain
      let uniqueLinks = [];
      let links = tweets.data.flatMap(tweet => tweet?.entities?.urls ? tweet.entities.urls.flatMap(url => {
        const preferredUrl = utils.cleanURL(url.unwound_url || url.expanded_url);

        if (!uniqueLinks.includes(preferredUrl)) {
          uniqueLinks.push(preferredUrl);
          return {
            "url": url.unwound_url || url.expanded_url,
            "title": url.title
          }
        } else {
          return [];
        }
      }) : []);
      links = links.filter(link => link.url.includes(feed.domain));

      let articles = links.map(link => new Article(
        publication = feed.publication,
        handle = feed.handle,
        url = link.url,
        headline = link.title,
        timestamp = new Date()
      ));

      return articles;
    } else {
      console.log(`Unable to fetch feed for ${feed.publication}. Please check your secrets.json file`);
    }
  } catch(e) {
    console.log(e);
  }
}

module.exports = {
  NewYorkTimesAPI: NewYorkTimesAPI,
  TheGuardianAPI: TheGuardianAPI,
  TheWashingtonPost: TheWashingtonPost,
  XML: XML,
  Twitter: Twitter
}