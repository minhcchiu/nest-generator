export interface JWTConfig {
	secretKey: string;
	expiresIn: number;
	accessToken: {
		expiresIn: number;
		secretKey: string;
	};
	refreshToken: {
		expiresIn: number;
		secretKey: string;
	};
	registerToken: {
		expiresIn: number;
		secretKey: string;
	};
	forgotPasswordToken: {
		expiresIn: number;
		secretKey: string;
	};
}
