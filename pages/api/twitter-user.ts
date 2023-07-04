import Client from "twitter-api-sdk";
import {
  createTwitterOAuthUser,
  getTwitterAuthURL,
} from "../../services/twitter";

export default async (req: any, res: any) => {
  const authClient = createTwitterOAuthUser();
  getTwitterAuthURL(authClient);

  if (!req.body) {
    res.status(400).json({ message: "invalid request body" });
  }

  // 5. use the `code` to get the access token
  try {
    const token = await authClient.requestAccessToken(req.body.authCode);

    // TODO: check that we have received a token
    const twitterApi = new Client(authClient);

    const userInfos = await twitterApi.users.findMyUser({
      // A comma separated list of User fields to display
      "user.fields": [
        "created_at",
        "description",
        "entities",
        "id",
        "location",
        "name",
        "pinned_tweet_id",
        "profile_image_url",
        "protected",
        "public_metrics",
        "url",
        "username",
        "verified",
        "withheld",
      ],

      // A comma separated list of Tweet fields to display.
      "tweet.fields": [
        "attachments",
        "author_id",
        "context_annotations",
        "conversation_id",
        "created_at",
        "edit_controls",
        "entities",
        "geo",
        "id",
        "in_reply_to_user_id",
        "lang",
        "non_public_metrics",
        "public_metrics",
        "organic_metrics",
        "promoted_metrics",
        "possibly_sensitive",
        "referenced_tweets",
        "reply_settings",
        "source",
        "text",
        "withheld",
      ],

      // A comma separated list of fields to expand
      expansions: ["pinned_tweet_id"],
    });

    console.log(userInfos);
    console.log(userInfos.data?.entities?.url?.urls);
    console.log(userInfos.data?.entities?.description);
    res.status(200).json(userInfos);
  } catch (error) {
    console.error(error);
    res.status(500).json("error occurred when fetching twitter user data");
  }
};
