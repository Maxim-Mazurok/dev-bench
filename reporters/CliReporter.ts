import { analyseTotals, humanizeDurationRound } from "../helpers.js";
import { ReportResult, Reporter } from "./Reporter.js";

export class CliReporter extends Reporter {
  reportResult(result: ReportResult) {
    const { totalsInMs } = result;
    const { mean, std } = analyseTotals(totalsInMs);
    console.log(`Totals in ms: ${totalsInMs.join(", ")}`);
    console.log(
      `Average: ${humanizeDurationRound(mean)} ±${humanizeDurationRound(std)}`
    );
  }
}
