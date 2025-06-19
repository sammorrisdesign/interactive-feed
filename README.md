# Interactive Journalism Feed
Twitter and BlueSky bots that share new interactive, graphic, and data vis stories from newsrooms around the world. It works by periodically checking APIs, RSS feeds, and sitemaps.

You can follow it at [@InteractiveFeed](https://twitter.com/InteractiveFeed), or [@interactives.bsky.social](https://staging.bsky.app/profile/interactives.bsky.social).

## Requirements
- Node v18 or above
- NYT, Guardian, Philadelphia Inquirer, BlueSky, and Twitter credentials for `secrets.json` or the secret key.

## Installation
Use `npm i` to get all dependecies.

If you know the secret key you can run `export KEY=<SECRET-KEY>` and then `npm run decrypt-secrets` to get a complete `secrets.json` file. If not, you can create your own from [`secrets.example.json`](secrets.example.json)

## Publications
An evergrowing list of publications that we check and filter feeds of...

List of featured publications: ABC Australia, Berliner Morgenpost, Bloomberg, Boston Globe, CNN, De Tijd, de Volkskrant, ESPN, FT, Houston Chronicle, Kontinentalist, LA Times, Le Monde, National Geographic, Nature, NBC News, NPR, NZZ, Politico, ProPublica, Publico, Reuters, San Francisco Chronicle, Seattle Times, South China Morning Post, Sydney Morning Herald, Tages-Anzeiger, Tagesspiegel, Texas Tribune, The City, The Economist, The Guardian, The New York Times, The Philadelphia Inquirer, The Pudding, The Straits Times, The Verge, The Washington Post, USA Today, and WSJ.

## Missing Publications
Not all publications have specific feeds or repeatable url structures to get the types of stories we're looking to share. While this isn't a complete list of what's missing, here's some major newsrooms that we don't have hooked up...

List of missing publications: Al Jazeera, Associated Press, Atlanta Journal Constitution, Axios, Bayerischer Rundfunk, BBC News, CBC, Chicago Tribune, Commonwealth Magazine, El Confidencial, El Diario, El País, Helsingin Sanomat, Insider, La Vanguardia, Le Nacion, Les Échos, Marshall Project, Miami Herald, Minnepolis Star Tribune, Radio Canada, Rest of World, SB Nation, SRF, Süddeutsche Zeitung, Tampa Bay Times, The Atlantic, The Globe and Mail, The New Yorker, The Times of London, Time Magazine, Toronto Star, Vox, and Zeit.

Know of how any of these newsrooms can be added? Make a PR!
Know of any newsrooms we should add? Tweet me [@SamMorrisDesign](https://twitter.com/SamMorrisDesign) or add a GitHub Issue

## Adding a new Publication
To add a new publication to the bot you should start with the [`config.json`](config.json) file. This lists out all current publications and their data sources. Ideal sources are APIs or specific RSS feeds, or Sitemaps. There's also an option to scrape static websites but this can be brittle and should be a last case scenario. Something to consider when adding a source to an existing publication is that more sources for a publication increases coverage but also slows down the bot.

### Top level options for a `feed`
All are required fields.

| Name              | Type     | Description                                                     |
| ----------------- | -------- | --------------------------------------------------------------- |
| `publication`     | `String` | Name of the publication                                         |
| `twitterHandle`   | `String` | An @-less Twitter handle for the publication or specific team   |
| `sources`         | `Array`  | An array of source objects. See below for more information      |

Sources can look different depending on the `type` - a required field in each source object. The `type` basically tells [`src/fetchers.js`](src/fetchers.js) how it should handle the rest of the information. Some publications, like The Guardian and New York Times have their own `type` which refer to publication specific APIs. The other types are `BlueSky`, `XML` and `Website`.

### Source level options for `BlueSky`.
Sources set to `"type": "BlueSky"` get articles from an BlueSky account.

| Name          | Type     | Description                                                                                                                                           |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `handle`      | `String` | The handle of the account you wish to scrape                                                                                                          |
| `filters.in`  | `Object` | For Sitemaps only. Filter to keep articles by property/value pairs. For example: url must contain '/visuals' – the rest will be discarded             |
| `filters.out` | `Object` | For Sitemaps only. Filter to exclude articles by property/value pairs. For example: headline should not contain "Week in"                             |


### Source level options for `XML`.
Sources set to `"type": "XML"` get articles from an RSS feed or a Sitemap.

| Name          | Type     | Description                                                                                                                                           |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `format`      | `String` | Either RSS or Sitemap                                                                                                                                 |
| `path`        | `String` | Full URL for your source                                                                                                                              |
| `domain`      | `String` | For RSS feeds only. Optional filtering that will check that this string is contained in any url. Just in case the RSS feed includes non-interactives. |
| `filters.in`  | `Object` | For Sitemaps only. Filter to keep articles by property/value pairs. For example: url must contain '/visuals' – the rest will be discarded             |
| `filters.out` | `Object` | For Sitemaps only. Filter to exclude articles by property/value pairs. For example: headline should not contain "Week in"                             |

### Source level options for `Website`.
Sources set to `"type": "Website"` get articles featured on a specific website. This source should only be used if it's the only option because it's the most likely to change and break over time.

| Name                 | Type     | Description                                                                                                                                                       |
| -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`               | `String` | The url of the page you wish to scrape                                                                                                                            |
| `domain`             | `String` | Optional filtering that will check that this string is contained in any url. Just in case the page includes articles from other publications or non-interactives. |
| `selector`           | `String` | DOM selector for what consitutes a single story on the page                                                                                                       |
| `url`                | `String` | A child `a` element within `selector`. The value for the `href` attribute from this element will be used                                                          |
| `baseUrl`            | `String` | Optional value that will be prepended to the scraped `url`. This is mostly for sites that use relative paths                                                      |
| `headline`           | `String` | A child element within `selector` that contains the headline. The `textContent` for this element will be used.                                                    |
| `timestamp`          | `String` | Optional child element within `selector` that contains the timestamp. The `textContent` for this element will be used.                                            |
| `timestampAttribute` | `String` | Optional. If `timestamp` element has an attribute that you'd rather scrape instead of the `textContent`, provide it here                                          |
| `timestampFormat`    | `Array`  | Optional. If `timestamp` is in a nonstandard format, you can use an array of [dayjs formats](https://day.js.org/docs/en/parse/string-format) to parse             |

### Testing
Once you've added a publication to the config you can run `npm run test --publication="The New York Times"` to test it (only with the name of your publication instead). This will check the feeds but not actually tweet/toot anything. If you're happy with it, make a PR!

You can also use `npm run audit` to check the "health" of each publication. This will tell you whether a publication is still present in the config, whether articles have been picked up for them, and if possible, when the last article was published. This will also sort the config alphabetically and update the list of publications on this page.
