import { checkSolved } from "../data-crawled/checkSolved.js";
import UserModel from "../db/models/userModel.js";
import ProblemModel from "../db/models/problemModel.js";
import { ApplicationError } from "../util/error/applicationError.js";

export const checkAndUpdateIsSolved = async (problemNum, backjoonId) => {
  try {
    const isSolved = await checkSolved(problemNum, backjoonId);
    const user = await UserModel.findOne({ backjoonId: backjoonId });
    if (isSolved) {
      if (user) {
        if (!user.solved.includes(problemNum)) {
          user.solved.push(problemNum);
          await user.save();
        }
      }
    }
    console.log(isSolved);
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
      problemNumber: { $nin: solvedProblemNumbers },
    }).limit(count);
    return recommendedProblems;
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new ApplicationError(500, "Error get recommended problem");
  }
};
