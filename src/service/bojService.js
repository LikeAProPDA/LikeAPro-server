import { checkSolved } from "../data-crawled/checkSolved.js";
import UserModel from "../db/models/userModel.js";
import ProblemModel from "../db/models/problemModel.js";
import RecommendModel from "../db/models/recommendModel.js";
import { ApplicationError } from "../util/error/applicationError.js";
import { postScore } from "./scoreService.js";

export const checkAndUpdateIsSolved = async (problemNum, problemId, userId) => {
  try {
    const user = await UserModel.findOne({ _id: userId });
    const isSolved = await checkSolved(problemNum, user.backjoonId);
    if (isSolved) {
      if (user) {
        if (!user.solved.includes(problemNum)) {
          user.solved.push(problemNum);
          await user.save();
        }

        await RecommendModel.updateOne(
          { userId, "problems.problem": problemId },
          { $set: { "problems.$.isSolved": true } }
        );

        await postScore(userId, 10);
      }
    }
    const result = { solved: user.solved, isSolved: isSolved };
    return result;
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new ApplicationError(500, "Error checking beakjoon solved");
  }
};

export const getRecommendProblem = async (userId, count) => {
  try {
    const user = await UserModel.findOne({ _id: userId });
    const solvedProblemNumbers = user.solved || [];
    const recommendedProblems = await ProblemModel.find({
      problemNum: { $nin: solvedProblemNumbers },
    }).limit(count);
    return recommendedProblems;
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new ApplicationError(500, "Error get recommended problem");
  }
};

export const randomRecommend = async (count) => {
  try {
    const recommendedProblems = await ProblemModel.aggregate([
      { $sample: { size: count } },
    ]);

    const result = recommendedProblems.map((problem) => ({ problem }));

    return result;
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new ApplicationError(500, "Error getting recommended problems");
  }
};

export const checkAndPostRecommend = async (userId, count) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existingRecommendation = await RecommendModel.findOne({
      userId,
      createdAt: { $gte: today },
    }).populate({
      path: "problems.problem",
      model: "Problem",
      select: "problemNum algoName level link tags",
    });

    if (!existingRecommendation) {
      const recommendedProblems = await getRecommendProblem(userId, count);

      const problemsArray = recommendedProblems.map((problem) => ({
        problem: problem._id,
        isSolved: false,
      }));

      const newRecommendation = new RecommendModel({
        userId,
        problems: problemsArray,
      });

      await newRecommendation.save();

      const returnData = {
        _id: newRecommendation._id,
        userId: userId,
        problems: recommendedProblems.map((item) => ({
          problem: {
            _id: item._id,
            problemNum: item.problemNum,
            algoName: item.algoName,
            level: item.level,
            link: item.link,
            tags: item.tags,
          },
          isSolved: item.isSolved,
        })),
      };
      return returnData;
    } else {
      return existingRecommendation;
    }
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new ApplicationError(500, "Error check and recommend problem");
  }
};
