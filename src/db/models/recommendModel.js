import mongoose from "mongoose";
import ProblemModel from "./problemModel.js";

const recommendSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    problems: [
      {
        _id: false,
        problem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "problem",
        },
        isSolved: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const RecommendModel = mongoose.model("Recommend", recommendSchema);
export default RecommendModel;
