export interface Command {
  name: string;
  npmScriptName: string;
}

export interface Patch {
  name: string;
  file: string;
  search?: string;
  replace?: string;
  delete?: true;
}

export interface Project {
  name: string;
  gitUrl: string;
  rootFolder: string;
  patches?: Patch[];
  commands: Command[];
}
