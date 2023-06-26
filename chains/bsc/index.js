import { JsonRpcProvider } from "ethers";

import { USDT } from "./usdt";
import { USDC } from "./usdc";
import { BTCb } from "./btcb";
import { STG, STGVotingEscrow } from "./stg";
import { ProxyERC20 } from "./proxyErc20";
import { LiFi } from "./lifi";
import { LayerZero } from "./layerzero";
import { AptosBridge } from "./aptosBridge";

const provider = new JsonRpcProvider("https://rpc.ankr.com/bsc");

export const bsc = {
  name: "BSC",
  provider,
  nativeToken: {
    ticker: "BNB",
    coinGeckoId: "binancecoin",
    decimals: 18,
  },
  contracts: {
    tokens: {
      USDT,
      USDC,
      BTCb,
      STG,
    },
    services: {
      LiFi,
      ProxyERC20,
      LayerZero,
      AptosBridge,
      STGVotingEscrow,
    },
  },
  chainId: 56,
  lzChainId: 102,
};
