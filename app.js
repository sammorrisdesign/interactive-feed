const cron = require('node-cron');
const feeds = require('./src/feeds');

cron.schedule('0 */6 * * *', async() => {
  console.log('Firing scheduled cronjob');
  try {
    // check
    await feeds.check();
  } catch (e) {
    console.log(e);
  }
});

feeds.check();
