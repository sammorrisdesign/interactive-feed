const utils = require('./utils');

class Article {
  constructor({ publication, twitterHandle, mastodonHandle, blueSkyHandle, url, headline, image, timestamp }) {
    this.publication = publication;
    this.twitterHandle = twitterHandle;
    this.mastodonHandle = mastodonHandle;
    this.blueSkyHandle = blueSkyHandle;
    this.url = utils.cleanURL(url);
    this.headline = headline;
    this.image = image;
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