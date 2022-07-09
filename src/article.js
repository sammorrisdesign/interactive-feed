class Article {
  constructor(publication, url, headline, timestamp) {
    this.publication = publication;
    this.url = url;
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