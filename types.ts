export interface Command {
  name: string;
  npmScriptName?: string; // `npm run ${npmScriptName}`
  npxCommand?: string; // `npx ${npxCommand}`
  npmCommand?: string; // `npm ${npmCommand}`
}

export type BasicValueType = boolean | number | string;

export interface Patch {
  name: string;
  file: string;
  search?: string;
  replace?: string;
  delete?: true;
  append?: string;
}

export interface Project {
  name: string;
  gitUrl: string;
  gitCliConfigOverrides: Record<string, BasicValueType>;
  rootFolder: string;
  patches?: Patch[];
  commands: Command[];
}

export interface RunWithNodeenvResult {
  output: string;
  error: string;
}

export interface Environment extends Record<string, BasicValueType> {
  deviceName: string; // work laptop, home PC, etc.
  platform: NodeJS.Platform; // win32, linux, etc.
  platformDetails: string; // WSL2, Ubuntu 22.04.1, etc.
  // ... any other custom env characteristics, like power mode or overclocking, etc.
}
