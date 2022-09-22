import { rm } from "node:fs/promises";
import { debug } from "./nodeenv.js";
import { TempFolder } from "./TempFolder.js";

export class TempFolderManager {
  private folders: TempFolder[] = [];

  add(friendlyName: string) {
    const tempFolder = new TempFolder(friendlyName);
    this.folders.push(tempFolder);
    debug(`Created temp folder: "${tempFolder}"`);
    return tempFolder.fullPath;
  }

  async cleanup() {
    debug(
      `Removing temp folders: ${this.folders.map((x) => x.fullPath).join(" ")}`
    );
    return Promise.all(
      this.folders.map((folder) => rm(folder.fullPath, { recursive: true }))
    );
  }
}
