import { config } from "../config";

export const NATIVE_TOKEN_ADDRESS =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export const SLIPPAGE_MULTIPLIER = 1 - config.slippage / 100;

export const REQUIRED_STABLE_USD_AMOUNT_FOR_MAIN_ACCOUNT = 0.5;
export const REQUIRED_NATIVE_USD_AMOUNT_FOR_ACCOUNT = 2;

export const APPROVAL_AMOUNT_MULTIPLIER = 10;

export const LOADER_FRAMES = ["-", "\\", "|", "/"];

export { chainToColor } from "./chainToColor";
export { moduleToColor } from "./moduleToColor";
