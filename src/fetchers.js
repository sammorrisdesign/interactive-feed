const fetch = require('node-fetch');
const Parser = require('rss-parser');

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

const RSS = async(feed) => {
  try {
    const parser = new Parser();
    const data = await parser.parseURL(feed.rss);

    let articles = data.items;
    articles = articles.map(article => new Article(
      publication = feed.publication,
      url = article.link,
      headline = article.title,
      timestamp = article.isoDate || article.pubDate
    ));

    if (feed.filters) {
      for (const key of Object.keys(feed.filters)) {
        articles = articles.filter(article => article[key].includes(feed.filters[key]));
      }
    }

    return articles;
  } catch(e) {
    console.log(e);
    console.log('rss fail');
  }
}

module.exports = {
  NewYorkTimesAPI: NewYorkTimesAPI,
  RSS: RSS
}