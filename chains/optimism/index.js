import { JsonRpcProvider } from "ethers";

import { USDC } from "./usdc";
import { BTCb } from "./btcb";
import { GETH } from "./geth";
import { STG, STGVotingEscrow } from "./stg";
import { LiFi } from "./lifi";
import { LayerZero } from "./layerzero";
import { TestnetBridge } from "./testnetBridge";
import { AptosBridge } from "./aptosBridge";

const provider = new JsonRpcProvider("https://rpc.ankr.com/optimism");

export const optimism = {
  name: "Optimism",
  provider,
  nativeToken: {
    ticker: "ETH",
    coinGeckoId: "ethereum",
    decimals: 18,
  },
  contracts: {
    tokens: {
      USDC,
      BTCb,
      GETH,
      STG,
    },
    services: {
      LayerZero,
      LiFi,
      TestnetBridge,
      AptosBridge,
      STGVotingEscrow,
    },
  },
  chainId: 10,
  lzChainId: 111,
};
