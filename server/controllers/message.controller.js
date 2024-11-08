const asyncHandler = require("express-async-handler");
const Message = require("../models/message.schema");
const User = require("../models/user.model");
const Chat = require("../models/chat.model");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username avatarUrl email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res
      .status(400)
      .json({ message: "Invalid data passed into request" });
  }

  const newMessage = {
    sender: req.user.userId,
    content: content,
    chat: chatId,
  };
  console.log("User: ", req.user);

  console.log("User ID: ", req.user.userId);

  try {
    let message = await Message.create(newMessage);
    message = await Message.findById(message._id)
      .populate("sender", "username avatarUrl")
      .populate("chat");

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.status(201).json(message);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send message", error: error.message });
  }
});

module.exports = { allMessages, sendMessage };
