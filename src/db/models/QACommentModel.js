import mongoose, { Types } from "mongoose";

const qaCommentSchema = new mongoose.Schema(
  {
    id: Types.ObjectId,
    content: { type: String, required: true },
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    qa: {
      type: Types.ObjectId,
      ref: "qa",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const QACommentModel = mongoose.model("QAComment", qaCommentSchema);
export default QACommentModel;
