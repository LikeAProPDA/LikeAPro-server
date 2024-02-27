import express from "express";
import ScheduleModel from "../db/models/scheduleModel.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// 달력 스케쥴 불러오기 :  /schedule
router.get("/", async (req, res, next) => {
  try {
    const schedule = await ScheduleModel.find();
    res.status(200).json(schedule);
  } catch (err) {
    console.error(err);
    next(new ApplicationError(404, "스케줄을 조회할 수 없습니다."));
  }
});

router.get("/insert", async (req, res, next) => {
  try {
    // scheduleJson을 비동기로 받아오기 위해 await 사용

    const jsonFilePath = new URL("../db/json/schedule.json", import.meta.url);
    const jsonFile = fs.readFileSync(jsonFilePath, "utf8");
    const schedule = JSON.parse(jsonFile);

    const insertSchedule = await ScheduleModel.insertMany(schedule);
    res.status(200).json(insertSchedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
