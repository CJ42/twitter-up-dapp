import { useState } from "react";
import { createTwitterOAuthUser, getTwitterAuthURL } from "../services/twitter";
import { useRouter } from "next/router";

export default function Twitter(props: any) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  return (
    <div className="p-2 max-w-xs lg:max-w-md mx-auto mt-12">
      <h2 className="text-2xl font-semibold">
        Let's connect your Twitter account
      </h2>

      <div className="mt-8">
        <p>Click the button below to connect to your Twitter account.</p>
        <p className="mt-2">
          We'll collect information from your Twitter profile and import them in
          your UP.
        </p>
      </div>

      <div className="mt-8">
        <div className="mt-8">
          <lukso-button
            variant="landing"
            size="medium"
            href=""
            type="button"
            rel=""
            isLoading={isLoading}
            loading-text="Connecting to Twitter..."
            custom-class=""
            count="0"
            onClick={async () => {
              setIsLoading(true);

              // 1. redirect to authURL
              const authClient = createTwitterOAuthUser();
              const authUrl = await getTwitterAuthURL(authClient);
              router.push(authUrl);
            }}
          >
            Connect Twitter Account
          </lukso-button>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  let twitterHandle = process.env.TEST_TWITTER_HANDLE;
  let twitterInfo = null;

  return {
    props: {
      twitterInfo: null,
    },
  };
}
