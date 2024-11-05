const express = require("express");
const userRouter = express.Router();
const {
  getUser,
  updateAvatar,
  updateCover,
} = require("../controllers/user.controller");

userRouter.get("/:userId", getUser);
userRouter.patch("/avatar", updateAvatar);
userRouter.patch("/cover", updateCover);

module.exports = userRouter;
