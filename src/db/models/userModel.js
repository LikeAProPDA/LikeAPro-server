import mongoose, { Types } from "mongoose";

const userSchema = mongoose.Schema(
  {
    id: Types.ObjectId,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    backjoonId: {
      type: String,
      required: true,
      unique: true,
    },
    profile: String,
    solved: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", userSchema);
export default UserModel;
