import { Injectable } from "@nestjs/common";
import { hash, verify } from "argon2";

@Injectable()
export class HashingService {
	public hash(plain: string | Buffer): Promise<string> {
		return hash(plain);
	}

	public compare(hash: string, plain: string | Buffer): Promise<boolean> {
		return verify(hash, plain);
	}
}
