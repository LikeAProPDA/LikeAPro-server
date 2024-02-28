import ScoreModel from "../db/models/scoreModel.js";
import UserModel from "../db/models/userModel.js";
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

    const allUsers = await UserModel.find({});

    const rankedData = sortData.map((entry, index) => ({
      userId: entry._id,
      totalScore: entry.totalScore,
      nickname: entry.userDetails.nickname,
      ranking: index + 1,
      totalCount: allUsers.length,
    }));

    rankedData.forEach((entry, index) => {
      if (index > 0 && entry.totalScore === rankedData[index - 1].totalScore) {
        entry.ranking = rankedData[index - 1].ranking;
      }
    });

    const noScoreUsers = allUsers.filter(
      (user) => !rankedData.some((entry) => entry.userId.equals(user._id))
    );

    const finalData = rankedData.concat(
      noScoreUsers.map((user, index) => ({
        userId: user._id,
        totalScore: 0,
        nickname: user.nickname,
        ranking: rankedData.length + index + 1,
        totalCount: allUsers.length,
      }))
    );

    return finalData.slice(start, start + limit);
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new ApplicationError(500, "Error get ranking");
  }
};
