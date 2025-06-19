const fs = require('fs-extra');
const config = require('../config.json');
const utils = require('./utils');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

// This function acts as a quick audit of all publications and when they last published.
// The idea is to give a developer a quick way to check the "health" of all feeds 
const getPublicationHealth = () => {
  // get all possible publications from config and data
  const publicationsFromConfig = config.feeds.map(feed => utils.handlise(feed.publication));
  const publicationsFromData = fs.readdirSync('./data/publications').map(fileName => fileName.replace('.json', ''));
  const uniquePublications = Array.from(new Set([...publicationsFromConfig, ...publicationsFromData])).sort();

  // loop through each publication and log if it has config, data, and when it was last updated
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
}

// this function cleans the config and formats it alphabetically
const cleanConfig = () => {
  // sort feeds alphabetically
  config.feeds = config.feeds.sort((a,b) => a.publication.localeCompare(b.publication));

  // save config
  fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
}

// this function updates both featured and missing of publications in the readme
const updateReadme = () => {
  // get the readme
  let readme = fs.readFileSync("./README.md", 'utf-8');

  // add publications with sources
  publicationsWithSources = config.feeds.filter(feed => feed.sources).map(feed => feed.publication);
  readme = readme.replace(/^.*List of featured publications:.*$/gm, `List of featured publications: ${utils.getOxfordCommaFormattedListFromArray(publicationsWithSources)}.`);

  // add publications without sources
  publicationsWithoutSources = config.feeds.filter(feed => !feed.sources).map(feed => feed.publication);
  readme = readme.replace(/^.*List of missing publications:.*$/gm, `List of missing publications: ${utils.getOxfordCommaFormattedListFromArray(publicationsWithoutSources)}.`);

  // save the modified readme
  fs.writeFileSync("./README.md", readme);
}

(async() => {
  getPublicationHealth();
  cleanConfig();
  updateReadme();
})();
