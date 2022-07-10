const { TwitterApi } = require('twitter-api-v2');
const secrets = require("../secrets.json");

const newArticles = articles => {
  const client = new TwitterApi({
    appKey: secrets.twitter.key,
    appSecret: secrets.twitter.secret,
    accessToken: secrets.twitter.accessToken,
    accessSecret: secrets.twitter.accessSecret,
  });

  for (let article of articles) {
    let tweet = `New on @${article.handle}: ${article.headline ? `"${article.headline}" ` : ""}${article.url}`;

    console.log("Tweeting:", tweet);

    client.v2.tweet(tweet).then(val => {
      console.log(`Successfully tweeted: https://twitter.com/InteractiveFeed/status/${val.data.id}`);
    }).catch(err => {
      console.log(err);
    })
  }
}

module.exports = {
  newArticles: newArticles
}