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
    // figure out what's new from a perm source of data

    // return articles in a standarised way
    // do something with those articles (twitter bot?)
  }
}