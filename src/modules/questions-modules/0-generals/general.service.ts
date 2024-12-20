import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { UserService } from "~modules/pre-built/1-users/user.service";
import { SearchableTypesEnum } from "~modules/questions-modules/0-generals/enums/searchable-types.enum";
import { AnswerService } from "~modules/questions-modules/1-answers/answer.service";
import { QuestionService } from "~modules/questions-modules/1-questions/question.service";
import { TagService } from "~modules/questions-modules/3-tags/tag.service";

@Injectable()
export class GeneralService {
  constructor(
    @Inject(forwardRef(() => QuestionService))
    private readonly questionService: QuestionService,
    private readonly userService: UserService,
    private readonly tagService: TagService,
    private readonly answerService: AnswerService,
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
}
