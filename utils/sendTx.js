export const sendTx = async (wallet, txData) => {
  let populatedTx;

  try {
    const feeData = await wallet.provider.getFeeData();
    populatedTx = await wallet.populateTransaction({
      ...txData,
      gasPrice: feeData.gasPrice,
    });
  } catch {
    populatedTx = await wallet.populateTransaction(txData);
  }
  const tx = await wallet.sendTransaction(populatedTx);
  await wallet.provider.waitForTransaction(tx.hash);
};
