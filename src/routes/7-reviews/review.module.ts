import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { Review, ReviewSchema } from "./schemas/review.schema";

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Review.name,
				schema: ReviewSchema,
			},
		]),
	],
	controllers: [ReviewController],
	providers: [ReviewService],
	exports: [ReviewService],
})
export class ReviewModule {}
