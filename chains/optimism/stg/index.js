import { StargateToken } from "../../../abis";

const address = "0x296F55F8Fb28E498B858d0BcDA06D955B2Cb3f97";
export const STG = {
  ticker: "STG",
  address,
  abi: StargateToken,
  decimals: 18,
};

export { STGVotingEscrow } from "./stgVotingEscrow";
