const feeds = require('./src/feeds');

(async() => {
  console.log("checking feeds");
  console.time();
  await feeds.check();
  console.log("finished checking feeds");
  console.timeEnd();
})()
