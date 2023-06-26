import { readFileSync } from "fs";
import consoleStamp from "console-stamp";

import * as interactions from "./interactions";
import { getDir, logIntro } from "./utils";
import { prepare, work } from "./scenarios";

const main = async () => {
  const keys = JSON.parse(readFileSync(getDir("keys.json"), "utf8"));

  const preparedKeysList = await prepare(keys);
  await Promise.all(
    preparedKeysList.map(async (preparedKeys) => {
      const interactionsDone = Object.fromEntries(
        Object.keys(interactions).map((interaction) => [interaction, 0])
      );
      await work(preparedKeys, interactionsDone);
    })
  );
};

logIntro();
consoleStamp(console, {
  format: ":date(yyyy/mm/dd HH:MM:ss)",
});
main();
