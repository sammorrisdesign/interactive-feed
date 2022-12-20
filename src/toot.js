// Post to Mastodon
const Mastodon = require('mastodon-api');
const utils = require("./utils");

const newArticles = async (articles) => {
  const isTweeting = process.env.npm_config_tweet == "true";
  const secrets = await utils.getSecrets();

  if (secrets && isTweeting) {
    const client = new Mastodon({
      access_token: secrets.mastodon.accessToken,
      api_url: 'https://botsin.space/api/v1/'
    });

    for (let article of articles) {
      let toot = `New on @${article.publication} ${article.headline ? `: "${article.headline}"` : ""} ${article.url}`;

      console.log("Tooting:", toot);

      client.post('statuses', {
        status: toot
      }).then(val => {
        console.log(`Successfully tooted: https://twitter.com/InteractiveFeed/status/${val.data.id}`);
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