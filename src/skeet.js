// Post to BlueSky
const { BskyAgent, RichText } = require('@atproto/api');
const utils = require("./utils");

const newArticles = async (articles) => {
  const isPublishing = process.env.npm_config_publish == "true";
  const secrets = await utils.getSecrets();

  if (secrets && isPublishing) {
    const client = new BskyAgent({
      service: 'https://bsky.social/'
    });
    await client.login({
      identifier: secrets.bluesky.identifier,
      password: secrets.bluesky.password
    });

    for (let article of articles) {
      let skeet = `New on ${article.blueskyHandle ? "@" + article.blueskyHandle : article.publication} ${article.headline ? `: "${article.headline}"` : ""} ${article.url}`;

      const richTextSkeet = new RichText({text: skeet});
      await richTextSkeet.detectFacets(client);

      client.post({
        $type: 'app.bsky.feed.post',
        text: richTextSkeet.text,
        facets: richTextSkeet.facets,
        createdAt: new Date().toISOString(),
        embed: {
          $type: 'app.bsky.embed.external',
          external: {
            uri: article.url,
            title: article.headline ? article.headline : '',
            description: ''
          }
        }
      }).then(val => {
        const postId = val.uri.split('/').at(-1);
        console.log(`Successfully skeeted: https://staging.bsky.app/profile/interactives.bsky.social/post/${postId}`)
      }).catch(err => {
        console.log(err);
      })
    }
  } else {
    console.log("Publishing is turned off, please use 'npm run start --publish=true'")
  }
}

module.exports = {
  newArticles: newArticles
}