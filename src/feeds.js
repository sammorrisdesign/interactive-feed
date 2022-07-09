const config = require('./config.json');
const fetchers = require('./fetchers');

const pullRecentFeeds = async() => {
  let data = new Object;

  for (const feed of config.feeds) {
    if (feed.type) {
      data[feed.publication] = await fetchers[feed.type](feed);
    }
  }

  return data;
}

module.exports = {
  check: async() => {
    const data = await pullRecentFeeds();

    console.log(data);

    // loop through all publications in data
    // grab perm data source (or create it)
    // check for each Article within perm data source
    // 



    // figure out what's new from a perm source of data
    // tweet out new ones
    // save perm source of data
  }
}