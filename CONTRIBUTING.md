# Contributing to Interactive Journalism Feed

Thanks for helping improve the Interactive Journalism Feed.

## Adding or updating a publication

Start with `config.json` and follow the source-type documentation in `README.md`.

After changing a publication, run:

```bash
npm run test --publication="Publication Name"
npm run audit
```

The test command checks the selected feeds without posting to Bluesky. The audit command checks publication health and updates generated publication lists.

## Before opening a pull request

- Keep changes focused on one publication or behavior.
- Explain the source you added or changed.
- Include the verification commands you ran.
- Do not commit API keys, credentials, or a decrypted `secrets.json` file.
- Update `README.md` when the documented publication list or behavior changes.
