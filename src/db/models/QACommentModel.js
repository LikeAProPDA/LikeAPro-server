import mongoose, { Types } from "mongoose";

const qaCommentSchema = mongoose.Schema(
  {
    id: { type: Types.ObjectId, required: true },
    content: { type: String, required: true },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    qaId: {
      type: Types.ObjectId,
      ref: "QA",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const QACommentModel = mongoose.model("QAComment", qaCommentSchema);
export default QACommentModel;
