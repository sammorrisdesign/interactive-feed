const url = require('url');

module.exports = {
  cleanURL: rawUrl => {
    if (rawUrl) {
      const parsedUrl = url.parse(rawUrl);
      return parsedUrl.protocol + '//' + parsedUrl.host + parsedUrl.pathname;
    }
  },

  handlise: string => {
    if (string) {
      return string.replace(/[^\w\s]/gi, '').replace(/ /g, '-').toLowerCase();
    }
  },

  getSecrets: async() => {
    try {
      const config = require('../secrets.json');
      return config;
    } catch(e) {
      return false;
    }
  }
}