import ScoreModel from "../db/models/scoreModel.js";
import { ApplicationError } from "../util/error/applicationError.js";

export const postScore = async (userId, score) => {
  try {
    const result = await ScoreModel.create({
      userId: userId,
      score: score,
    });

    return result;
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new ApplicationError(500, "Error post score");
  }
};

export const getRanking = async (start, limit) => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const sortData = await ScoreModel.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $year: "$createdAt" }, currentYear] },
              { $eq: [{ $month: "$createdAt" }, currentMonth] },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$userId",
          totalScore: { $sum: "$score" },
        },
      },
      {
        $sort: {
          totalScore: -1,
        },
      },
      {
        $skip: start,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
    ]);

    const totalCount = await ScoreModel.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $year: "$createdAt" }, currentYear] },
              { $eq: [{ $month: "$createdAt" }, currentMonth] },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$userId",
          count: { $sum: 1 },
        },
      },
    ]);

    const rankedData = sortData.map((entry, index) => ({
      userId: entry._id,
      totalScore: entry.totalScore,
      nickname: entry.userDetails.nickname,
      ranking: index + 1 + start,
      totalCount: totalCount.length,
    }));

    return rankedData;
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new ApplicationError(500, "Error get ranking");
  }
};
