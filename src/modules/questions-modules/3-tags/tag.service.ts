import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { TagQuestionService } from "~modules/questions-modules/4-tag_questions/tag_question.service";
import { Tag, TagDocument } from "./schemas/tag.schema";

@Injectable()
export class TagService extends BaseService<TagDocument> {
  private tagService: TagService;
  constructor(
    @InjectModel(Tag.name) model: Model<TagDocument>,
    private readonly tagQuestionService: TagQuestionService,
  ) {
    super(model);

    this.tagService = this;
  }

  async createTagsWithQuestionId(questionId: ObjectId, tags: string[]) {
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

    const bulkResult = await this.tagService.bulkWrite(bulkOps);

    // Get tag IDs from upserted or modified documents
    const tagIds = await this.tagService.distinct("_id", { name: { $in: normalizedTags } });

    // Create tag-question relations
    const tagQuestionRelations = tagIds.map(tagId => ({ questionId, tagId }));
    await this.tagQuestionService.createMany(tagQuestionRelations);

    return bulkResult;
  }

  async deleteTagsByQuestionIds(questionIds: ObjectId[]) {
    const tagIds = await this.tagQuestionService.distinct("tagId", {
      questionId: { $in: questionIds },
    });

    const [updated] = await Promise.all([
      this.increaseQuestionCount(tagIds, -1),
      this.tagQuestionService.deleteMany({ questionId: { $in: questionIds } }),
    ]);

    return updated;
  }

  async increaseQuestionCount(tagIds: ObjectId[], amount: number = 1) {
    await this.tagService.updateMany({ _id: { $in: tagIds } }, { $inc: { questionCount: amount } });
  }
}
