import { PathOrFileDescriptor, appendFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export type LogType = "log" | "error" | "warn";
export const getLogPath = (logType: LogType): PathOrFileDescriptor => {
  const fileDir = join(__dirname, "../../", "public", "logs", `${logType}s`);
  const fileName = `${logType}.log`;

  const filePath = join(fileDir, fileName);

  const isPathExist = existsSync(filePath);

  if (isPathExist) return filePath;

  // create path
  mkdirSync(fileDir, { recursive: true });

  return filePath;
};

export const writeLogToFile = (logType: LogType, data: string): void => {
  const logPath = getLogPath(logType);

  appendFileSync(logPath, data, "utf8");
};
