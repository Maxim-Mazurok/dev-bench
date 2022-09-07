import { defaultEnvironment } from "../defaults.js";
import { Command, Environment, Project } from "../types.js";

export interface CollectResult {
  projectName: Project["name"];
  commandName: Command["name"];
  totalsInMs: number[];
}

export interface ReportResult extends CollectResult {
  environment: Environment;
}

export abstract class Reporter {
  private readonly environment: Environment;

  constructor(environment: Partial<Environment>) {
    this.environment = { ...defaultEnvironment, ...environment };
  }

  getEnvironment() {
    return this.environment;
  }

  /**
   * Called after each command, for each registered reporters
   */
  abstract reportResult(result: CollectResult): void;
}
