import { appendFile, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { HttpExceptionResponse } from "~exceptions/http-exception-response.interface";

const errorFileName = "error.log";
const errorLogDir = join(process.cwd(), "public", "logs");

export const writeExceptionLogToFile = (exceptionResponse: HttpExceptionResponse): void => {
  // check error log path
  const isPathExist = existsSync(errorLogDir);
  if (!isPathExist) mkdirSync(errorLogDir, { recursive: true });

  const { statusCode, errors, method, url, title, timeStamp, user } = exceptionResponse;

  const errorLog = `
  ============== ${timeStamp} ===================
  {
    Title: "${title}"
    Message: "${JSON.stringify(errors)}"
    Code: "${statusCode}"
    URL: "${url}"
    Method: "${method}"
    User: "${user}"
  }\n`;

  appendFile(join(errorLogDir, errorFileName), errorLog, "utf8", err => {
    throw err;
  });
};
