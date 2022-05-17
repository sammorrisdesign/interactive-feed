const config = require('./config.json');
const fetchers = require('./fetchers');

const pullRecentFeeds = async() => {
  config.feeds.forEach(async(publication) => {
    await fetchers[publication.feedType](publication);

  });

  return 'finished';
}

module.exports = {
  check: async() => {

    const data = await pullRecentFeeds();
    // loop through config.feeds
    // trigger various fetchers based on a config's feedType
    // return articles in a standarised way
    // do something with those articles (twitter bot?)
  }
}