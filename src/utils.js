const url = require('url');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

module.exports = {
  cleanURL: rawUrl => {
    if (rawUrl) {
      const parsedUrl = url.parse(rawUrl);
      return parsedUrl.protocol + '//' + parsedUrl.host + parsedUrl.pathname;
    }
  },

  handlise: string => {
    if (string) {
      return string.normalize("NFD").replace(/[^\w\s]/gi, '').replace(/ /g, '-').toLowerCase();
    }
  },

  getSecrets: async() => {
    try {
      const config = require('../secrets.json');
      return config;
    } catch(e) {
      return false;
    }
  },

  getTimeStamp: (timeStamp, format) => {
    if (timeStamp) {
      const date = dayjs(timeStamp, format);

      if (date.isValid()) {
        return date.toISOString()
      } else {
        return false;
      }
    }
  }
}