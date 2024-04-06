export enum NodeEnv {
	Production = "PRODUCTION",
	Development = "DEVELOPMENT",
}

export enum StorageServerEnum {
	Local = "LOCAL",
	S3 = "S3",
	Cloudinary = "CLOUDINARY",
}

export interface AppConfig {
	nodeEnv: string;
	port: number;
	serverUrl: string;
	serverName: string;
	storageServer: StorageServerEnum;
	resetPasswordUrl: string;
	verifyAccountUrl: string;
}
