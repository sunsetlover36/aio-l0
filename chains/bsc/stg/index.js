import { StargateToken } from "../../../abis";

const address = "0xB0D502E938ed5f4df2E681fE6E419ff29631d62b";
export const STG = {
  ticker: "STG",
  address,
  abi: StargateToken,
  decimals: 18,
};

export { STGVotingEscrow } from "./stgVotingEscrow";
