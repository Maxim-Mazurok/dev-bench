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
    this.environment = { ...defaultEnvironment };
    Object.entries(environment).forEach(([key, value]) => {
      if (value !== undefined) this.environment[key] = value;
    });
  }

  getEnvironment() {
    return this.environment;
  }

  /**
   * Called after each command, for each registered reporters
   */
  async reportResult(collectResult: CollectResult): Promise<void> {
    await this.processResult?.({
      ...collectResult,
      environment: this.getEnvironment(),
    });
  }

  /**
   * Called after each command, for each registered reporters
   */
  processResult?(reportResult: ReportResult): void | Promise<void>;

  /**
   * Called after all projects are benchmarked, for each registered reporters
   *
   * Will not be called when benchmarking with `--run-indefinitely` flag
   */
  afterAll?(): void | Promise<void>;
}
