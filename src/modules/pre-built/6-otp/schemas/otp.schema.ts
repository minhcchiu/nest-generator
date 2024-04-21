import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as argon2 from "argon2";
import { HydratedDocument } from "mongoose";
import { OtpType } from "../enums/otp-type";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "otps",
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

	@Prop({ type: Number, required: true })
	expiredAt: number;

	compareOtpCode: (candidateOtpCode: string) => Promise<boolean>;
}

export type OtpDocument = Otp & HydratedDocument<Otp>;
export const OtpSchema = SchemaFactory.createForClass(Otp);

// create index expires
OtpSchema.index({ updatedAt: 1 }, { expires: 60 * 60 * 24 }); // Automatically delete documents in 24 hours

// Pre save
OtpSchema.pre("save", async function (next: any) {
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
