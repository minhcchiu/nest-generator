import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";

export enum MailServerEnum {
  Gmail = "gmail",
  Sendgrid = "sendgrid",
}

export class MailerConfigDto {
  @IsEnum(MailServerEnum)
  MAIL_SERVER: MailServerEnum;

  @ValidateIf(o => o.MAIL_SERVER === MailServerEnum.Gmail)
  @IsNotEmpty()
  @IsString()
  SMTP_GMAIL_HOST: string;

  @ValidateIf(o => o.MAIL_SERVER === MailServerEnum.Gmail)
  @IsNotEmpty()
  @IsNumber()
  SMTP_GMAIL_PORT: number;

  @ValidateIf(o => o.MAIL_SERVER === MailServerEnum.Gmail)
  @IsNotEmpty()
  @IsString()
  SMTP_GMAIL_USERNAME: string;

  @ValidateIf(o => o.MAIL_SERVER === MailServerEnum.Gmail)
  @IsNotEmpty()
  @IsString()
  SMTP_GMAIL_PASSWORD: string;

  @ValidateIf(o => o.MAIL_SERVER === MailServerEnum.Gmail)
  @IsNotEmpty()
  @IsBoolean()
  SMTP_GMAIL_SECURE: boolean;

  @ValidateIf(o => o.MAIL_SERVER === MailServerEnum.Sendgrid)
  @IsNotEmpty()
  @IsString()
  SMTP_SENDGRID_HOST: string;

  @ValidateIf(o => o.MAIL_SERVER === MailServerEnum.Sendgrid)
  @IsNotEmpty()
  @IsString()
  SMTP_SENDGRID_USERNAME: string;

  @ValidateIf(o => o.MAIL_SERVER === MailServerEnum.Sendgrid)
  @IsNotEmpty()
  @IsString()
  SMTP_SENDGRID_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  MAILER_FROM_EMAIL: string;

  @IsNotEmpty()
  @IsString()
  MAILER_NAME_NAME: string;
}
