import LZRouter from "./LZRouter.json" assert { type: "json" };
import LZEndpoint from "./LZEndpoint.json" assert { type: "json" };
import StargatePool from "./StargatePool.json" assert { type: "json" };
import ProxyERC20 from "./ProxyERC20.json" assert { type: "json" };
import GenericSwapFacet from "./GenericSwapFacet.json" assert { type: "json" };
import HyphenFacet from "./HyphenFacet.json" assert { type: "json" };
import BTCbOFT from "./BTCbOFT.json" assert { type: "json" };
import SwappableBridgeUniswapV3 from "./SwappableBridgeUniswapV3.json" assert { type: "json" };
import AptosTokenBridge from "./AptosTokenBridge.json" assert { type: "json" };
import StargateToken from "./StargateToken.json" assert { type: "json" };
import STGVotingEscrow from "./STGVotingEscrow.json" assert { type: "json" };
import UniswapQuoter from "./UniswapQuoter.json" assert { type: "json" };

export {
  LZRouter,
  LZEndpoint,
  StargatePool,
  ProxyERC20,
  GenericSwapFacet,
  HyphenFacet,
  BTCbOFT,
  SwappableBridgeUniswapV3,
  AptosTokenBridge,
  StargateToken,
  STGVotingEscrow,
  UniswapQuoter,
};

export * from "./avalanche";
export * from "./arbitrum";
export * from "./bsc";
export * from "./polygon";
export * from "./optimism";
