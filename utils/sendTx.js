export const sendTx = async (wallet, txData, gasParams) => {
  let populatedTx;

  try {
    if (gasParams) {
      throw new Error();
    }

    const feeData = await wallet.provider.getFeeData();
    populatedTx = await wallet.populateTransaction({
      ...txData,
      gasPrice: feeData.gasPrice,
    });
  } catch {
    populatedTx = await wallet.populateTransaction({
      ...txData,
      ...(gasParams || {}),
    });
  }
  const tx = await wallet.sendTransaction(populatedTx);
  await wallet.provider.waitForTransaction(tx.hash);
};
