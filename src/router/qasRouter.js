import express from "express";
import * as QAservice from "../services/qaService.js";
import { ApplicationError } from '../util/error/applicationError.js';

const router = express.Router();

router.get("/", async function (req, res, next) {
  try {
    const qas = await QAservice.getAllQAs();
    return res.status(200).json({
      success: true,
      message: "Successfully retrieved QA board",
      qas: qas,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

export default router;

