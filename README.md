# Interactive Journalism Feed
A Twitter bot that tweets new interactive, graphic, and data vis stories from newsrooms around the world. It works by scripts that are periodically ran that check APIs, RSS feeds, and sitemaps.

You can follow it at [@InteractiveFeed](https://twitter.com/InteractiveFeed).

## Requirements
- Node v14 or above
- NYT and Twitter credentials for `secrets.json`

## Publications
An evergrowing list of publications that we check and filter feeds of...

The New York Times, The Washington Post, The Pudding, The Guardian, Quartz, CNN, FT, Politico, Bloomberg, FiveThirtyEight, The Philadelphia Inquirer, South China Morning Post, NBC News, Wall Street Journal, LA Times, Reuters, NPR, Axios.

These are listed in `config.json` and can be added to with a PR. Ideal sources are APIs or specific RSS feeds. You can test whether a publication's feed is working with `npm run test --project="The New York Times"`


## Missing Publications
Not all publications have specific feeds or repeatable url structures to get the types of stories we're looking to share. While this isn't a complete list of what's missing, here's some major newsrooms that we don't have hooked up...

Vox, The Verge, SB Nation, ProPublica, USA Today, SF Chronicle, Marshall Project, National Geographic, Minnepolis Star Tribune, Miami Herald, Texas Tribune, The Atlantic, Boston Globe, New Yorker, CBC, Toronto Star, Al Jazeera, and many more.

Know of how any of these newsrooms can be added? Make a PR!
Know of any newsrooms we should add? Tweet me [@SamMorrisDesign](https://twitter.com/SamMorrisDesign) or add a GitHub Issue
