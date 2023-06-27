import { config } from "../config";
import * as interactions from "../interactions";
import { shuffleArray } from "./shuffleArray";
import { randint } from "./randint";

const { chainsCount, interactionsCount } = config;

export const randomizeInteractions = (sieve, interactionsDone) => {
  const chainsNumber = randint(chainsCount.min, chainsCount.max);
  const chainsForInteractions = [
    sieve[0],
    ...(chainsCount === 1 ? [] : shuffleArray(sieve.slice(1, chainsNumber))),
  ];

  const todos = chainsForInteractions.map((chainName) => {
    const availableInteractions = Object.values(interactions).filter(
      ({ name, availableChains }) => {
        const isAvailable =
          availableChains.includes(chainName) &&
          interactionsDone[name] < interactionsCount[name];
        if (isAvailable) {
          interactionsDone[name]++;
        }

        return isAvailable;
      }
    );
    return {
      chainName,
      chainInteractions: shuffleArray(availableInteractions)
        .sort((aI, bI) => {
          if (aI.name === "transferTokenStargate") {
            return 1;
          }
          if (bI.name === "transferTokenStargate") {
            return -1;
          }
          return 0;
        })
        .slice(0, randint(1, availableInteractions.length)),
    };
  });

  return todos;
};
