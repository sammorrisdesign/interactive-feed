const fetch = require('node-fetch');
const { XMLParser } = require('fast-xml-parser');

const { Article } = require("./article");
const secrets = require('../secrets.json');

const NewYorkTimesAPI = async(feed) => {
  const response = await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=document_type:("multimedia")&fl=web_url,headline,pub_date,type_of_material&sort=newest&api-key=${secrets.nyt.key}`);
  const data = await response.json();
  let articles = data.response.docs;
  articles = articles.filter(article => article.web_url.includes('interactive'));
  articles = articles.map(article => new Article(
    publication = feed.publication,
    url = article.web_url,
    headline = article.headline.main,
    timestamp = article.pub_date
  ));

  return articles;
}

const XML = async(feed) => {
  try {
    const parser = new XMLParser();
    const response = await fetch(feed.path);
    let data = parser.parse(await response.text());
    let articles;

    if (feed.format == 'RSS') {
      data = data.rss.channel.item;
      articles = data.map(article => new Article(
        publication = feed.publication,
        url = article.link,
        headline = article.title,
        timestamp = article.isoDate || article.pubDate
      ))
    } else if (feed.format == 'Sitemap') {
      data = data.urlset.url;
      articles = data.map(article => new Article(
        publication = feed.publication,
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

module.exports = {
  NewYorkTimesAPI: NewYorkTimesAPI,
  XML: XML
}