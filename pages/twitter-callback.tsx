import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Prism } from "@mantine/prism";
import { ethers } from "ethers";

import jsonFile from "./LSP3Profile.json";
import UniversalProfile from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";
import ERC725JS from "@erc725/erc725.js";
import { LSPFactory, ProfileDataBeforeUpload } from "@lukso/lsp-factory.js";

import LSP3ProfileTemplate from "./LSP3Profile-template.json";

if (process.browser) {
  import("@lukso/web-components");
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

// 2. Twitter brings us back to this page after OAuth2 authorization
export default function TwitterCallback(props: any) {
  // 3. get the `code` from the url query params
  const router = useRouter();
  const { code } = router.query;

  const [provider, setProvider] = useState<ethers.providers.Web3Provider>(
    {} as ethers.providers.Web3Provider
  );
  const [universalProfileAddress, setUniversalProfileAddress] = useState("");
  const [lsp3ProfileDataIPFSURL, setLsp3ProfileDataIPFSURL] = useState("");
  const [lsp3ProfileDataJSON, setLSP3ProfileDataJSON] =
    useState<ProfileDataBeforeUpload>({} as ProfileDataBeforeUpload);

  useEffect(() => {
    if (window.ethereum) {
      const etherProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(etherProvider);
    }
  }, []);

  const connectUniversalProfile = async () => {
    const accountsRequest: string[] = await provider.send(
      "eth_requestAccounts",
      []
    );
    setUniversalProfileAddress(accountsRequest[0]);

    // debug
    console.log(universalProfileAddress);
  };

  const getTwitterUserInfos = async () => {
    // call the backend API endpoint with the `code` to query user's Twitter profile data
    fetch("/api/twitter-user", {
      method: "POST",
      body: JSON.stringify({ authCode: code }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        const { data: profileData } = data;
        const preparedData = await prepareProfileDetails(profileData);
        setLSP3ProfileDataJSON(preparedData);

        // debug
        console.log(data);
        console.log(preparedData);
      });
  };

  // 3. prepare the LSP3Profile JSON template, and fill up the fields
  const prepareProfileDetails = async (
    twitterUserData: any
  ): Promise<ProfileDataBeforeUpload> => {
    const twitterUsername = twitterUserData.username;

    // upload images to ipfs and add them in the list below
    const lspFactory = new LSPFactory(provider);

    try {
      // 1. download the profile image from twitter
      const response = await fetch(twitterUserData.profile_image_url);
      const imageBlob = await response.blob();

      const profileImage: File = new File([imageBlob], "profile", {
        type: `image/${imageBlob.type}`,
      });

      // Upload our JSON file to IPFS
      const uploadResult = await lspFactory.UniversalProfile.uploadProfileData(
        // TODO: add following extra infos:
        //      - location
        //      - public_metrics
        //      - created_at
        //      - entities?
        //
        // TODO: find a way to download banner image (not available in twitter API free tier)
        // https://twittercommunity.com/t/how-to-get-banner-url-for-a-user/168692/7
        {
          name: twitterUserData.name,
          description: twitterUserData.description,
          profileImage: profileImage,
          // backgroundImage: myLocalFile,
          tags: ["Twitter", "UniversalProfile", twitterUsername], // Add Twitter user handle as a tag
          links: [
            { title: "Twitter", url: "https://twitter.com/" + twitterUsername },
            // TODO: add in a loop any link mentioned under urls.entities
          ],
        }
      );

      // e.g: ipfs://QmQytqrSB5JXygk2PGqFVpeVjduzS4ewQd3F9hd53XCmGZ
      // can be viewed at: https://2eff.lukso.dev/ipfs/QmQytqrSB5JXygk2PGqFVpeVjduzS4ewQd3F9hd53XCmGZ
      const lsp3ProfileIPFSUrl = uploadResult.url;

      const ipfsResponse = await fetch(
        "https://2eff.lukso.dev/ipfs/" + lsp3ProfileIPFSUrl.substring(7) // strip the ipfs:// prefix
      );
      const jsonResponse = await ipfsResponse.json();

      console.log(jsonResponse);
      console.log(lsp3ProfileIPFSUrl);

      setLsp3ProfileDataIPFSURL(lsp3ProfileIPFSUrl);

      return jsonResponse;
    } catch (error) {
      throw new Error(
        `Error while uploading profile metadata to IPFS: ${error}`
      );
    }
  };

  const createUniversalProfileInstance = async () => {
    return new ethers.ContractFactory(
      UniversalProfile.abi,
      UniversalProfile.bytecode,
      provider.getSigner()
    ).attach(universalProfileAddress);
  };

  const updateLSP3ProfileMetadata = async () => {
    // 2. create an instance of ERC725.js, with the schema of LSP3Profile
    const erc725js = new ERC725JS(
      [
        {
          name: "LSP3Profile",
          key: "0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5",
          keyType: "Singleton",
          valueType: "bytes",
          valueContent: "JSONURL",
        },
      ],
      universalProfileAddress,
      provider,
      {
        ipfsGateway: "https://2eff.lukso.dev/ipfs/",
      }
    );

    const encodedData = await erc725js.encodeData([
      {
        keyName: "LSP3Profile",
        value: {
          hashFunction: "keccak256(utf8)",
          hash: ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(JSON.stringify(lsp3ProfileDataJSON))
          ),
          url: lsp3ProfileDataIPFSURL,
        },
      },
    ]);

    const profileInstance = await createUniversalProfileInstance();

    console.log(encodedData);

    const tx = await profileInstance["setData(bytes32,bytes)"](
      encodedData.keys[0],
      encodedData.values[0],
      {
        gasLimit: 10_000_000,
        from: universalProfileAddress,
      }
    );

    console.log("tx:", tx);
  };

  const clearProfileDetails = async () => {
    const profileInstance = await createUniversalProfileInstance();

    await profileInstance["setData(bytes32,bytes)"](
      "0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5",
      "0x",
      {
        gasLimit: 1_000_000,
        from: universalProfileAddress,
      }
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold">
        Successfully logged-in to Twitter!
      </h2>

      <p className="mt-8 mb-8">Let's connect your UP now 😃</p>

      <div className="grid grid-cols-2">
        <div className="first-column">
          <h2 className="mb-4 text-2xl">
            Step 1 - Connect your 🆙 to this dApp
          </h2>

          <button
            // TODO: create a custom button component to shorten the class description?
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => connectUniversalProfile()}
          >
            🔌 Connect my UP
          </button>

          <p className="mt-2">
            {universalProfileAddress ? (
              <span className="text-sm text-gray-500">
                ✅ Connected to UP at: <code>{universalProfileAddress}</code>
              </span>
            ) : (
              <span className="text-sm text-gray-500">
                ❌ Not connected to UP yet
              </span>
            )}
          </p>

          <h2 className="mt-8 mb-4 text-2xl">
            Step 2 - Fetch your Twitter Profile infos
          </h2>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => getTwitterUserInfos()}
          >
            🐦 Fetch Twitter User Infos
          </button>
          <p className="mt-2">
            Once your Twitter profile infos have been fetched, your will see
            them appearing in the JSON Metadata of your LSP3Profile here ➡️
          </p>

          <h2 className="mt-8 mb-4 text-2xl">
            Step 3 - Import your Twitter infos to your profile
          </h2>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => updateLSP3ProfileMetadata()}
          >
            📤 Upload Twitter infos to my UP
          </button>
        </div>

        <div className="second-column">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => clearProfileDetails()}
          >
            Clear UP profile details
          </button>
          {/* <button>
            <a href="/">Go back home</a>
          </button> */}
        </div>
      </div>

      <hr className="mt-8 mb-8" />

      <h2 className="text-1sm italic">Generated LSP3Profile JSON Metadata</h2>
      <div className="mt-8">
        <Prism language="json" withLineNumbers scrollAreaComponent="div">
          {JSON.stringify(lsp3ProfileDataJSON, null, 4)}
        </Prism>
      </div>
    </div>
  );
}
