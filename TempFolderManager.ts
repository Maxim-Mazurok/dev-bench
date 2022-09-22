import { rm } from "node:fs/promises";
import { TempFolder } from "./TempFolder.js";

export class TempFolderManager {
  private folders: TempFolder[] = [];

  add(friendlyName: string) {
    const tempFolder = new TempFolder(friendlyName);
    this.folders.push(tempFolder);
    return tempFolder.fullPath;
  }

  async cleanup() {
    return Promise.all(
      this.folders.map((folder) => rm(folder.fullPath, { recursive: true }))
    );
  }
}
