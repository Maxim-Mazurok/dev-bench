import { readFileSync } from "node:fs";
// import { analyseTotals } from "./helpers.js";

const newResults: any[] = [];
JSON.parse(readFileSync("./results.json", "utf-8")).forEach((x: any) => {
  x.totalsInMs.forEach((y: any) => {
    newResults.push({
      command: x.commandName,
      project: x.projectName,
      duration: y / 1000,
      environment: x.environment.platform === "linux" ? "WSL" : "Windows",
    });
  });
});
console.log(JSON.stringify(newResults, null, 2));
