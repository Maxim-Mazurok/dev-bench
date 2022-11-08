import { Engines } from "./nodeenv.js";
import { Environment, Project } from "./types.js";

// defaults
export const runBenchmarksTimes = 3;
export const coolDownBeforeAndBetweenBenchmarksSeconds = 5;
export const defaultEngines: Engines = {
  // will use this if there is no "engines" section in package.json
  node: "16.13.0",
  npm: "8.1.0",
};

export const environment: Partial<Environment> = {
  deviceName: "Work Laptop", // detected automatically from `os.hostname` if not specified
  platform: "linux", // detected automatically from `process.platform` if not specified
  platformDetails: "WSL2 (Ubuntu 22.04.1)", // TODO: maybe detect automatically using https://www.npmjs.com/package/getos

  // BIOS Settings (optional):
  "bios: Intel® Turbo Boost Max Technology 3.0": true,

  // Other Settings (optional):
  batteryLevelPercent: 100,
  powerMode: "Best performance",
  charging: true,
};

// config
export const projects: Project[] = [
  {
    name: "My App",
    gitUrl: "https://github.com/my/app",
    gitCliConfigOverrides: {
      "core.autocrlf": true,
    },
    rootFolder: "Frontend/src",
    patches: [
      {
        name: "disable some failing test",
        file: "tests/some.spec.js",
        search: "it('some test name',",
        replace: "xit('some test name',",
      },
      {
        name: "delete some failing test",
        file: "tests/docker.spec.js",
        delete: true,
      },
      {
        name: "ignore some folder",
        file: ".gitignore",
        append: "some-folder",
      },
    ],
    commands: [
      { name: "build", npmScriptName: "build-dev" },
      { name: "unit test", npmScriptName: "test-karma" },
    ],
  },
];
