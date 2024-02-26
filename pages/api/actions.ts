import { ethers, Contract } from "ethers";
import axios from "axios";
import LSP4Artifact from "@lukso/lsp-smart-contracts/artifacts/LSP4DigitalAssetMetadata.json";
import UniversalProfileArtifact from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";
import { INTERFACE_IDS } from "@lukso/lsp-smart-contracts";

import ERC725 from "@erc725/erc725.js";
import LSP4Schema from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json";
import LSP12Schema from "@erc725/erc725.js/schemas/LSP12IssuedAssets.json";
import { URLDataWithHash } from "@erc725/erc725.js/build/main/src/types";

const RPC_URL = "https://rpc.testnet.lukso.gateway.fm";

export async function loadContract(assetAddress: string) {
  try {
    const erc725 = new ERC725(LSP4Schema, assetAddress, RPC_URL, {
      ipfsGateway: "https://api.universalprofile.cloud/ipfs",
    });

    const [
      { value: assetName },
      { value: assetSymbol },
      { value: assetMetadata },
    ] = await erc725.getData([
      "LSP4TokenName",
      "LSP4TokenSymbol",
      "LSP4Metadata",
    ]);

    if (assetMetadata) {
      const { url } = assetMetadata as URLDataWithHash;

      const fullUrl =
        "https://api.universalprofile.cloud/ipfs/" + url.substring(7);

      const {
        data: {
          LSP4Metadata: {
            description: assetDescription,
            attributes: assetAttributes,
          },
        },
      } = await axios.get(fullUrl);

      const attributeValues = assetAttributes.map(
        (attribute: any) => attribute.key + ": " + attribute.value
      );

      return {
        name: assetName as string,
        symbol: assetSymbol as string,
        description: assetDescription,
        attributes: attributeValues,
      };
    }
  } catch (error) {
    console.error(error);
  }
}

export async function setLSP12IssuedAsset(
  assetAddress: string,
  upAddress: string
) {
  try {
  } catch (error) {
    console.error(error);
  }
  const erc725 = new ERC725(LSP12Schema);

  const encodedData = erc725.encodeData([
    {
      keyName: "LSP12IssuedAssets[]",
      value: [assetAddress],
    },
    {
      keyName: "LSP12IssuedAssetsMap:<address>",
      dynamicKeyParts: assetAddress,
      value: [
        INTERFACE_IDS.LSP8IdentifiableDigitalAsset,
        ERC725.encodeValueType("uint128", 0),
      ],
    },
  ]);

  const provider = new ethers.BrowserProvider(window.lukso);
  const signer = await provider.getSigner();

  const universalProfileContract = new Contract(
    upAddress,
    UniversalProfileArtifact.abi,
    signer
  );

  await universalProfileContract.setDataBatch(
    encodedData.keys,
    encodedData.values,
    {
      from: upAddress,
    }
  );
}

export async function claimPOAP(
  assetAddress: string,
  universalProfileAddress: string
) {
  const provider = new ethers.BrowserProvider(window.lukso);
  const signer = await provider.getSigner();

  const assetContract = new Contract(
    assetAddress,
    [
      {
        inputs: [],
        name: "claim",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    signer
  );

  await assetContract.claim({ from: signer });
}
