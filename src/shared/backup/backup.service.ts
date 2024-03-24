// backup.service.ts
import { Injectable } from "@nestjs/common";
import * as child_process from "child_process";
import { join } from "path";
import * as util from "util";

@Injectable()
export class BackupService {
	async backupDatabase() {
		const exec = util.promisify(child_process.exec);
		const outputDirectory = join(process.cwd(), "public", "backup");

		const command = `mongodump --uri "mongodb+srv://minhchiuofficial:k26qXbnSIPFT3is0@nesta.bbluvt0.mongodb.net/nesta" --out ${outputDirectory}`;
		try {
			const { stdout } = await exec(command);
			console.log("Backup successful:", stdout);
		} catch (error) {
			console.error("Backup failed:", error.stderr);
			throw error;
		}
	}
}
