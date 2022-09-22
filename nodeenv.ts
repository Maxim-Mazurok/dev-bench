import { exec, ExecOptions, execSync } from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";
import { EOL, platform } from "node:os";
import { dirname, isAbsolute, join } from "node:path";
import allNodeVersions from "all-node-versions";
import normalizeNodeVersion from "normalize-node-version";

import { fileURLToPath } from "url";
import { TempFolderManager } from "./TempFolderManager.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

export const debug = (stringOrObject: string | object) => {
  if (process.env.DEBUG?.toLowerCase() !== "true") return;
  const string =
    typeof stringOrObject === "object"
      ? JSON.stringify(stringOrObject, null, 2)
      : stringOrObject;
  appendFileSync("log.txt", string + EOL);
};

export type Engines = {
  node: string;
  npm: string;
};

export const getPythonExecutable = (): "python" | "python3" | null => {
  const checkExists = (executable: "python" | "python3"): boolean => {
    try {
      const result = execSync(`${executable} --version`, {
        encoding: "utf-8",
        stdio: "pipe",
      });
      if (result.startsWith("Python 3.")) return true;
      // eslint-disable-next-line no-empty
    } catch (e) {}
    return false;
  };
  if (checkExists("python")) return "python";
  if (checkExists("python3")) return "python3";
  return null;
};

export const getEngines = async (
  packageJsonPath = "package.json"
): Promise<Engines | undefined> => {
  if (!isAbsolute(packageJsonPath))
    packageJsonPath = join(__dirname, packageJsonPath);

  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8")) as {
    engines?: {
      node?: string;
      npm?: string;
    };
  };

  if (
    packageJson.engines &&
    packageJson.engines.node &&
    packageJson.engines.npm
  ) {
    const engines = {
      node: await normalizeNodeVersion(packageJson.engines.node),
      npm: packageJson.engines.npm,
    };

    return engines;
  }
};

const nodeenvActivate = (nodeenvPath: string) =>
  platform() === "win32"
    ? [join(nodeenvPath, "Scripts", "activate")]
    : [". " + join(nodeenvPath, "bin", "activate")];

export const isDefaultNpmVersion = async (node: string, npm: string) => {
  const nodeNormalized = await normalizeNodeVersion(node);
  const { versions } = await allNodeVersions();
  const defaultNpm = versions.find((x) => x.node === nodeNormalized)?.npm;
  return defaultNpm === npm;
};

const getNodeenvCommand = ({ node }: Engines, nodeenvPath: string): string => {
  const nodeenvCommand = `${getPythonExecutable()} -m nodeenv ${nodeenvPath} --node=${node}`;
  debug({ nodeenvCommand });
  return nodeenvCommand;
};

const getNodeenvActivateCommands = async (
  { node, npm }: Engines,
  nodeenvPath: string
): Promise<string[]> => {
  const nodeenvCommands = [...nodeenvActivate(nodeenvPath)];
  if ((await isDefaultNpmVersion(node, npm)) === false) {
    nodeenvCommands.push(`npm install --global npm@${npm}`);
  }
  debug({ nodeenvCommands });
  return nodeenvCommands;
};

export const runWithNodeenv = async (
  command: string,
  nodeenvPath: string,
  tempFolderManager: TempFolderManager,
  cwd?: string
) => {
  const useNodeenv: string[] = [];

  if (
    command === "npm install" ||
    command === "npm i" ||
    command === "npm ci"
  ) {
    const cacheFolderFullPath = tempFolderManager.add("npm_cache");
    command += ` --cache ${cacheFolderFullPath}`;
  }
  useNodeenv.push(...nodeenvActivate(nodeenvPath));

  const options: ExecOptions = {
    ...(cwd ? { cwd } : {}),
  };

  if (platform() === "win32") {
    const newEnv = { ...process.env }; // workaround for https://github.com/ekalinin/nodeenv/issues/309
    for (const key in newEnv) {
      if (key.startsWith("npm_")) {
        delete newEnv[key];
      }
    }
    options.env = newEnv;
  } else {
    options.shell = "/bin/bash";
  }

  debug({ useNodeenv, command, options });

  return exec([...useNodeenv, command].join(" && "), options);
};

export const installNodeenv = async (
  engines: Engines,
  cwd: string,
  nodeenvPath: string
) => {
  const useNodeenv = [
    getNodeenvCommand(engines, nodeenvPath),
    ...(await getNodeenvActivateCommands(engines, nodeenvPath)),
  ];

  const options: ExecOptions = {
    ...(cwd ? { cwd } : {}),
  };

  if (platform() === "win32") {
    const newEnv = { ...process.env }; // workaround for https://github.com/ekalinin/nodeenv/issues/309
    for (const key in newEnv) {
      if (key.startsWith("npm_")) {
        delete newEnv[key];
      }
    }
    options.env = newEnv;
  } else {
    options.shell = "/bin/bash";
  }

  debug({ useNodeenv, options });

  return exec([...useNodeenv].join(" && "), options);
};
