import express from "express";
import * as QAservice from "../service/qasService.js";
import { ApplicationError } from "../util/error/applicationError.js";
import authHandler from "../middleware/authHandler/authHandler.js";

const router = express.Router();

router.use("", qaCommentRouter);

//모든 QA조회
router.get("/", async function (req, res, next) {
  try {
    const qas = await QAservice.getAllQAs();
    return res.status(200).json({
      success: true,
      message: "Successfully retrieved QA board",
      qas: qas,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
//하나의 QA 조회
router.get("/:qaid", async function (req, res, next) {
  try {
    const qaId = req.params.qaid;
    const qa = await QAservice.getQAById(qaId);
    return res.status(200).json({
      success: true,
      message: "Successfully retrieved QA",
      qa: qa,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
//추가

router.post("/", authHandler, async (req, res, next) => {
  try {
    const { title, content } = req.body;

    // 새로운 QA 생성
    const newQA = await QAservice.postQA(title, content, req.user.id);

    res.status(201).json({
      success: true,
      message: "New QA created successfully.",
      qa: newQA,
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});
//삭제

router.delete("/:qaid", authHandler, async function (req, res, next) {
  try {
    const qaId = req.params.qaid;
    await QAservice.deleteQA(qaId);
    return res.status(200).json({
      success: true,
      message: "QA deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
//수정

router.put("/:qaid", authHandler, async function (req, res, next) {
  try {
    const qaId = req.params.qaid;
    const { title, content, isCompleted } = req.body;
    await QAservice.editQA(qaId, { title, content, isCompleted });
    return res.status(200).json({
      success: true,
      message: "QA updated successfully",
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 댓글 채택 여부 업데이트: /api/qas/comments/:commentId/acceptance
router.put(
  "/comments/:commentId/acceptance",
  authHandler,
  async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { isAccepted } = req.body;
      const updatedQaComment = await updateCommentForQA(commentId, isAccepted);
      res.status(200).json({
        success: true,
        message: "댓글 채택 여부 업데이트 성공",
        result: updatedQaComment,
      });
    } catch (err) {
      console.error(err);
      next(
        new ApplicationError(404, "댓글 채택 여부를 업데이트할 수 없습니다.")
      );
    }
  }
);

export default router;
