import { readFileSync } from "node:fs";
import { Environment } from "./types.js";

const groupByJsonPath: keyof Environment = "platform";

const newResults: any[] = [];
JSON.parse(readFileSync("./results.json", "utf-8")).forEach(
  (x: { environment: Environment }) => {
    x.totalsInMs.forEach((y: any) => {
      newResults.push({
        command: x.commandName,
        project: x.projectName,
        duration: y / 1000,
        groupByValue: x.environment[groupByJsonPath],
      });
    });
  }
);
console.log(JSON.stringify(newResults, null, 2));
