const secrets = require('../secrets.json');
const fetch = require('node-fetch');

const NewYorkTimesAPI = async() => {
  await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=document_type:("multimedia")&fl=web_url,headline,pub_date,type_of_material&sort=newest&api-key=${secrets.nyt.key}`)
    .then(response => {
      return response.json();
    }).then(data => {
      let articles = data.response.docs;
      articles = articles.filter(article => article.web_url.includes('interactive'));
      return articles;
    });
}

const RSS = async(data) => {
  console.log('rss');
}

module.exports = {
  NewYorkTimesAPI: NewYorkTimesAPI,
  RSS: RSS
}