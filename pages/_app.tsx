import "../styles/globals.css";

import { AppProps } from "next/app";

if (typeof window !== "undefined") {
  // @ts-ignore
  import("@lukso/web-components");
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <a href="/">
        <lukso-navbar title="TWITTER UP DAPP"></lukso-navbar>
      </a>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
