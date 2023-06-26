import { prepare } from "./prepare";
import { execute } from "./execute";

export const transferTokenAptos = {
  name: "transferTokenAptos",
  label: "Transfer to Aptos",
  moduleName: "theaptosbridge",
  availableChains: ["polygon", "bsc", "arbitrum", "optimism", "avalanche"],
  prepare,
  execute,
};
