import { JsonRpcProvider } from "ethers";

import { LayerZero } from "./layerzero";
import { LiFi } from "./lifi";
import { USDC } from "./usdc";
import { STG, STGVotingEscrow } from "./stg";
import { BTCb } from "./btcb";
import { AptosBridge } from "./aptosBridge";

const provider = new JsonRpcProvider("https://poly-rpc.gateway.pokt.network");

export const polygon = {
  name: "Polygon",
  provider,
  nativeToken: {
    ticker: "MATIC",
    coinGeckoId: "matic-network",
    decimals: 18,
  },
  gas: {
    maxFeePerGas: 40000000000,
    maxPriorityFeePerGas: 40000000000,
  },
  contracts: {
    tokens: {
      USDC,
      BTCb,
      STG,
    },
    services: {
      LayerZero,
      LiFi,
      AptosBridge,
      STGVotingEscrow,
    },
  },
  chainId: 137,
  lzChainId: 109,
};
