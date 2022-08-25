export interface MailerConfig {
  isGmailServer: boolean;

  transport: {
    gmail: {
      host: string;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
  };

  defaults: {
    from: string;
  };

  name: string;
}
