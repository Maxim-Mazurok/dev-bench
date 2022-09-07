import { existsSync, readFileSync, writeFileSync } from "fs";
import { ReportResult } from "./reporters/Reporter.js";

const encoding: BufferEncoding = "utf-8";

export class ResultsIO {
  private readonly fileName: string;

  constructor(fileName = "results.json") {
    this.fileName = fileName;
  }

  get() {
    let results: ReportResult[] = [];
    if (existsSync(this.fileName)) {
      results = JSON.parse(readFileSync(this.fileName, encoding));
    }
    return results;
  }

  private set(results: ReportResult[]) {
    writeFileSync(this.fileName, JSON.stringify(results, null, 2), encoding);
  }

  append(result: ReportResult) {
    this.set([...this.get(), result]);
  }
}
