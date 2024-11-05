const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chat.controller");
const authMiddleware = require("../middleware/auth.middleware"); // Sử dụng authMiddleware

const router = express.Router();

router.route("/").post(authMiddleware, accessChat); // Sử dụng authMiddleware
router.route("/").get(authMiddleware, fetchChats); // Sử dụng authMiddleware
router.route("/group").post(authMiddleware, createGroupChat); // Sử dụng authMiddleware
router.route("/rename").put(authMiddleware, renameGroup); // Sử dụng authMiddleware
router.route("/groupremove").put(authMiddleware, removeFromGroup); // Sử dụng authMiddleware
router.route("/groupadd").put(authMiddleware, addToGroup); // Sử dụng authMiddleware

module.exports = router;
