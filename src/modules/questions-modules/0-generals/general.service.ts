import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { UserService } from "~modules/pre-built/1-users/user.service";
import { SearchableTypesEnum } from "~modules/questions-modules/0-generals/enums/searchable-types.enum";
import { AnswerService } from "~modules/questions-modules/1-answers/answer.service";
import { QuestionService } from "~modules/questions-modules/1-questions/question.service";
import { TagService } from "~modules/questions-modules/3-tags/tag.service";
import { InteractionService } from "~modules/questions-modules/4-interactions/interaction.service";
import { calculateBadges } from "~utils/common.util";
import {
  BADGE_CRITERIA_ANSWERS,
  BADGE_CRITERIA_QUESTIONS,
  BADGE_CRITERIA_READ_QUESTIONS,
} from "~utils/constant";
@Injectable()
export class GeneralService {
  constructor(
    @Inject(forwardRef(() => QuestionService))
    private readonly questionService: QuestionService,
    private readonly userService: UserService,
    private readonly tagService: TagService,
    private readonly answerService: AnswerService,
    private readonly interactionService: InteractionService,
  ) {}

  async globalSearch(keyword: string, searchType?: SearchableTypesEnum) {
    const regexQuery = new RegExp(keyword, "i");

    const servicesAndTypes = [
      {
        service: this.questionService,
        searchFields: ["title"],
        type: SearchableTypesEnum.Question,
      },
      {
        service: this.userService,
        searchFields: ["fullName", "username"],
        type: SearchableTypesEnum.User,
      },
      {
        service: this.answerService,
        searchFields: ["content"],
        type: SearchableTypesEnum.Answer,
      },
      {
        service: this.tagService,
        searchFields: ["name"],
        type: SearchableTypesEnum.Tag,
      },
    ];

    let results = [];

    if (searchType) {
      // SEARCH IN THE SELECTED SERVICE
      const serviceInfo = servicesAndTypes.find(
        serviceAndType => serviceAndType.type === searchType,
      );

      if (!serviceInfo) throw new BadRequestException(`Invalid search type: ${searchType}`);

      const queryResults = await serviceInfo.service.findMany(
        { $or: serviceInfo.searchFields.map(field => ({ [field]: regexQuery })) },
        { limit: 8 },
      );

      results = queryResults.map(result => ({
        title:
          searchType === SearchableTypesEnum.Answer
            ? `Answers containing "${keyword}"`
            : result[serviceInfo.searchFields[0]],
        _id: searchType === SearchableTypesEnum.Answer ? result.questionId : result._id,
        searchType,
      }));
    } else {
      const allQueryResults = await Promise.all(
        servicesAndTypes.map(async serviceInfo => {
          const queryResults = await serviceInfo.service.findMany(
            { $or: serviceInfo.searchFields.map(field => ({ [field]: regexQuery })) },
            { limit: 8 },
          );

          return queryResults.map(result => ({
            title:
              serviceInfo.type === SearchableTypesEnum.Answer
                ? `Answers containing "${keyword}"`
                : result[serviceInfo.searchFields[0]],
            _id: serviceInfo.type === SearchableTypesEnum.Answer ? result.questionId : result._id,
            searchType: serviceInfo.type,
          }));
        }),
      );

      results = allQueryResults.flat();
    }

    return results;
  }

  async getUserBadges(userId: ObjectId) {
    const [questionsStats, answersStats, readQuestionStats] = await Promise.all([
      // Questions stats
      this.questionService.aggregate([
        { $match: { authorId: userId } },
        {
          $project: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            views: 1,
            upvoteCount: 1,
            downvoteCount: 1,
            answerCount: 1,
          },
        },
        {
          $group: {
            _id: { year: "$year", month: "$month" },
            totalViews: { $sum: "$views" },
            totalUpvoteCount: { $sum: "$upvoteCount" },
            totalDownvoteCount: { $sum: "$downvoteCount" },
            totalAnswerCount: { $sum: "$answerCount" },
            totalQuestions: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id.month",
            year: "$_id.year",
            totalViews: 1,
            totalUpvoteCount: 1,
            totalDownvoteCount: 1,
            totalAnswerCount: 1,
            totalQuestions: 1,
          },
        },
      ]),

      // Answers stats
      this.answerService.aggregate([
        { $match: { authorId: userId } },
        {
          $project: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            upvoteCount: { $size: "$upvotes" },
            downvoteCount: { $size: "$downvotes" },
            repliesCount: 1,
          },
        },
        {
          $group: {
            _id: { year: "$year", month: "$month" },
            totalUpvoteCount: { $sum: "$upvoteCount" },
            totalDownvoteCount: { $sum: "$downvoteCount" },
            totalRepliesCount: { $sum: "$repliesCount" },
            totalAnswers: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id.month",
            year: "$_id.year",
            totalAnswers: 1,
            totalUpvoteCount: 1,
            totalDownvoteCount: 1,
            totalRepliesCount: 1,
          },
        },
      ]),

      // Read question stats
      this.interactionService.aggregate([
        {
          $match: { userId, action: "view" },
        },
        {
          $project: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            actionCount: 1,
          },
        },
        {
          $group: {
            _id: { year: "$year", month: "$month" },
            totalViews: { $sum: "$actionCount" },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id.month",
            year: "$_id.year",
            totalViews: 1,
          },
        },
      ]),
    ]);

    const badgeStats = {
      questionBadgesCount: calculateBadges(questionsStats, BADGE_CRITERIA_QUESTIONS),
      answerBadgesCount: calculateBadges(answersStats, BADGE_CRITERIA_ANSWERS),
      readQuestionBadgesCount: calculateBadges(readQuestionStats, BADGE_CRITERIA_READ_QUESTIONS),
    };

    return {
      badgeCounts: Object.values(badgeStats).reduce(
        (acc, value) => {
          return {
            bronze: acc.bronze + value.bronze,
            silver: acc.silver + value.silver,
            gold: acc.gold + value.gold,
          };
        },
        { bronze: 0, silver: 0, gold: 0 },
      ),
      badgeStats,
    };
  }
}
