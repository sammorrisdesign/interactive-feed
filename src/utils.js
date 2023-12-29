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
      // clean up timestamps if needed
      const monthAbbreivations = ["Jan.", "Feb.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
      if (timeStamp.includes('Sept.')) {
        timeStamp = timeStamp.replace('Sept.', 'September');
      }

      if (monthAbbreivations.some(abbr => timeStamp.includes(abbr))) {
        timeStamp = timeStamp.replace('.', '');
      }

      const date = dayjs(timeStamp, [...format]);

      if (date.isValid()) {
        return date.toISOString()
      } else {
        return false;
      }
    }
  }
}