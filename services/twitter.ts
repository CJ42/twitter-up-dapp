import { auth } from 'twitter-api-sdk';
import { OAuth2User, OAuth2Scopes } from 'twitter-api-sdk/dist/OAuth2User';

const twitterAuthScopes: OAuth2Scopes[] = ['users.read', 'tweet.read']

export const createTwitterOAuthUser = () => {
  return new auth.OAuth2User({
    client_id: "ckxFaHlnX2FUdDdZMENVazBFMUk6MTpjaQ",
    client_secret: process.env.TWITTER_AUTH_CLIENT_SECRET,
    callback: process.env.TWITTER_CALLBACK_URL,
    scopes: twitterAuthScopes,
  })
}

export const getTwitterAuthURL = async (authClient: OAuth2User) => {
  const authUrl = authClient.generateAuthURL({
    state: "4d97327ce8d64acfa53f",
    code_challenge_method: 'plain',
    code_challenge: "1a5489693c94ff27e998",
  });

  return authUrl;
}
