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
  rootFolder: string;
  patches?: Patch[];
  commands: Command[];
}

export interface RunWithNodeenvResult {
  output: string;
  error: string;
}
