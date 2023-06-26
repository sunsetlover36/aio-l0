import { chains } from "../chains";

export const getStableToken = (chain) => {
  const {
    name,
    contracts: {
      tokens: { USDC, USDT },
    },
  } = chain;

  return name === chains.bsc.name ? USDT : USDC;
};
