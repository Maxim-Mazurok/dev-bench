import { execSync } from "child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join, sep } from "path";
import { projects } from "./config";
import {
  analyseTotals,
  execSyncDefaultOptions,
  humanizeDurationRound,
  measureAverageFunctionTimeInMs,
} from "./helpers";
import rimraf from "rimraf";
import { Command, Patch, Project } from "./types";

class ProcessProject {
  private project: Project;
  private repositoryFolder: string;

  constructor(project: Project) {
    this.project = project;
    this.repositoryFolder = getRepositoryFolder();
  }

  private get projectRootFolder() {
    return join(this.repositoryFolder, this.project.rootFolder);
  }

  private npmCi() {
    return npm(["ci"], this.projectRootFolder);
  }

  private processPatch(patch: Patch) {
    const fullFilePath = join(this.projectRootFolder, patch.file);
    if (patch.delete === true) {
      rmSync(fullFilePath);
      return;
    } else if (patch.search !== undefined && patch.replace !== undefined) {
      const original = readFileSync(fullFilePath, "utf-8");
      const patched = original.replace(patch.search, patch.replace);
      writeFileSync(fullFilePath, patched);
    }
  }

  private processCommand(command: Command) {
    console.log(`Benchmarking "${command.name}"...`);
    const totals = measureAverageFunctionTimeInMs(() =>
      npmRun(command.npmScriptName, this.projectRootFolder)
    );
    const { mean, std } = analyseTotals(totals);
    console.log(
      `Average: ${humanizeDurationRound(mean)} ±${humanizeDurationRound(std)}`
    );
  }

  main() {
    clone(this.project.gitUrl, this.repositoryFolder);
    this.npmCi();

    this.project.patches?.forEach(this.processPatch.bind(this));

    console.log(`Processing ${this.project.name}`);
    this.project.commands.forEach(this.processCommand.bind(this));

    rimraf.sync(this.repositoryFolder);
  }
}

const getRepositoryFolder = () => mkdtempSync(join(tmpdir(), "dev-bench"));

const clone = (gitUrl: Project["gitUrl"], repositoryFolder: string) =>
  execSync(`git clone ${gitUrl} ${repositoryFolder}`, execSyncDefaultOptions);

const npm = (args: string[], cwd: string) =>
  execSync(`npm ${args.join(" ")}`, {
    ...execSyncDefaultOptions,
    cwd,
  });

const npmRun = (
  npmScriptName: Command["npmScriptName"],
  projectRootFolder: Project["rootFolder"]
) => npm(["run", npmScriptName], projectRootFolder);

projects.forEach((project) => {
  const processProject = new ProcessProject(project);
  processProject.main();
});
