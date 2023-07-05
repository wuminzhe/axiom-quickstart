import { Axiom, AxiomConfig } from "@axiom-crypto/core";
import dotenv from "dotenv";
import { ethers } from "ethers";
dotenv.config();

let providerUri = process.env.PROVIDER_URI as string;
if (!providerUri || providerUri === "") {
  providerUri = "http://127.0.0.1:8545";
}
const config: AxiomConfig = {
  providerUri,
  version: "v1",
  chainId: 5,
  mock: true,
};
const ax = new Axiom(config);

function convertNumbersToHex(obj: any) {
  const convertedObj: any = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (typeof value === "number") {
        convertedObj[key] = ethers.toBeHex(value);
      } else {
        convertedObj[key] = value;
      }
    }
  }

  return convertedObj;
}

async function main() {
  // get a responseTree from the transaction hash of the sendQuery transaction
  // you can find this in explorer.axiom.xyz
  const responseTree = await ax.query.getResponseTreeFromTxHash(
    "0xc25726722a6940e0bc9e3066a9c59f24f6c8a19db604fb9e2321662f5dc4fa5d"
  );

  const keccakBlockResponse = responseTree.blockTree.getHexRoot();
  const keccakAccountResponse = responseTree.accountTree.getHexRoot();
  const keccakStorageResponse = responseTree.storageTree.getHexRoot();
  let res1 = ax.query.getValidationWitness(
    responseTree,
    6779167,
    "0x6337b3caf9c5236c7f3d1694410776119edaf9fa",
    "0x8"
  );
  let res2 = ax.query.getValidationWitness(
    responseTree,
    7778167,
    "0x6337b3caf9c5236c7f3d1694410776119edaf9fa",
    8 // slot can be BigNumberish
  );
  console.log(
    JSON.stringify({
      keccakResponses: {
        keccakBlockResponse,
        keccakAccountResponse,
        keccakStorageResponse,
      },
      storageResponses: [res1, res2].map((res) =>
        convertNumbersToHex(res?.storageResponse)
      ),
    })
  );
}

main();
