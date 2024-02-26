import express from "express";
import { ApplicationError } from "../util/error/applicationError.js";
import authHandler from "../middleware/authHandler/authHandler.js";
import { getRanking, postScore } from "../service/scoreService.js";

const router = express.Router();

router.post("/", authHandler, async (req, res, next) => {
  try {
    const { score } = req.body;
    const result = await postScore(req.user.id, score);
    return res.status(200).json({
      success: true,
      message: "Successfully fetched score",
      result: result,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/ranking", async (req, res, next) => {
  try {
    const start = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getRanking(start, limit);
    return res.status(200).json({
      success: true,
      message: "Successfully fected ranking",
      result: result,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

export default router;
