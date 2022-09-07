import { ResultsIO } from "../ResultsIO.js";
import { Environment } from "../types.js";
import { CollectResult, Reporter } from "./Reporter.js";

export class FSReporter extends Reporter {
  private readonly resultsIO: ResultsIO;

  constructor(environment: Partial<Environment>, resultsIO: ResultsIO) {
    super(environment);
    this.resultsIO = resultsIO;
  }

  reportResult(result: CollectResult) {
    this.resultsIO.append({ ...result, environment: this.getEnvironment() });
  }
}
