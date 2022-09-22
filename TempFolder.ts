import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export class TempFolder {
  public readonly fullPath: string;

  constructor(friendlyName: string) {
    this.fullPath = mkdtempSync(join(tmpdir(), `${friendlyName}_`));
  }
}
