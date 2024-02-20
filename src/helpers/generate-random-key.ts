import { randomBytes } from "crypto";

export const generateRandomKey = (keyLengthInBytes: number) => {
	if (!Number.isInteger(keyLengthInBytes) || keyLengthInBytes <= 0) {
		throw new Error("Invalid key length. Must be a positive integer.");
	}

	const generatedKey = randomBytes(keyLengthInBytes);

	const keyHexString = generatedKey.toString("hex");

	return keyHexString;
};
