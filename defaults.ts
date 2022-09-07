import { hostname } from "os";
import { Environment } from "./types.js";

export const defaultEnvironment: Environment = {
  deviceName: hostname(),
  platform: process.platform,
  platformDetails: "",
  biosSettings: {},
  otherSettings: {},
};
