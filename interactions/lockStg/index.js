import { prepare } from "./prepare";
import { execute } from "./execute";

export const lockStg = {
  name: "lockStg",
  label: "Stake STG",
  availableChains: ["polygon", "bsc", "arbitrum", "optimism", "avalanche"],
  prepare,
  execute,
};
