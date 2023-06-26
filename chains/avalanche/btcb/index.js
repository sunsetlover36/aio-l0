import { AvalancheBridgeToken } from "../../../abis";

const address = "0x152b9d0FdC40C096757F570A51E494bd4b943E50";
export const BTCb = {
  ticker: "BTC.b",
  address,
  abi: AvalancheBridgeToken,
  decimals: 8,
};

export { BTCbProxyOFT } from "./btcbProxyOft";
