const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/message.controller");

const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware"); // Sử dụng authMiddleware

router.route("/:chatId").get(authMiddleware, allMessages);
router.route("/").post(authMiddleware, sendMessage);

module.exports = router;
