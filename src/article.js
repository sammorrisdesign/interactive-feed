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

  isOld(old) {
    console.log(old);
    return old.url === url
  }
}

module.exports = { Article };