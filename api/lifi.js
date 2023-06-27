import ky from "ky-universal";

/**
 * Retrieves a quote for a specific HTTP GET request.
 *
 * @param {Object} params - The parameters for the request.
 * @param {string} params.fromChain - The source blockchain.
 * @param {string} params.toChain - The destination blockchain.
 * @param {string} params.fromToken - The source token.
 * @param {string} params.toToken - The destination token.
 * @param {number} params.fromAmount - The amount in the source token to be converted.
 * @param {string} params.fromAddress - The source address for the transaction.
 * @returns {Promise<any>} The quote data.
 */
export const lifiGetQuote = async (params) => {
  const result = await ky.get(`https://li.quest/v1/quote`, {
    timeout: false,
    searchParams: params,
  });
  return await result.json();
};
