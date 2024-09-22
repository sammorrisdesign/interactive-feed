// This is a quick audit of all publications and when they last published.
// The idea is to give a developer a quick way to check the health of all feeds 
const fs = require('fs-extra');
const config = require('../config.json');
const utils = require('./utils');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

(async() => {
  // Get a complete list of publications from config and saved data
  const publicationsFromConfig = config.feeds.map(feed => utils.handlise(feed.publication));
  const publicationsFromData = fs.readdirSync('./data/publications').map(fileName => fileName.replace('.json', ''));
  const uniquePublications = Array.from(new Set([...publicationsFromConfig, ...publicationsFromData])).sort();

  // Check each publication
  for (let publication of uniquePublications) {
    console.log(`Checking status of ${publication}`);

    // Do we have a config?
    if (publicationsFromConfig.includes(publication)) {
      console.log('✅ Config found');
    } else {
      console.log('❌ Config missing');
    }

    // Do we have data?
    if (publicationsFromData.includes(publication)) {
      console.log('✅ Data found');

      const data = fs.readJSONSync(`./data/publications/${publication}.json`);
      const articles = data.articles;
      const numberOfArticles = articles.length;

      // Do we have an articles?
      if (numberOfArticles > 0) {
        console.log(`🧮 ${articles.length} articles found`);

        const lastArticle = articles[0];

        // When was the last found article published?
        if (lastArticle.timestamp) {
          console.log(`⏳ Last article published ${dayjs(lastArticle.timestamp).fromNow()}`);
        } else {
          console.log('⌛️ No timestamps found');
        }
      } else {
        console.log('❌ No articles found');
      }
    } else {
      console.log('❌ Data missing');
    }

    console.log('\r')
  }
})();
