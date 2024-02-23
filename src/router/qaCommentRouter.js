import express from "express";
import {
  getComment,
  uploadComment,
  updateComment,
  deleteComment,
} from "../service/qaCommentService.js";
import { ApplicationError } from "../util/error/applicationError.js";
const router = express.Router();

// 댓글 조회 :  /api/qas/:qaId/comments
router.get("/:qaId/comments", async (req, res, next) => {
  try {
    const { qaId } = req.params;
    const qaComment = await getComment(qaId);
    res.status(200).json({
      success: true,
      message: "댓글 조회 성공",
      result: qaComment,
    });
  } catch (err) {
    console.error(err);
    next(new ApplicationError(404, "댓글을 조회할 수 없습니다."));
  }
});

// 댓글 업로드 : /api/qas/:qaId/comments
//loginRequired(임시 변수명): 로그인이 필요한 함수 구현 필요함.
router.post("/:qaId/comments", loginRequired, async (req, res, next) => {
  try {
    const { qaId } = req.query;
    const { content } = req.body;
    const qaComment = await uploadComment(qaId, content, req.user._id);
    res.status(200).json({
      success: true,
      message: "댓글 작성 성공",
      result: qaComment,
    });
  } catch (err) {
    console.error(err);
    next(new ApplicationError(404, "댓글을 작성할 수 없습니다."));
  }
});

// 댓글 업데이트 : /api/qas/comments/:commentId
router.put("/comments/:commentId", loginRequired, async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const updatedQaComment = await updateComment(commentId, content);
    res.status(200).json({
      success: true,
      message: "댓글 수정 성공",
      result: updatedQaComment,
    });
  } catch (err) {
    console.error(err);
    next(new ApplicationError(404, "댓글을 수정할 수 없습니다."));
  }
});

// 댓글 삭제 : /api/qas/comments/:commentId
router.delete("/comments/:commentId", loginRequired, async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const deletedComment = await deleteComment(commentId);
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

export default router;
