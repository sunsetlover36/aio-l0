import { JsonRpcProvider } from "ethers";

import { USDC } from "./usdc";
import { WAVAX } from "./wavax";
import { WETH } from "./weth";
import { BTCb, BTCbProxyOFT } from "./btcb";
import { STG, STGVotingEscrow } from "./stg";
import { TraderJoe } from "./traderjoe";
import { Woo } from "./woo";
import { LayerZero } from "./layerzero";
import { LiFi } from "./lifi";
import { AptosBridge } from "./aptosBridge";

const provider = new JsonRpcProvider("https://rpc.ankr.com/avalanche");

export const avalanche = {
  name: "Avalanche",
  provider,
  nativeToken: {
    ticker: "AVAX",
    coinGeckoId: "avalanche-2",
  },
  contracts: {
    tokens: {
      USDC,
      WAVAX,
      BTCb,
      WETH,
      STG,
    },
    services: {
      TraderJoe,
      Woo,
      LayerZero,
      LiFi,
      AptosBridge,
      STGVotingEscrow,
      BTCbProxyOFT,
    },
  },
  chainId: 43114,
  lzChainId: 106,
};
