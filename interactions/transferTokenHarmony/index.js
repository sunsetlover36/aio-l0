import { prepare } from "./prepare";
import { execute } from "./execute";

export const transferTokenHarmony = {
  name: "transferTokenHarmony",
  label: "Transfer to Harmony",
  moduleName: "layerzero.bridge.harmony",
  availableChains: ["bsc", "arbitrum"],
  prepare,
  execute,
};
