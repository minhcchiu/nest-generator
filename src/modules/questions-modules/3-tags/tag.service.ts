import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { QuestionService } from "~modules/questions-modules/1-questions/question.service";
import { Tag, TagDocument } from "./schemas/tag.schema";

@Injectable()
export class TagService extends BaseService<TagDocument> {
  private tagService: TagService;
  constructor(
    @InjectModel(Tag.name) model: Model<TagDocument>,
    @Inject(forwardRef(() => QuestionService))
    private readonly questionService: QuestionService,
  ) {
    super(model);

    this.tagService = this;
  }

  async createTags(tags: string[]) {
    const normalizedTags = tags.map(tag => tag.toLowerCase());

    // Bulk upsert tags and collect their IDs
    const bulkOps = normalizedTags.map(tag => ({
      updateOne: {
        filter: { name: tag },
        update: {
          $setOnInsert: { name: tag },
          $inc: { questionCount: 1 },
        },
        upsert: true,
      },
    }));
    await this.tagService.bulkWrite(bulkOps);

    return this.tagService.findMany({ name: { $in: normalizedTags } });
  }

  async increaseQuestionCount(tagId: ObjectId, amount: number = 1) {
    return this.tagService.updateById(tagId, { $inc: { questionCount: amount } });
  }

  async getTopInteractedTagsByUserIds(
    userIds: ObjectId[],
    options: { limit: number } = { limit: 3 },
  ) {
    const tags = await this.questionService.aggregate([
      { $match: { authorId: { $in: userIds } } },
      { $unwind: "$tagIds" },
      {
        $group: {
          _id: {
            tagId: "$tagIds",
            authorId: "$authorId",
          },
          questionCount: { $sum: 1 },
        },
      },
      { $sort: { questionCount: -1 } },
      {
        $lookup: {
          from: "tags",
          localField: "_id.tagId",
          foreignField: "_id",
          as: "tag",
        },
      },
      {
        $group: {
          _id: "$_id.authorId",
          tags: {
            $push: {
              questionCount: "$questionCount",
              tag: { $arrayElemAt: ["$tag", 0] },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          authorId: "$_id",
          tags: { $slice: ["$tags", options.limit] }, // Limit tags to the specified number
        },
      },
    ]);

    return tags as Array<{
      tags: {
        questionCount: number;
        tag: TagDocument;
      }[];
      questionCount: number;
      authorId: ObjectId;
    }>;
  }

  async updateRemovedTags(removedTagIds: ObjectId[]) {
    await this.tagService.updateMany(
      { _id: { $in: removedTagIds } },
      { $inc: { questionCount: -1 } },
    );
  }
}
