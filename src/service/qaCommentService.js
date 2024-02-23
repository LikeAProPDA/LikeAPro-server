import QACommentModel from "../db/models/QACommentModel.js";
import { ApplicationError } from "../util/error/applicationError.js";

//댓글 가져오기
const getComment = async (qaId) => {
  try {
    const qaComment = await QACommentModel.find({
      qaId: qaId,
    });
    return qaComment;
  } catch (error) {
    throw new ApplicationError(500, "댓글을 가져올 수 없습니다.", error);
  }
};

//댓글 업로드
const uploadComment = async (qaId, comment) => {
  try {
    const qaComment = await QACommentModel.create({
      qaId: qaId,
      comment: comment,
    });
    return qaComment;
  } catch (error) {
    throw new ApplicationError(500, "댓글을 업로드할 수 없습니다.", error);
  }
};

//댓글 업데이트
const updateComment = async (commentId, content) => {
  try {
    const foundComment = await QACommentModel.findById(commentId);
    if (!foundComment) {
      throw new ApplicationError(404, "해당 댓글을 찾을 수 없습니다.");
    }

    foundComment.content = content;
    const updatedQaComment = await foundComment.save();
    return updatedQaComment;
  } catch (error) {
    throw new ApplicationError(500, "댓글을 업데이트할 수 없습니다.", error);
  }
};

//댓글 삭제
const deleteComment = async (commentId) => {
  try {
    const deletedComment = await QACommentModel.findByIdAndDelete(commentId);

    if (!deletedComment) {
      throw new ApplicationError(404, "해당 댓글을 찾을 수 없습니다.");
    }

    return deletedComment;
  } catch (error) {
    throw new ApplicationError(500, "댓글을 삭제할 수 없습니다.", error);
  }
};

export { getComment, uploadComment, updateComment, deleteComment };
