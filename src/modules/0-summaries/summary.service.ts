import { Injectable } from "@nestjs/common";
import { differenceInDays, subDays } from "date-fns";
import { ObjectId } from "mongodb";
import { SummaryDto } from "~modules/0-summaries/dto/summary.dto";
import { TransactionService } from "~modules/0-transactions/transaction.service";
import { calculatePercentageChange, fillMissingDays } from "~utils/common.util";

@Injectable()
export class SummaryService {
  constructor(private readonly transactionService: TransactionService) {}

  async getTransactionStats({ accountId, from, to }: SummaryDto) {
    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const startDate = from || defaultFrom;
    const endDate = to || defaultTo;

    const periodLength = differenceInDays(endDate, startDate) + 1;
    const lastPeriodStart = subDays(startDate, periodLength);
    const lastPeriodEnd = subDays(endDate, periodLength);

    const currentPeriod = await this._getFinancialStats(startDate, endDate, accountId);
    const lastPeriod = await this._getFinancialStats(lastPeriodStart, lastPeriodEnd, accountId);
    const incomeChange = calculatePercentageChange(currentPeriod.income, lastPeriod.income);
    const expensesChange = calculatePercentageChange(currentPeriod.expenses, lastPeriod.expenses);
    const remainingChange = calculatePercentageChange(
      currentPeriod.remaining,
      lastPeriod.remaining,
    );

    const categories = await this.transactionService.aggregate([
      {
        $match: {
          ...(accountId ? { accountId } : {}),
          amount: { $lt: 0 },
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$categoryId",
          value: { $sum: { $abs: "$amount" } },
        },
      },
      {
        $sort: {
          value: -1,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    const topCategories = categories.slice(0, 3);
    const otherCategories = categories.slice(3);
    const otherSum = otherCategories.reduce((acc, category) => acc + category.value, 0);
    const finalCategories = topCategories;
    if (otherCategories.length) finalCategories.push({ name: "Other", value: otherSum });

    const activeDays = await this.transactionService.aggregate([
      {
        $match: {
          ...(accountId ? { accountId } : {}),
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$date",
          income: {
            $sum: {
              $cond: [{ $gte: ["$amount", 0] }, "$amount", 0],
            },
          },
          expenses: {
            $sum: {
              $cond: [{ $lte: ["$amount", 0] }, { $abs: "$amount" }, 0],
            },
          },
        },
      },
      {
        $project: {
          date: "$_id",
          _id: 0,
          income: 1,
          expenses: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    const days = fillMissingDays(activeDays, startDate, endDate);

    return {
      currentPeriod,
      lastPeriod,
      incomeChange,
      expensesChange,
      remainingChange,
      categories: finalCategories,
      activeDays,
      days,
    };
  }

  private async _getFinancialStats(
    startDate: Date,
    endDate: Date,
    accountId?: ObjectId,
  ): Promise<{
    income: number;
    expenses: number;
    remaining: number;
  }> {
    const stats = await this.transactionService.aggregate([
      {
        $match: {
          ...(accountId ? { accountId } : {}),
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          income: {
            $sum: {
              $cond: [{ $gte: ["$amount", 0] }, "$amount", 0],
            },
          },
          expenses: {
            $sum: {
              $cond: [{ $lt: ["$amount", 0] }, "$amount", 0],
            },
          },
          remaining: {
            $sum: "$amount",
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    return (
      stats[0] || {
        income: 0,
        expenses: 0,
        remaining: 0,
      }
    );
  }
}
