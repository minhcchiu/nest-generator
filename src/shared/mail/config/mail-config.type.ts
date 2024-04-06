export interface MailerConfig {
	isGmailServer: string;

	transport: {
		gmail: {
			host: string;
			secure: boolean;
			port: number;
			auth: {
				user: string;
				pass: string;
			};
		};

		sendgrid: {
			host: string;
			auth: {
				user: string;
				pass: string;
			};
		};
	};
	defaults: { from: string };
	name: string;
}
