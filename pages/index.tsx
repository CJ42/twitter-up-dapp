import { useState } from "react";
import Head from "next/head";

import { loadContract, setLSP12IssuedAsset, claimPOAP } from "./api/actions";
import { ethers } from "ethers";

export default function Home() {
  const [assetAddress, setAssetAddress] = useState<string>(
    "0x43Ba7501F4EbB87B592EEC070ab0AB65347165E5"
  );
  const [universalProfileAddress, setUniversalProfileAddress] =
    useState<string>("");

  const [assetInfos, setAssetInfos] = useState({
    name: "",
    symbol: "",
    description: "",
    attributes: [],
  });

  const connectUniversalProfile = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accountsRequest: string[] = await provider.send(
      "eth_requestAccounts",
      []
    );
    setUniversalProfileAddress(accountsRequest[0]);

    // debug
    console.log("Universal Profile's address: ", accountsRequest[0]);
  };

  return (
    <div className="mt-4 max-w-xs p-4 md:max-w-md lg:max-w-2xl xl:max-w-4xl mx-auto">
      <lukso-button
        variant="secondary"
        custom-class="text-purple-51 text-12 rounded-12 hover:text-purple-41"
        loading-text="Connecting..."
        onClick={async () => {
          await connectUniversalProfile();
        }}
      >
        CONNECT
      </lukso-button>
      <Head>
        <title>LUKSO LSP8 POAP Workshop</title>
        <meta name="description" content="Next Twitter Starter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mt-10">
        <h1 className="text-3xl font-bold">
          Create a LSP8 POAP and ask users to go on this website to claim it! 🎩
        </h1>

        {/* TODO: Show images of different POAPs and their image */}
        <div className="pt-8">
          <input
            type="text"
            className=" bg-neutral-100 paragraph-inter-14-regular p-4 m-2
            border-solid placeholder:text-neutral-70
            outline-none transition transition-all duration-150 appearance-none border-neutral-90 rounded-12 w-[450px] text-neutral-20 border "
            value={assetAddress}
            onChange={(e) => setAssetAddress(e.target.value)}
          />
        </div>
        <div>
          <lukso-button
            variant="landing"
            size="medium"
            is-link="false"
            href="#"
            type="button"
            target="_self"
            rel="noopener noreferrer"
            loading-text=""
            custom-class="m-2"
            onClick={async () => {
              const results = await loadContract(assetAddress);

              console.log("results: ", results);

              if (results) {
                setAssetInfos(results);
              }
            }}
          >
            Load contract
          </lukso-button>
          <lukso-button
            variant="secondary"
            size="medium"
            is-link="true"
            href={`https://erc725-inspect.lukso.tech/inspector?address=${assetAddress}&network=testnet`}
            type="button"
            target="_blank"
            rel="noopener noreferrer"
            custom-class="m-2"
            count=""
          >
            View on erc725-inspect
          </lukso-button>
        </div>

        <div className="p-2"></div>
        {/* </a> */}

        <div className="p-8 border rounded-md space-y-4">
          <div>
            <p className="font-semibold text-lg">{assetInfos.name}</p>
            <p>{assetInfos.description}.</p>
          </div>
          <pre>{assetInfos.symbol}</pre>
          <p className="font-semibold text-lg">Attributes</p>
          <ul>
            {assetInfos.attributes.map((attribute: any) => (
              <li className="m-4">
                <lukso-tag size="small">{attribute}</lukso-tag>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-8 border rounded-md space-y-4">
          <div>
            <lukso-button
              variant="landing"
              size="medium"
              is-link="false"
              href="#"
              type="button"
              target="_self"
              rel="noopener noreferrer"
              loading-text=""
              custom-class="my-2"
              count=""
              onClick={() => claimPOAP(assetAddress, universalProfileAddress)}
            >
              Claim POAP
            </lukso-button>
            <lukso-button
              variant="secondary"
              size="medium"
              is-link=""
              href="#"
              type="button"
              target="_self"
              rel="noopener noreferrer"
              loading-text="Registering..."
              custom-class="my-2"
              count=""
              onClick={() => {
                setLSP12IssuedAsset(assetAddress, universalProfileAddress);
              }}
            >
              Register as Issued Asset
            </lukso-button>
          </div>
        </div>

        <h1 className="text-3xl font-bold m-4">Useful Resources 📚</h1>

        <div className="flex flex-wrap gap-4">
          <a
            href="https://docs.lukso.tech"
            className="flex-6 border rounded-md px-4 py-6 hover:bg-gray-100"
          >
            <h2 className="font-semibold text-lg">docs.lukso.tech &rarr;</h2>
            <p>Find in-depth information about LUKSO and the LSP Standards.</p>
          </a>

          <a
            href="https://github.com/CJ42/LSP8-EthDenver-2024-workshop"
            className="flex-6 border rounded-md px-4 py-6 hover:bg-gray-100"
          >
            <h2 className="font-semibold text-lg">
              Github repository of workshop &rarr;
            </h2>
            <p>Follow the instructions on this repository.</p>
          </a>
        </div>
      </main>
    </div>
  );
}
