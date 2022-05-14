const config = require('./config.json');


module.exports = {
  check: () => {
    // loop through config.feeds
    // trigger various fetchers based on a config's feedType
    // return articles in a standarised way
    // do something with those articles (twitter bot?)
    console.log('trigger stuff');
  }
}