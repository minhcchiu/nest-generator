import * as argon2 from 'argon2';
import { Document } from 'mongoose';
import { OtpType } from '../enum/otp-type.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { dbCollections } from '~config/collections/schemas.collection';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: dbCollections.otp.name,
})
export class Otp {
  @Prop({ type: String })
  readonly phone: string;

  @Prop({ type: String })
  readonly email: string;

  @Prop({ type: String, enum: OtpType, default: OtpType.PHONE })
  otpType: OtpType;

  @Prop({ type: String, required: true })
  otpCode: string;

  compareOtpCode: (candidateOtpCode: string) => Promise<boolean>;
}

export type OtpDocument = Otp & Document;
export const OtpSchema = SchemaFactory.createForClass(Otp);

// create index expires
OtpSchema.index({ updatedAt: 1 }, { expires: '5m' }); // Automatically delete documents after 5 minutes

// Pre save
OtpSchema.pre('save', async function (next: any) {
  const otp = this as OtpDocument;

  // Hash otp code
  otp.otpCode = await argon2.hash(otp.otpCode);

  return next();
});

// Schema methods
OtpSchema.methods.compareOtpCode = async function (candidateOtpCode: string) {
  const otpDoc = this as OtpDocument;

  return argon2.verify(otpDoc.otpCode, candidateOtpCode);
};
