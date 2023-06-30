import { Wallet, formatEther } from "ethers";
import BigNumber from "bignumber.js";

import * as interactions from "../interactions";
import {
  getAptosAccountFromPrivateKey,
  getStableToken,
  getTokenBalance,
  logBridge,
  randint,
  randomizeInteractions,
  shuffleArray,
  sleep,
  workLogger,
  chalk,
  convertMonthToMs,
} from "../utils";
import { config } from "../config";
import { CHAINS_TO_WORK_WITH, chains } from "../chains";
import { REQUIRED_USD_AMOUNT_FOR_MAIN_ACCOUNT } from "../constants";
import { getUsdPrice } from "../api";

const {
  interactionsInterval,
  interactionsCount,
  stablesForInteraction,
  percentage,
  stgStakePeriodInMonths,
} = config;

const getRandomChain = (sieve, filter = []) => {
  const shuffledChains = shuffleArray(
    sieve.filter((chain) => !filter.includes(chain))
  );

  if (shuffledChains.length === 0) {
    const randomChainName = shuffleArray(CHAINS_TO_WORK_WITH)[0];
    return chains[randomChainName];
  }

  return chains[shuffledChains[0]];
};

const areAllInteractionsDone = (interactionsDone) =>
  Object.entries(interactionsDone).every((entry) => {
    const [interactionName, interactionCount] = entry;
    return interactionCount >= interactionsCount[interactionName];
  });

export const work = async ({ keys, sieve }, interactionsDone) => {
  const { evmKey, aptosKey } = keys;

  const todos = randomizeInteractions(sieve, interactionsDone);
  for (const [index, todo] of todos.entries()) {
    const { chainName, chainInteractions } = todo;

    if (chainInteractions.length === 0) {
      break;
    }

    const chain = chains[chainName];
    const {
      provider,
      contracts: {
        tokens: { USDC },
      },
    } = chain;

    const evmWallet = new Wallet(evmKey, provider);
    const nativeBalance = await provider.getBalance(evmWallet.address);

    const stableToken = getStableToken(chain);
    const stableBalance = await getTokenBalance(evmWallet, {
      token: stableToken,
    });

    const aptosWallet = getAptosAccountFromPrivateKey(aptosKey);

    const log = workLogger({ walletAddress: evmWallet.address, chainName });
    for (const interaction of chainInteractions) {
      let destChain =
        index === todos.length - 1
          ? getRandomChain(sieve, [chainName])
          : chains[todos[index + 1].chainName];
      const destStableToken = getStableToken(destChain);

      const stablesAmountForInteraction = new BigNumber(
        randint(stablesForInteraction.min, stablesForInteraction.max)
      )
        .multipliedBy(10 ** stableToken.decimals)
        .toString();

      log(`Executing ${interaction.label}...`);
      try {
        switch (interaction.name) {
          case interactions.transferTokenStargate.name:
            logBridge({
              log,
              moduleName: interactions.transferTokenStargate.moduleName,
              toChainName: destChain.name,
            });

            await interactions.transferTokenStargate.execute(evmWallet, {
              fromToken: stableToken,
              toToken: destStableToken,
              toChainId: destChain.chainId,
              amount: stableBalance,
            });
            break;
          case interactions.lockStg.name:
            await interactions.lockStg.prepare(evmWallet, {
              token: stableToken,
              amount: stablesAmountForInteraction,
            });
            await interactions.lockStg.execute(evmWallet, {
              lockTime: convertMonthToMs(stgStakePeriodInMonths),
            });
            break;
          case interactions.transferBtcb.name:
            logBridge({
              log,
              moduleName: interactions.transferBtcb.moduleName,
              toChainName: destChain.name,
            });

            const transferBtcbParams = await interactions.transferBtcb.prepare(
              evmWallet,
              {
                fromToken: stableToken,
                percentAmount: percentage.swapToBtcb,
                toChainId: destChain.chainId,
              }
            );
            await interactions.transferBtcb.execute(
              evmWallet,
              transferBtcbParams
            );
            break;
          case interactions.transferEthToGoerli.name:
            destChain = chains.goerli;
            logBridge({
              log,
              moduleName: interactions.transferEthToGoerli.moduleName,
              toChainName: destChain.name,
            });

            // Swap {N}% of native token balance to GETH
            await interactions.transferEthToGoerli.execute(evmWallet, {
              amount: new BigNumber(nativeBalance)
                .multipliedBy(percentage.swapToGeth / 100)
                .toString(),
            });
            break;
          case interactions.transferTokenAptos.name:
            destChain = chains.aptos;
            logBridge({
              log,
              moduleName: interactions.transferTokenAptos.moduleName,
              toChainName: destChain.name,
            });

            await interactions.transferTokenAptos.execute(evmWallet, {
              toAddress: aptosWallet.address().toString(),
              token: stableToken,
              amount: stablesAmountForInteraction,
            });
            break;
          case interactions.transferTokenHarmony.name:
            destChain = chains.harmony;
            logBridge({
              log,
              moduleName: interactions.transferTokenHarmony.moduleName,
              toChainName: destChain.name,
            });

            const transferTokenHarmonyParams =
              await interactions.transferTokenHarmony.prepare(evmWallet, {
                amount: stablesAmountForInteraction,
              });
            await interactions.transferTokenHarmony.execute(
              evmWallet,
              transferTokenHarmonyParams
            );
            break;
          default:
            break;
        }

        const sleepFor = randint(
          interactionsInterval.min,
          interactionsInterval.max
        );
        console.log(chalk.gray(`Sleeping for ${sleepFor} seconds...`));
        await sleep(sleepFor);
      } catch {
        log(`An unexpected error occurred when executing ${interaction.name}!`);
      }
    }

    //   await interactions.transferTokenStargate.bridgeStablesForInteraction(
    //     evmWallet,
    //     {
    //       interactionName: interaction.name,
    //       stableToken,
    //       availableChains: sieve,
    //       log,
    //     }
    //   );
  }

  if (sieve.length === 0 || areAllInteractionsDone(interactionsDone)) {
    console.log(chalk.greenBright("Finished work!"));
  } else {
    // Get rid of chains with not enough balance for next iteration
    const chainsWithBalance = (
      await Promise.all(
        sieve.map(async (chain) => {
          const { provider, nativeToken } = chains[chain];
          const evmWallet = new Wallet(evmKey, provider);

          const nativeBalance = formatEther(
            await provider.getBalance(evmWallet.address)
          );
          const usdPrice = await getUsdPrice(nativeToken.coinGeckoId);
          const nativeBalanceInUsd = nativeBalance * usdPrice;

          if (nativeBalanceInUsd > REQUIRED_USD_AMOUNT_FOR_MAIN_ACCOUNT) {
            return chain;
          }
        })
      )
    ).filter((chain) => chain);
    await work({ keys, sieve: chainsWithBalance }, interactionsDone);
  }
};
