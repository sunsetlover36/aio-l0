import { JsonRpcProvider, parseUnits } from "ethers";

import { USDC } from "./usdc";
import { BridgedUSDC } from "./bridgedUsdc";
import { WETH } from "./weth";
import { GETH } from "./geth";
import { STG, STGVotingEscrow } from "./stg";
import { BTCb } from "./btcb";
import { Woo } from "./woo";
import { TestnetBridge } from "./testnetBridge";
import { Uniswap } from "./uniswap";
import { LayerZero } from "./layerzero";
import { LiFi } from "./lifi";
import { AptosBridge } from "./aptosBridge";
import { ProxyERC20 } from "./proxyErc20";

const provider = new JsonRpcProvider("https://rpc.ankr.com/arbitrum");

export const arbitrum = {
  name: "Arbitrum",
  provider,
  nativeToken: {
    ticker: "ETH",
    coinGeckoId: "ethereum",
    decimals: 18,
  },
  chainId: 42161,
  lzChainId: 110,
  gas: {
    gasPrice: parseUnits("0.1", "gwei"),
  },
  contracts: {
    tokens: {
      USDC,
      BridgedUSDC,
      WETH,
      GETH,
      STG,
      BTCb,
    },
    services: {
      Woo,
      TestnetBridge,
      Uniswap,
      LayerZero,
      LiFi,
      STGVotingEscrow,
      AptosBridge,
      ProxyERC20,
    },
  },
};
