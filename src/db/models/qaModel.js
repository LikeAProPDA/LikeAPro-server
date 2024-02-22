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
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      // required: true,
    },
    createdAt: Date,
    updatedAt: Date,
    isCompleted: {
      type: Boolean, //yes:true, no: false
    },
  },
  { timestamps: true }
);

const QA = mongoose.models.qas || mongoose.model("qas", qaSchema);
export default QA;
