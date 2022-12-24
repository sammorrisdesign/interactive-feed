// Post to Mastodon
const Mastodon = require('mastodon-api');
const utils = require("./utils");

const newArticles = async (articles) => {
  const isPublishing = process.env.npm_config_publish == "true";
  const secrets = await utils.getSecrets();

  if (secrets && isPublishing) {
    const client = new Mastodon({
      access_token: secrets.mastodon.accessToken,
      api_url: 'https://botsin.space/api/v1/'
    });

    for (let article of articles) {
      let toot = `New on ${"@" + article.mastodonHandle || article.publication} ${article.headline ? `: "${article.headline}"` : ""} ${article.url}`;

      console.log("Tooting:", toot);

      client.post('statuses', {
        status: toot
      }).then(val => {
        console.log(`Successfully tooted: https://botsin.space/@Interactives/${val.data.id}`);
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