import figlet from "figlet";

import { chainToColor, moduleToColor } from "../constants";
import { chalk } from "./chalk";

export const logIntro = () => {
  console.log(
    `\n${chalk.cyanBright(
      figlet.textSync("RUBURI", {
        font: "Alligator",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 150,
        whitespaceBreak: true,
      })
    )}\n`
  );
  console.log(
    chalk.cyanBright.bold("👽 L0 AIO from https://t.me/ruburi with 💘")
  );
  console.log(
    chalk.cyanBright.bold(
      `👽 Available chains: Arbitrum, Avalanche, BSC, Optimism, Polygon\n`
    )
  );
};
export const logWork = ({ walletAddress, chainName, interaction }) => {
  console.log(
    `${chalk.cyanBright(
      `[LOG ${walletAddress.slice(0, 6)}..${walletAddress.slice(-3)}]`
    )} ${chainToColor[chainName](chainName.toUpperCase())} > ${interaction}`
  );
};
export const logBridge = ({ log, moduleName, toChainName }) => {
  log(
    `${moduleToColor[moduleName](moduleName)} > Bridging to ${chainToColor[
      toChainName.toLowerCase()
    ](toChainName.toUpperCase())}...`
  );
};
export const workLogger = ({ walletAddress, chainName }) => {
  return (interaction) => {
    logWork({ walletAddress, chainName, interaction });
  };
};
