const utils = require('./utils');

class Article {
  constructor(publication, twitterHandle, mastodonHandle, url, headline, timestamp) {
    this.publication = publication;
    this.twitterHandle = twitterHandle;
    this.mastodonHandle = mastodonHandle;
    this.url = utils.cleanURL(url);
    this.headline = headline;
    this.timestamp = new Date(timestamp);
  }

  toJSON() {
    return Object.getOwnPropertyNames(this).reduce((a, b) => {
      a[b] = this[b];
      return a;
    }, {});
  }
}

module.exports = { Article };