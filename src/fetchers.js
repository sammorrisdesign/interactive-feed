const fetch = require('node-fetch');

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

const RSS = async(data) => {
  console.log('rss');
}

module.exports = {
  NewYorkTimesAPI: NewYorkTimesAPI,
  RSS: RSS
}