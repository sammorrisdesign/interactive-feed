const feeds = require('./src/feeds');

(async() => {
  console.log("Running scripts");
  console.time("Time to run");
  await feeds.check();
  console.log("Finished running scripts");
  console.timeEnd("Time to run");
})()
