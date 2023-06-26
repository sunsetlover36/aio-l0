import { config } from "../config";

export const NATIVE_TOKEN_ADDRESS =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export const SIX_MONTHS_IN_MILLISECONDS = 6 * 30 * 24 * 60 * 60 * 1000;

export const SLIPPAGE_MULTIPLIER = 1 - config.slippage / 100;

export const REQUIRED_USD_AMOUNT_FOR_MAIN_ACCOUNT = 2;
export const REQUIRED_USD_AMOUNT_FOR_SECONDARY_ACCOUNT = 1.25;

export const APPROVAL_AMOUNT_MULTIPLIER = 10;

export { chainToColor } from "./chainToColor";
export { moduleToColor } from "./moduleToColor";
