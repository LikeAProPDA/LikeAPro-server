import mongoose, { Types } from "mongoose";

// { title: "event 2", date: "2024-02-02", color: "red" },
const scheduleSchema = mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String },
  color: { type: String, default: "blue" },
  start: { type: String },
  end: { type: String },
});

const ScheduleModel = mongoose.model("schedule", scheduleSchema);
export default ScheduleModel;
