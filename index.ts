import { exec } from "child_process";
import {
  appendFileSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { defaultEngines, projects } from "./config.js";
import {
  analyseTotals,
  execDefaultOptions,
  humanizeDurationRound,
  measureAverageAsyncFunctionTimeInMs,
} from "./helpers.js";
import rimraf from "rimraf";
import { Command, Patch, Project, RunWithNodeenvResult } from "./types.js";
import {
  debug,
  Engines,
  getEngines,
  installNodeenv,
  runWithNodeenv,
} from "./nodeenv.js";

class ProcessProject {
  private project: Project;
  private projectTempFolder: string;
  private engines: Engines | null = null;

  constructor(project: Project) {
    this.project = project;
    this.projectTempFolder = this.getProjectTempFolder();
  }

  private getProjectTempFolder() {
    return mkdtempSync(join(tmpdir(), "dev-bench_"));
  }

  private get repositoryFolder() {
    return join(this.projectTempFolder, "repository");
  }
  private get nodeenvFolder() {
    return join(this.projectTempFolder, "nodeenv");
  }

  private get projectRootFolder() {
    return join(this.repositoryFolder, this.project.rootFolder);
  }

  private async gitClone() {
    console.log(`Cloning ${this.project.gitUrl} into ${this.repositoryFolder}`);
    const process = exec(
      `git clone ${this.project.gitUrl} ${this.repositoryFolder}`,
      execDefaultOptions
    );
    const result = await this.runProcess(process);
    debug(result);
  }

  private async npmCi() {
    console.log("Installing node modules");
    const result = await this.runWithNodeenv("npm ci");
    debug(result);
  }

  private async getEngines() {
    if (this.engines === null) {
      this.engines =
        (await getEngines(join(this.projectRootFolder, "package.json"))) ??
        defaultEngines;
    }
    return this.engines;
  }

  private async runWithNodeenv(command: string) {
    const process = await runWithNodeenv(
      command,
      this.nodeenvFolder,
      this.projectRootFolder
    );
    return this.runProcess(process);
  }

  private async runProcess(process: ReturnType<typeof exec>) {
    return new Promise<RunWithNodeenvResult>((resolve, reject) => {
      if (process.stdout === null || process.stderr === null) {
        return reject("cant start check process");
      }
      let output = "",
        error = "";
      process.stdout.on("data", (data) => {
        output += data;
      });
      process.stderr.on("data", (data) => {
        error += data;
      });
      process.on("exit", (code) => {
        if (code === 0) {
          resolve({ output, error });
        } else {
          reject(JSON.stringify({ code, error, output }, null, 2));
        }
      });
    });
  }

  private async npmRun(npmScriptName: Required<Command>["npmScriptName"]) {
    return this.runWithNodeenv(["npm", "run", npmScriptName].join(" "));
  }

  private async npx(npxCommand: Required<Command>["npxCommand"]) {
    return this.runWithNodeenv(["npx", npxCommand].join(" "));
  }

  private processPatch(patch: Patch) {
    console.log(`Processing patch: ${patch.name}`);
    const fullFilePath = join(this.projectRootFolder, patch.file);
    if (patch.delete === true) {
      rmSync(fullFilePath);
      return;
    } else if (patch.search !== undefined && patch.replace !== undefined) {
      const original = readFileSync(fullFilePath, "utf-8");
      const patched = original.replace(patch.search, patch.replace);
      writeFileSync(fullFilePath, patched);
    } else if (patch.append !== undefined) {
      appendFileSync(fullFilePath, patch.append, "utf-8");
    }
  }

  private async processCommand(command: Command) {
    console.log(`Processing command: ${command.name}`);

    const { npmScriptName, npxCommand } = command;

    let asyncFunctionToMeasure: () => Promise<RunWithNodeenvResult>;

    if (npmScriptName !== undefined) {
      asyncFunctionToMeasure = () => this.npmRun(npmScriptName);
    } else if (npxCommand !== undefined) {
      asyncFunctionToMeasure = () => this.npx(npxCommand);
    } else {
      throw "no command";
    }

    const totals = await measureAverageAsyncFunctionTimeInMs(
      asyncFunctionToMeasure
    );
    const { mean, std } = analyseTotals(totals);
    console.log(`Totals in ms: ${totals.join(", ")}`);
    console.log(
      `Average: ${humanizeDurationRound(mean)} ±${humanizeDurationRound(std)}`
    );
  }

  private async setupNodeenv() {
    console.log("Setting up nodeenv");
    const nodeenvInstallProcess = await installNodeenv(
      await this.getEngines(),
      this.projectRootFolder,
      this.nodeenvFolder
    );
    const result = await this.runProcess(nodeenvInstallProcess);
    debug(result);
  }

  private cleanUp() {
    console.log("Cleaning up");
    rimraf.sync(this.repositoryFolder);
  }

  async main() {
    console.log(`Processing project: ${this.project.name}`);

    await this.gitClone();

    this.project.patches?.forEach(this.processPatch.bind(this)); // patch before `npm ci` to allow disabling some post-install scripts, etc.

    await this.setupNodeenv();

    await this.npmCi();

    for (const command of this.project.commands) {
      await this.processCommand(command);
    }

    this.cleanUp();
  }
}

for (const project of projects) {
  const processProject = new ProcessProject(project);
  await processProject.main();
}
