import { BscBEP20TokenImplementation } from "../../../abis";

const address = "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d";
export const USDC = {
  ticker: "USDC",
  address,
  abi: BscBEP20TokenImplementation,
  decimals: 18,
};
