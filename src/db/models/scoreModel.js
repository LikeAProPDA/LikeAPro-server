import mongoose from "mongoose";

const scoreSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    score: { type: Number },
  },
  {
    timestamps: true,
  }
);

const ScoreModel = mongoose.model("Score", scoreSchema);
export default ScoreModel;
