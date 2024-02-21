import express from "express";
import QAComment from "../db/models/QACommentModel";
import { getComment, uploadComment } from "../service/qaCommentService";
import { ApplicationError } from "../util/error/applicationError";
const router = express.Router();

// 댓글 조회 :  /api/qas/:qaId/comments
router.get("/", async (req, res, next) => {
  try {
    const { qaId } = req.query;
    const qaComment = await getComment(qaId);
    res.status(200).json({
      success: true,
      message: "댓글 조회 성공",
      result: qaComment,
    });
  } catch (err) {
    console.error(err);
    next(new ApplicationError(400, "댓글을 조회할 수 없습니다."));
  }
});

// 댓글 업로드 : /api/qas/:qaId/comments
//loginRequired(임시 변수명): 로그인이 필요한 함수 구현 필요함.
router.post("", loginRequired, async (req, res, next) => {
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
    next(new ApplicationError(400, "댓글 "));
  }
});

// 댓글 업데이트 : /api/qas/comments/:commentId
router.put("/:commentId", async (req, res, next) => {});

// 댓글 삭제 : /api/qas/comments/:commentId
router.delete("/:commentId", async (req, res, next) => {});
