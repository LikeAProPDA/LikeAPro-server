import express from "express";
import {
  getCommentsForQA,
  uploadCommentForQA,
  updateCommentForQA,
  deleteCommentForQA,
  updateCommentAcceptance,
} from "../service/qaCommentService.js";
import { ApplicationError } from "../util/error/applicationError.js";
import authHandler from "../middleware/authHandler/authHandler.js";
import ScheduleModel from "../db/models/scheduleModel.js";
const router = express.Router({ mergeParams: true });

// 댓글 조회 :  /api/qas/:qaId/comments
router.get("/:qaId/comments", async (req, res, next) => {
  try {
    const { qaId } = req.params;
    const commentList = await getCommentsForQA(qaId);
    res.status(200).json({
      success: true,
      message: "댓글 조회 성공",
      result: commentList,
    });
  } catch (err) {
    console.error(err);
    next(new ApplicationError(404, "댓글을 조회할 수 없습니다."));
  }
});

// 댓글 업로드 : /api/qas/:qaId/comments
router.post("/:qaId/comments", authHandler, async (req, res, next) => {
  try {
    const { qaId } = req.params;
    const { content } = req.body;
    const uploadedQaComment = await uploadCommentForQA(qaId, content, req.user);

    res.status(200).json({
      success: true,
      message: "댓글 작성 성공",
      result: uploadedQaComment,
    });
  } catch (err) {
    console.error(err);
    next(new ApplicationError(404, "댓글을 작성할 수 없습니다."));
  }
});

// 댓글 업데이트 : /api/qas/:qaid/comments/:commentId
router.put(
  "/:qaid/comments/:commentId",
  authHandler,
  async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { content, isAccepted } = req.body; // isAccepted 값을 요청 바디에서 받아옵니다.
      const updatedQaComment = await updateCommentForQA(
        commentId,
        content,
        isAccepted // 받아온 isAccepted 값을 updateCommentForQA 함수에 전달합니다.
      );
      res.status(200).json({
        success: true,
        message: "댓글 수정 성공",
        result: updatedQaComment,
      });
    } catch (err) {
      console.error(err);
      next(new ApplicationError(404, "댓글을 수정할 수 없습니다."));
    }
  }
);

// 댓글 삭제 : /api/qas/comments/:commentId
router.delete("/comments/:commentId", authHandler, async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const deletedComment = await deleteCommentForQA(commentId);
    res.status(200).json({
      success: true,
      message: "댓글 삭제 성공",
      result: deletedComment,
    });
  } catch (err) {
    console.error(err);
    next(new ApplicationError(404, "댓글을 삭제할 수 없습니다."));
  }
});

// 새로운 댓글 채택 여부 업데이트 라우터
router.post(
  "/:qaId/comments/:commentId", // 수정된 라우트 경로
  authHandler,
  async (req, res, next) => {
    try {
      const { qaId, commentId } = req.params; // qaId도 받아옴
      const { isAccepted } = req.body;
      await updateCommentAcceptance(qaId, commentId, isAccepted); // 수정된 함수 호출
      res.status(200).json({
        success: true,
        message: "댓글 채택 여부 업데이트 성공",
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
