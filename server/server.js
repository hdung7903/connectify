require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const createError = require("http-errors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./api-docs/swagger");
const connectDB = require("./config/database");
const path = require("path");
const http = require("http");
const initializeSocket = require("./config/socket.config");

const authRouter = require("./routes/auth.route");
const postRoute = require("./routes/post.route");
const friendRouter = require("./routes/friend.route");
const userRouter = require("./routes/user.route");
const chatRouter = require("./routes/chat.route");
const messageRouter = require("./routes/message.route");

const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/auth.middleware");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 9999;
const whitelist = [
  process.env.FRONTEND_URL,
  process.env.BACKEND_URL,
  undefined,
];

// Middleware
app.use(morgan("dev"));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Initialize Socket
const io = initializeSocket(server);

io.on("connection", (socket) => {
  console.log(`New client connected with socket ID: ${socket.id}`);

  socket.on("setup", (userData) => {
    console.log("Setup received with userData:", userData);
    socket.join(userData._id);
    socket.emit("connected");
    console.log(`User ${userData._id} has joined their personal room`);
  });

  socket.on("join chat", (room) => {
    console.log(`User with socket ID ${socket.id} joining Room: ${room}`);
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat || !chat.users) {
      console.log("chat.users not defined");
      return;
    }

    console.log(
      `New message received from ${newMessageReceived.sender._id} in chat ${chat._id}:`,
      newMessageReceived.content
    );

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return; // Không gửi lại cho người gửi
      console.log(`Emitting message to user: ${user._id} in room: ${user._id}`);
      socket.to(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log(`Socket ID ${socket.id} disconnected`);
  });
});

// Connect to Database
connectDB();

// Routes
app.use("/auth", authRouter);
app.use("/posts", authMiddleware, postRoute);
app.use("/friends", authMiddleware, friendRouter);
app.use("/users", authMiddleware, userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((req, res, next) => next(createError(404, "Not Found")));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
