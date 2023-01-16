# Interactive Journalism Feed
A Twitter and Mastodon bot that shares new interactive, graphic, and data vis stories from newsrooms around the world. It works by scripts that are periodically ran that check APIs, RSS feeds, and sitemaps.

You can follow it at [@InteractiveFeed](https://twitter.com/InteractiveFeed) or [@Interactives@botsin.space](https://botsin.space/@Interactives).

## Requirements
- Node v14 or above
- NYT, Guardian, Mastodon, and Twitter credentials for `secrets.json` or the secret key.

## Installation
Use `npm i` to get all dependecies.

If you know the secret key you can run `export key=<SECRET-KEY>` and then `npm run decrypt-secrets` to get a complete `secrets.json` file. If not, you can create your own using [`secrets.example.json`](secrets.example.json)

## Publications
An evergrowing list of publications that we check and filter feeds of...

Axios, Bloomberg, CNN, El País, ESPN, FiveThirtyEight, FT, Kontinentalist, LA Times, Le Monde, NBC News, NPR, NZZ, Politico, Reuters, San Francisco Chronicle, South China Morning Post, Texas Tribune, The Economist, The Guardian, The New York Times, The Philadlephia Inquirer, The Pudding, The Straits Times, The Washington Post, and WSJ.

## Missing Publications
Not all publications have specific feeds or repeatable url structures to get the types of stories we're looking to share. While this isn't a complete list of what's missing, here's some major newsrooms that we don't have hooked up...

Al Jazeera, Atlanta Journal Constitution, Associated Press, Bayerischer Rundfunk, BBC News, Berliner Morgenpost, Boston Globe, CBC, Chicago Tribune, El Diario, Helsingin Sanomat, Le Monde, Le Nacion, Insider, Marshall Project, Minnepolis Star Tribune, Miami Herald, National Geographic, ProPublica, Quartz, Radio Canada, SB Nation,Seattle Times, SRF, Süddeutsche Zeitung, Tampa Bay Times, The Atlantic, The City, The Globe and Mail, The New Yorker, The Verge, The Times of London, Time Magazine, Toronto Star, USA Today, Vox, Zeit

Know of how any of these newsrooms can be added? Make a PR!
Know of any newsrooms we should add? Tweet me [@SamMorrisDesign](https://twitter.com/SamMorrisDesign) or add a GitHub Issue

## Adding a new Publication
To add a new publication to the bot you should start with the `[config.json](config.json)` file. This lists out all current publications and their data sources. Ideal sources are APIs or specific RSS feeds, but Twitter accounts and ways of filtering RSS and XML sitemaps are also available. Something to consider when adding a source to an existing publication is that more sources for a publication increases coverage but also slows down the bot.

Top level options for a `feed` are as follows. All are required fields.

| Name              | Type     | Description                                                     |
| ----------------- | -------- | --------------------------------------------------------------- |
| `publication`     | `String` | Name of the publication                                         |
| `twitterHandle`   | `String` | An @-less Twitter handle for the publication or specific team   |
| `mastondonHandle` | `String` | An @-less mastondon handle for the publication or specific team |
| `sources`         | `Array`  | An array of source objects. See below for more information      |

Sources can look different depending on the `type` - a required field in each source object. The `type` basically tells `[src/fetchers.js](src/fetchers.js)` how it should handle the rest of the information. Some publications, like The Guardian and New York Times have their own `type` which refer to publication specific APIs. The other two types are `XML` and `Twitter`.

Source level options for `Twitter`, getting articles as tweeted from a specific feed, are as follows.

| Name        | Type     | Description                                                                                                                                                        |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `twitterID` | `String` | An ID for the twitter account you want to scrape. [TweeterID](https://tweeterid.com/) will give you an ID for from a handle.                                       |
| `domain`    | `String` | Optional filtering that will check that this string is contained in any url. Just in case the account shares articles from other publications or non-interactives. |

Source level options for `XML`, getting articles from an RSS feed or a Sitempa, are as follows.

| Name          | Type     | Description                                                                                                                                           |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `format`      | `String` | Either RSS or Sitemap                                                                                                                                 |
| `path`        | `String` | Full URL for your source                                                                                                                              |
| `domain`      | `String` | For RSS feeds only. Optional filtering that will check that this string is contained in any url. Just in case the RSS feed includes non-interactives. |
| `filters.in`  | `Object` | For Sitemaps only. Filter to keep articles by property/value pairs. For example: url must contain '/visuals' – the rest will be discarded             |
| `filters.out` | `Object` | For Sitemaps only. Filter to exclude articles by property/value pairs. For example: headline should not contain "Week in"                             |

Once you've added a publication to the config you can run `npm run test --publication="The New York Times"` to test it (only with the name of your publication instead). This will check the feeds but not actually tweet/toot anything. If you're happy with it, make a PR!
