// Post to Twitter
const { TwitterApi } = require('twitter-api-v2');
const utils = require("./utils");

const newArticles = async (articles) => {
  const isPublishing = process.env.npm_config_publish == "true";
  const secrets = await utils.getSecrets();

  if (secrets && isPublishing) {
    const client = new TwitterApi({
      appKey: secrets.twitter.key,
      appSecret: secrets.twitter.secret,
      accessToken: secrets.twitter.accessToken,
      accessSecret: secrets.twitter.accessSecret,
    });

    for (let article of articles) {
      let tweet = `New on @${article.twitterHandle}${article.headline ? `: "${article.headline}"` : ""} ${article.url}`;

      console.log("Tweeting:", tweet);

      client.v2.tweet(tweet).then(val => {
        console.log(`Successfully tweeted: https://twitter.com/InteractiveFeed/status/${val.data.id}`);
      }).catch(err => {
        console.log(err);
      });
    }
  } else {
    console.log("Publishing is turned off, please use 'npm run start --publish=true'")
  }
}

module.exports = {
  newArticles: newArticles
}