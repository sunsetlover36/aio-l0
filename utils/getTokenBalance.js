import { Contract } from "ethers";

export const getTokenBalance = async (wallet, { token }) => {
  const tokenContract = new Contract(token.address, token.abi, wallet);
  return await tokenContract.balanceOf(wallet.address);
};
