import express from "express";
import { signUp } from "../service/userService.js";
const router = express.Router();

router.post("/sign-up", async (req, res, next) => {
  try {
    const { email, nickname, password, backjoonId } = req.body;
    const result = await signUp(email, nickname, password, backjoonId);

    return res.status(200).json({
      sucess: true,
      message: "Sign Up Success",
      result: result,
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});
export default router;
