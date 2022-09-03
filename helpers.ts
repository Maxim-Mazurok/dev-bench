import { ExecSyncOptionsWithStringEncoding } from "child_process";
import humanizeDuration from "humanize-duration";
import { mean, std } from "mathjs";

// from https://stackoverflow.com/a/30452949/4536543
const runFunctionTimes =
  (repeatTimes: number) => (functionToRepeat: Function) => {
    if (repeatTimes > 0) {
      functionToRepeat();
      runFunctionTimes(repeatTimes - 1)(functionToRepeat);
    }
  };

const secondsToMs = (seconds: number) => seconds * 1_000;
const nanosecondsToMs = (nanoseconds: number) => nanoseconds / 1_000_000;

const measureFunctionTimeInMs = (functionToMeasure: Function) => {
  const startTime = process.hrtime();

  functionToMeasure();

  const elapsedTime = process.hrtime(startTime);

  return secondsToMs(elapsedTime[0]) + nanosecondsToMs(elapsedTime[1]);
};

export const measureAverageFunctionTimeInMs = (
  functionToMeasure: Function,
  times = 3,
  onlyConsecutive = true,
  coolDownSeconds = 5
) => {
  const totals: number[] = [];
  if (onlyConsecutive) {
    functionToMeasure(); // first run doesn't count (caching, etc.)
  }

  sleep(coolDownSeconds); // sleep before running benchmarks

  runFunctionTimes(times)(() => {
    totals.push(measureFunctionTimeInMs(functionToMeasure));
    sleep(coolDownSeconds);
  });
  return totals;
};

export const analyseTotals = (
  totals: number[]
): { mean: number; std: number } => ({
  mean: mean(totals) as number,
  std: std(totals, "unbiased"),
});

export const execSyncDefaultOptions: ExecSyncOptionsWithStringEncoding = {
  encoding: "utf-8",
};

// const nvm = (projectRootFolder: Project["rootFolder"]) => {
//   const getCommand = () => {
//     if (existsSync(join(projectRootFolder, ".nvmrc"))) {
//       return "nvm i";
//     }
//     return `nvm i ${
//       JSON.parse(readFileSync(join(projectRootFolder, "package.json"), "utf-8"))
//         .engines.node
//     }`;
//   };
//   execSync(getCommand(), {
//     ...execSyncDefaultOptions,
//     cwd: projectRootFolder,
//     shell: "/bin/bash",
//   });
// };

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
      ms: () => "ms",
    },
  },
});

export const humanizeDurationRound = (timeMs: number) =>
  shortEnglishHumanizer(timeMs, { round: true, spacer: "" });

/**
 * @param seconds Seconds to wait
 */
export const sleep = (seconds: number) => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, seconds * 1000);
};
