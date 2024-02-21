import mongoose, { Types } from "mongoose";

const qaSchema = mongoose.Schema(
  {
    id: Types.ObjectId,
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: Date,
    updatedAt: Date,
    isCompleted: {
      type: Boolean, //yes:true, no: false
    },
  },
  { timestamps: true }
);

const QAModel = mongoose.model("qa", qaSchema);
export default QAModel;
