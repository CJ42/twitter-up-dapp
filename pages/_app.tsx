import { createContext, useState } from "react";
import "../styles/globals.css";

import { AppProps } from "next/app";

if (typeof window !== "undefined") {
  // @ts-ignore
  import("@lukso/web-components");
}

export const ProfileContext = createContext("");

function MyApp({ Component, pageProps }: AppProps) {
  const [universalProfileAddress, setUniversalProfileAddress] = useState("");

  return (
    <ProfileContext.Provider value={universalProfileAddress}>
      <lukso-navbar
        title="LUKSO LSP8 POAP"
        icon="wallet-outline"
        mobile-breakpoint="md"
        has-menu=""
      >
        {/* <div slot="desktop-menu">
          <lukso-button
            variant="text"
            custom-class="text-purple-51 text-12 hover:text-purple-41"
          >
            METADATA EXAMPLES
          </lukso-button>
          <lukso-button
            variant="text"
            custom-class="text-purple-51 text-12 hover:text-purple-41"
          >
            CLAIM POAP
          </lukso-button>
          <lukso-button
            variant="secondary"
            custom-class="text-purple-51 text-12 rounded-12 hover:text-purple-41"
          >
            CONNECT
          </lukso-button>
        </div> */}
      </lukso-navbar>
      <Component {...pageProps} />
    </ProfileContext.Provider>
  );
}

export default MyApp;
