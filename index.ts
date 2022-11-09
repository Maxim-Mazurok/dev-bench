import { environment, projects } from "./config.js";
import { ProcessProject } from "./ProcessProject.js";
import { ChartReporter } from "./reporters/ChartReporter.js";
import { CliReporter } from "./reporters/CliReporter.js";
import { FSReporter } from "./reporters/FSReporter.js";
import { ResultsIO } from "./ResultsIO.js";
import { Environment } from "./types.js";

const commonReporterArguments: [Partial<Environment>] = [environment];
const reporters = [
  new FSReporter(...commonReporterArguments, new ResultsIO()),
  new CliReporter(...commonReporterArguments),
  new ChartReporter(...commonReporterArguments),
];

do {
  for (const project of projects) {
    const processProject = new ProcessProject(project, reporters);
    await processProject.main();
  }
} while (process.argv.includes("--run-indefinitely"));

for (const reporter of reporters) {
  await reporter.afterAll?.();
}
