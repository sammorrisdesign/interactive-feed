# Interactive Journalism Feed
A Twitter bot that tweets new interactive, graphic, and data vis stories from newsrooms around the world. It works by scripts that are periodically ran that check APIs, RSS feeds, and sitemaps.

You can follow it at [@InteractiveFeed](https://twitter.com/InteractiveFeed).

## Requirements
- Node v14 or above
- NYT and Twitter credentials for `secrets.json`

## Publications
An evergrowing list of publications that we check and filter feeds of...

Axios, Bloomberg, CNN, El País, ESPN, FiveThirtyEight, FT, Kontinentalist, LA Times, Le Monde, NBC News, NPR, NZZ, Politico, Reuters, San Francisco Chronicle, South China Morning Post, Texas Tribune, The Economist, The Guardian, The New York Times, The Philadlephia Inquirer, The Pudding, The Straits Times, The Washington Post, and WSJ.

These are listed in `config.json` and can be added to with a PR. Ideal sources are APIs or specific RSS feeds. You can test whether a publication's feed is working with `npm run test --project="The New York Times"`


## Missing Publications
Not all publications have specific feeds or repeatable url structures to get the types of stories we're looking to share. While this isn't a complete list of what's missing, here's some major newsrooms that we don't have hooked up...

Al Jazeera, Atlanta Journal Constitution, Associated Press, Bayerischer Rundfunk, BBC News, Berliner Morgenpost, Boston Globe, CBC, Chicago Tribune, El Diario, Helsingin Sanomat, Le Monde, Le Nacion, Insider, Marshall Project, Minnepolis Star Tribune, Miami Herald, National Geographic, ProPublica, Quartz, Radio Canada, SB Nation,Seattle Times, SRF, Süddeutsche Zeitung, Tampa Bay Times, The Atlantic, The City, The Globe and Mail, The New Yorker, The Verge, The Times of London, Time Magazine, Toronto Star, USA Today, Vox, Zeit

Know of how any of these newsrooms can be added? Make a PR!
Know of any newsrooms we should add? Tweet me [@SamMorrisDesign](https://twitter.com/SamMorrisDesign) or add a GitHub Issue
