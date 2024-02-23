import mongoose from "mongoose";

const qaSchema = mongoose.Schema(
  {
    id: mongoose.Types.ObjectId,
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
    },
    createdAt: Date,
    updatedAt: Date,
    isCompleted: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

qaSchema.set("toObject", { virtuals: true });
qaSchema.set("toJSON", { virtuals: true });

// User 모델에서 nickname 가져오는 가상 필드 정의
// qaSchema.virtual('authorNickname', {
//   ref: 'user',
//   localField: 'author',
//   foreignField: '_id',
//   justOne: true,
//   options: { select: 'nickname' }, // 닉네임 필드만 선택
// });

const QA = mongoose.models.qas || mongoose.model("qas", qaSchema);

export default QA;
