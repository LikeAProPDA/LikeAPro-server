import QACommentModel from "../db/models/QACommentModel";
import { ApplicationError } from "../util/error/applicationError";

//댓글 가져오기
const getComment = async (qaId) => {
  const qaComment = await QACommentModel.find({
    qaId: qaId,
  });

  return qaComment;
};

//댓글 업로드
const uploadComment = async (qaId, comment) => {
  const qaComment = await QACommentModel.create({
    qaId: qaId,
    comment: comment,
  });
  return qaComment;
};

export { getComment, uploadComment };
