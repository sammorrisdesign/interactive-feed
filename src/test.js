const config = require('../config.json');
const fetchers = require('./fetchers');

(async() => {
  console.log("Testing a specific feed");
  console.log("This will return all articles found using a specific entry in config");
  const publication = process.env.npm_config_publication;
  const feed = config.feeds.find(feed => feed.publication == publication);

  if (feed) {
    console.log("Found config for", publication, "and starting fetch");
    console.time("Time to fetch");
    const fetchedArticles = await fetchers[feed.type](feed);
    console.log(fetchedArticles);
    console.timeEnd("Time to fetch");
  } else {
    console.log("Missing config for", publication);
    console.log("Check your config.json file to corresponding publication");
  }
})();
