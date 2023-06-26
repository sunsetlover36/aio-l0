import { prepare } from "./prepare";
import { execute } from "./execute";

export const transferEthToGoerli = {
  name: "transferEthToGoerli",
  label: "Transfer ETH to Goerli",
  moduleName: "testnetbridge",
  availableChains: ["arbitrum", "optimism"],
  prepare,
  execute,
};
