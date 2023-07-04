import Client from "twitter-api-sdk";
import {
  createTwitterOAuthUser,
  getTwitterAuthURL,
} from "../../services/twitter";

export default async (req: any, res: any) => {
  const authClient = createTwitterOAuthUser();
  getTwitterAuthURL(authClient);

  const token = await authClient.requestAccessToken(req.body.authCode);

    // TODO: check that we have received a token
    const twitterApi = new Client(authClient);

    const result = await twitterApi.users.

  try {
  } catch (error) {
    console.error(error);
    res.status(500).json("error occurred when fetching twitter banner image");
  }
};
