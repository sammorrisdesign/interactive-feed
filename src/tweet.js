// Post to Twitter
const { TwitterApi } = require('twitter-api-v2');
const utils = require("./utils");

const newArticles = async (articles) => {
  const isTweeting = process.env.npm_config_tweet == "true";
  const secrets = await utils.getSecrets();

  if (secrets && isTweeting) {
    const client = new TwitterApi({
      appKey: secrets.twitter.key,
      appSecret: secrets.twitter.secret,
      accessToken: secrets.twitter.accessToken,
      accessSecret: secrets.twitter.accessSecret,
    });

    for (let article of articles) {
      let tweet = `New on @${article.handle}${article.headline ? `: "${article.headline}"` : ""} ${article.url}`;

      console.log("Tweeting:", tweet);

      client.v2.tweet(tweet).then(val => {
        console.log(`Successfully tweeted: https://twitter.com/InteractiveFeed/status/${val.data.id}`);
      }).catch(err => {
        console.log(err);
      });
    }
  } else {
    console.log("Tweeting is turned off, please use 'npm run start --tweet=true'")
  }
}

module.exports = {
  newArticles: newArticles
}