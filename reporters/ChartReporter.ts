import { groupByKey } from "../config.js";
import { getChartVegaSpec, saveVegaToFile } from "../GenerateChart.js";
import { BasicValueType, Command, Project } from "../types.js";
import { Reporter, ReportResult } from "./Reporter.js";

export interface ChartResult {
  projectName: Project["name"];
  commandName: Command["name"];
  totalInSeconds: number;
  groupByValue: BasicValueType;
}

export class ChartReporter extends Reporter {
  private allChartResults: ChartResult[] = [];

  processResult(reportResult: ReportResult) {
    reportResult.totalsInMs.forEach((totalInMs) => {
      const { commandName, projectName } = reportResult;
      this.allChartResults.push({
        commandName,
        projectName,
        totalInSeconds: totalInMs / 1000,
        groupByValue: reportResult.environment[groupByKey],
      });
    });
  }

  async afterAll() {
    await saveVegaToFile(getChartVegaSpec(this.allChartResults), "results.png");
  }
}
