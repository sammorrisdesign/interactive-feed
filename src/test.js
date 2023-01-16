const config = require('../config.json');
const fetchers = require('./fetchers');

(async() => {
  console.log("Testing a specific feed");
  console.log("This will return all articles found using a specific entry in config");
  const publication = process.env.npm_config_publication;

  if (publication) {
    const feed = config.feeds.find(feed => feed.publication == publication);

    if (feed) {
      console.log("Found config for", publication);
      await fetchers.fetch(feed);
    } else {
      console.log("Missing config for", publication);
      console.log("Check your config.json file to corresponding publication");
    }
  } else {
    console.log("No publication supplied");
    console.log("Please add a publication name to test against, like this: npm run test --publication=\"The New York Times\"")
  }
})();
