import { appendFile, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { HttpExceptionResponse } from "~exceptions/http-exception-response.interface";

const errorFileName = "error.log";
const errorLogPath = join(__dirname, "../../", "public", "logs", errorFileName);

export const writeExceptionLogToFile = (
	exceptionResponse: HttpExceptionResponse,
): void => {
	// check error log path
	const isPathExist = existsSync(errorLogPath);
	if (!isPathExist) mkdirSync(errorLogPath, { recursive: true });

	const { statusCode, details, method, url, title, timeStamp, user } =
		exceptionResponse;

	const errorLog = `
  ============== ${timeStamp} ===================
  {
    Title: "${title}"
    Message: "${JSON.stringify(details)}"
    Code: "${statusCode}"
    URL: "${url}"
    Method: "${method}"
    User: "${user}"
  }\n`;

	appendFile(errorLogPath, errorLog, "utf8", (err) => {
		if (err) throw err;
	});
};
