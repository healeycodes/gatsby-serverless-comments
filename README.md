# gatsby-serverless-comments

Use Netlify serverless functions to let users add comments to a static website.

1. 👩 User enters a comment and clicks submit.
2. ⚙️ A serverless function receives the data and hits GitHub's API.
3. 🔧 It reads the existing `comments.json` , appends the new comment, and saves.
4. 🚧 A new commit triggers a Netlify build.
5. ✔️ The new version of the website is deployed!

The new comment is visible ~30 seconds ⏰ after the first click.

<br>

See `/src/pages/index.js` for the user visible page.

See `/functions/comment.js` for the serverless function.

## Why?

- Accept user comments and store them on GitHub. No database required.

- Avoid using third-party plugin solutions that leak your user's data.

<br>

## Setup

Set the following environmental variables on Netlify:

- `GITHUB_PAT_TOKEN` to your GitHub personal access token.
- `GITHUB_REPO` to the repository where this code is located.
- `GITHUB_USER` your GitHub username.

<br>

Set up the site on Netlify to continuously deploy on commits (this the default).

Visit the deploy preview, or production version, and submit a comment from the root path (`/`).

You should see a `204` response in the browser console. Else, check the Netlify functions logs for errors.
