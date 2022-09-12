export interface Command {
  name: string;
  npmScriptName?: string; // `npm run ${npmScriptName}`
  npxCommand?: string; // `npx ${npxCommand}`
  npmCommand?: string; // `npm ${npmCommand}`
}

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
  gitCliConfigOverrides: {
    [key: string]: boolean | number | string;
  };
  rootFolder: string;
  patches?: Patch[];
  commands: Command[];
}

export interface RunWithNodeenvResult {
  output: string;
  error: string;
}

export interface Environment {
  deviceName: string; // work laptop, home PC, etc.
  platform: NodeJS.Platform; // win32, linux, etc.
  platformDetails: string; // WSL2, Ubuntu 22.04.1, etc.
  biosSettings: {
    [key: string]: boolean | number | string; // for example, { "Intel® Turbo Boost Max Technology 3.0": false }
  };
  otherSettings: {
    [key: string]: boolean | number | string; // for example, { "Ambient Temperature": 30 }
  };
}
