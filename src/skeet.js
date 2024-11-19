// Post to BlueSky
const { BskyAgent, RichText } = require('@atproto/api');
const sharp = require('sharp');
const utils = require("./utils");

const getImageForArticleUrl = async(imageUrl, client) => {
  try {
    if (imageUrl) {
      let bufferToReturn;

      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const contentType = imageResponse.headers.get('content-type');

      // if the image is too big for BlueSky, we should resize and return that instead
      if (imageBuffer.byteLength > 900000) {
        bufferToReturn = await sharp(imageBuffer)
          .resize({ width: 1000 })
          .toBuffer();
      } else {
        bufferToReturn = imageBuffer
      }

      const blobResponse = await client.uploadBlob(bufferToReturn, { encoding: contentType });
      return await blobResponse.data.blob;
    } else {
      return null;
    }
  } catch (e) {
    console.log('Error getting image for', url);
    console.log(e);
    return null;
  }
}

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
      let skeet = `New on ${article.blueskyHandle ? "@" + article.blueskyHandle : article.publication} ${article.headline ? `: “${article.headline}”` : ""}`;

      const richTextSkeet = new RichText({text: skeet});
      await richTextSkeet.detectFacets(client);

      const embed = {
        $type: 'app.bsky.embed.external',
        external: {
          uri: article.url,
          title: article.headline ? article.headline : '',
          description: '',
        }
      }

      // Fetch image and add to embed object if it exists
      const imageAsBlob = await getImageForArticleUrl(article.image, client);
      if (imageAsBlob) {
        embed.external.thumb = imageAsBlob; 
      }

      try {
        const post = await client.post({
          $type: 'app.bsky.feed.post',
          text: richTextSkeet.text,
          facets: richTextSkeet.facets,
          createdAt: new Date().toISOString(),
          embed: embed
        });

        const postId = post.uri.split('/').at(-1);
        console.log(`Successfully skeeted: https://bsky.app/profile/interactives.bsky.social/post/${postId}`);
      } catch (err) {
        console.log(err);
      }
    }
  } else {
    console.log("Publishing is turned off, please use 'npm run start --publish=true'")
  }
}

module.exports = {
  newArticles: newArticles
}