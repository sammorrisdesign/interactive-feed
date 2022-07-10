const fs = require('fs-extra');
const config = require('../config.json');
const fetchers = require('./fetchers');
const tweet = require('./tweet');
const utils = require('./utils');

const pullRecentFeeds = async() => {
  let data = new Object;

  // loop through all feeds and fetch them
  for (const feed of config.feeds) {
    if (feed.type === 'Twitter') {
      console.log("Pulling feed for", feed.publication);
      const fetchedArticles = await fetchers[feed.type](feed);

      if (fetchedArticles) {
        data[feed.publication] = fetchedArticles
      }
    }
  }

  return data;
}

const findNewArticles = async(data) => {
  let newArticles = new Array;

  // loop through recently fetched feeds
  for (const feed of Object.keys(data)) {
    const path = `./data/${utils.handlise(feed)}.json`;

    // create /data/publication-name.json if it doesn't exist
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, JSON.stringify({
        lastUpdated: new Date(),
        articles: []
      }, null, 2));
    }

    const savedData = fs.readJSONSync(path);
    const fetchedArticles = data[feed];
    let newArticlesFromFeed = new Array;

    // loop through recently fetched articles
    for (const article of fetchedArticles) {
      // does article exist in savedData, add to newArticlesFromFeed if it's new
      const isOld = savedData.articles.some(savedArticle => savedArticle.url === article.url);

      if (!isOld) {
        console.log("Found new article");
        newArticlesFromFeed.push(article);
      }
    }

    // if we have new articles to add
    if (newArticlesFromFeed.length > 0) {
      // update savedData
      savedData.lastUpdated = new Date();
      savedData.articles = [...newArticlesFromFeed, ...savedData.articles];
      fs.writeFileSync(path, JSON.stringify(savedData, null, 2));

      // add to global new articles array in this check
      newArticles = [...newArticles, ...newArticlesFromFeed];
    }
  }

  return newArticles;
}

module.exports = {
  check: async() => {
    const data = await pullRecentFeeds();
    const newArticles = await findNewArticles(data);

    if (newArticles) {
      console.log(newArticles.length, "new articles found");
      tweet.newArticles(newArticles);
    }
  }
}