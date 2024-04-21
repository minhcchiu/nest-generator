// restore.service.ts
import { Injectable } from "@nestjs/common";
import * as child_process from "child_process";
import * as util from "util";
@Injectable()
export class RestoreService {
	async restoreDatabase() {
		const exec = util.promisify(child_process.exec);
		const command =
			'mongorestore --uri "mongodb+srv://<username>:<password>@<host>/<database>" <path_to_backup_directory>';
		try {
			const { stdout } = await exec(command);
			console.log("Restore successful:", stdout);
		} catch (error) {
			console.error("Restore failed:", error.stderr);
			throw error;
		}
	}
}
