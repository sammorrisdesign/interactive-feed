const feeds = require('./src/feeds');

(async() => {
  await feeds.check();
  console.log('done');
})()
