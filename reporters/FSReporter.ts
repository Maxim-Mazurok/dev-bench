import { ResultsIO } from "../ResultsIO.js";
import { Environment } from "../types.js";
import { Reporter, ReportResult } from "./Reporter.js";

export class FSReporter extends Reporter {
  private readonly resultsIO: ResultsIO;

  constructor(environment: Partial<Environment>, resultsIO: ResultsIO) {
    super(environment);
    this.resultsIO = resultsIO;
  }

  processResult(reportResult: ReportResult) {
    this.resultsIO.append(reportResult);
  }
}
