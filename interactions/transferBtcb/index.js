import { prepare } from "./prepare";
import { execute } from "./execute";

export const transferBtcb = {
  name: "transferBtcb",
  label: "Transfer BTCb",
  moduleName: "bitcoinbridge",
  availableChains: ["polygon", "bsc", "arbitrum", "optimism", "avalanche"],
  prepare,
  execute,
};
