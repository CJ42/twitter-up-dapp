# LUKSO Twitter UP dApp

Based on [**nextjs-twitter-starter**](https://github.com/Dineshs91/nextjs-twitter-starter)

## Setup

1. Install the dependencies

```
yarn install
```

2. in the Twitter Developer dashboard, create a project with Twitter API v2 and save the credentials of the projects under the `.env.local` file as shown below:

```
TWITTER_AUTH_CLIENT_ID="..."
TWITTER_AUTH_CLIENT_SECRET="..."
```

3. add the callback url of the project as `http://localhost:3000/twitter-callback` in the Twitter Developer dashboard.

## Running the dApp

```
yarn dev
```

Navigate to [localhost:3000](https://localhost:3000) and follow the steps.

## Potential future improvements

- [] In the UP Profile metadata, add the following extra infos
- location
- public_metrics
- created_at
- entities?

- [x] Find a way to download banner image (not available in twitter API free tier)
      https://twittercommunity.com/t/how-to-get-banner-url-for-a-user/168692/7

_Already searched and banner image only available with Basic paid plan._
