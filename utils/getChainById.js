import { chains } from "../chains";

export const getChainById = (id) => {
  return Object.values(chains).find((chain) => chain.chainId === Number(id));
};
