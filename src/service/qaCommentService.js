import QACommentModel from "../db/models/QACommentModel.js";
import QA from "../db/models/qaModel.js";
import UserModel from "../db/models/userModel.js";

import { ApplicationError } from "../util/error/applicationError.js";

//댓글 가져오기
//예시: {{base_url}}/qas/65d6fa1db44d8c85d3ad5cf9/comments
const getCommentsForQA = async (qaId) => {
  try {
    const comments = await QACommentModel.find({
      qa: qaId,
    });

    if (!comments) {
      throw new ApplicationError(404, "모든 댓글을 찾을 수 없습니다.");
    }

    const populatedComments = await Promise.all(
      comments.map(async (comment) => {
        const populatedComment = await comment.populate("user");

        const extractedComment = {
          id: populatedComment._id,
          content: populatedComment.content,
          isAccepted: populatedComment.isAccepted,
          user: {
            id: populatedComment.user._id,
            nickname: populatedComment.user.nickname,
          },
          qa: populatedComment.qa,
          createdAt: populatedComment.createdAt,
          updatedAt: populatedComment.updatedAt,
        };

        return extractedComment;
      })
    );

    return populatedComments;
  } catch (error) {
    throw new ApplicationError(500, "댓글을 가져올 수 없습니다.", error);
  }
};

//댓글 업로드
//예시: {{base_url}}/qas/65d6fa1db44d8c85d3ad5cf9/comments
const uploadCommentForQA = async (qaId, content, user) => {
  try {
    // Create a new QAComment
    const newQAComment = await QACommentModel.create({
      content,
      user: user.id,
      qa: qaId,
    });

    const populatedQAComment = await QACommentModel.findById(
      newQAComment._id
    ).populate("user");

    const extractedComment = {
      id: populatedQAComment._id,
      content: populatedQAComment.content,
      user: {
        id: populatedQAComment.user._id,
        nickname: populatedQAComment.user.nickname,
      },
      qa: populatedQAComment.qa,
      createdAt: populatedQAComment.createdAt,
      updatedAt: populatedQAComment.updatedAt,
    };

    return extractedComment;
  } catch (error) {
    throw new ApplicationError(500, "댓글을 업로드할 수 없습니다.", error);
  }
};

//댓글 업데이트
//{{base_url}}/qas/comments/65d7fa00adb3c95455c80f31
const updateCommentForQA = async (commentId, content, isAccepted) => {
  try {
    const foundComment = await QACommentModel.findByIdAndUpdate(
      commentId,
      { content, isAccepted },
      { new: true } // 업데이트 된 문서를 반환하기 위해 { new: true } 옵션을 사용합니다.
    );

    if (!foundComment) {
      throw new ApplicationError(404, "해당 댓글을 찾을 수 없습니다.");
    }

    return foundComment;
  } catch (error) {
    console.error(error);
    throw new ApplicationError(500, "댓글을 업데이트할 수 없습니다.", error);
  }
};

//댓글 삭제
//{{base_url}}/qas/comments/65d7fa00adb3c95455c80f31
const deleteCommentForQA = async (commentId) => {
  try {
    const deletedComment = await QACommentModel.findByIdAndDelete(commentId);

    if (!deletedComment) {
      throw new ApplicationError(404, "해당 댓글을 찾을 수 없습니다.");
    }

    return deletedComment._id;
  } catch (error) {
    throw new ApplicationError(500, "댓글을 삭제할 수 없습니다.", error);
  }
};

// 새로운 댓글 채택 여부 업데이트 함수
// 새로운 댓글 채택 여부 업데이트 함수
const updateCommentAcceptance = async (qaId, commentId, isAccepted) => {
  try {
    const foundComment = await QACommentModel.findByIdAndUpdate(
      commentId,
      { isAccepted },
      { new: true } // 업데이트된 문서를 반환하기 위해 { new: true } 옵션을 사용합니다.
    );

    if (!foundComment) {
      throw new ApplicationError(404, "해당 댓글을 찾을 수 없습니다.");
    }

    return foundComment;
  } catch (error) {
    console.error(error);
    throw new ApplicationError(
      500,
      "댓글 채택 여부를 업데이트할 수 없습니다.",
      error
    );
  }
};

export {
  getCommentsForQA,
  uploadCommentForQA,
  updateCommentForQA,
  deleteCommentForQA,
  updateCommentAcceptance,
};
