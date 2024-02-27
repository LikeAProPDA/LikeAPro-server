import express from "express";
import { ApplicationError } from "../util/error/applicationError.js";
import {
  checkAndUpdateIsSolved,
  checkAndPostRecommend,
} from "../service/bojService.js";
import authHandler from "../middleware/authHandler/authHandler.js";

const router = express.Router();
//백준 문제를 해결했는지 조회
router.post("/check", authHandler, async function (req, res, next) {
  try {
    const result = await checkAndUpdateIsSolved(
      req.body.problemNum,
      req.body.problemId,
      req.user.id
    );
    return res.status(200).json({
      success: true,
      message: "Successfully check beakjoon solving",
      result: result,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

//추천 문제 조회
router.get("/recommend", authHandler, async function (req, res, next) {
  try {
    const count = parseInt(req.query.num) || 2;

    const result = await checkAndPostRecommend(req.user.id, count);
    return res.status(200).json({
      success: true,
      message: "Successfully fetched recommended problems",
      result: result,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

export default router;
