import { analyseTotals, humanizeDurationRound } from "../helpers.js";
import { ReportResult, Reporter } from "./Reporter.js";

export class CliReporter extends Reporter {
  processResult(reportResult: ReportResult): void | Promise<void> {
    const { totalsInMs } = reportResult;
    const { mean, std } = analyseTotals(totalsInMs);
    console.log(`Totals in ms: ${totalsInMs.join(", ")}`);
    console.log(
      `Average: ${humanizeDurationRound(mean)} ±${humanizeDurationRound(std)}`
    );
  }
}
