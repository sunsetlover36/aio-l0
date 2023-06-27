export const config = {
  stgStakePeriodInMonths: 6,
  slippage: 1,
  percentage: {
    swapToGeth: 5,
    swapToBtcb: 5,
  },
  chainsForInteractions: [
    "avalanche",
    "polygon",
    "arbitrum",
    "bsc",
    "optimism",
  ],
  chainsCount: {
    min: 3,
    max: 4,
  },
  interactionsInterval: {
    min: 45,
    max: 120,
  },
  interactionsCount: {
    lockStg: 1,
    transferBtcb: 2,
    transferEthToGoerli: 2,
    transferTokenAptos: 1,
    transferTokenHarmony: 1,
    transferTokenStargate: Infinity,
  },
  stablesForInteraction: {
    min: 0.02,
    max: 0.4,
  },
};
