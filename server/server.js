const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const createError = require("http-errors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./api-docs/swagger");
const connectDB = require("./config/database");
const path = require("path");
const authRouter = require("./routes/auth.route");
const cookieParser = require("cookie-parser");
const postRoute = require("./routes/post.route");
const authMiddleware = require("./middleware/auth.middleware");
const friendRouter = require("./routes/friend.route"); // Thêm router bạn bè
const http = require("http");
const initializeSocket = require("./config/socket.config");
const userRouter = require("./routes/user.route");
const chatRouter = require("./routes/chat.route");
const messageRouter = require("./routes/message.route");
require("dotenv").config();

const PORT = process.env.PORT || 9999;
const whitelist = [
  `${process.env.FRONTEND_URL}`,
  `${process.env.BACKEND_URL}`,
  undefined,
];
const app = express();

const server = http.createServer(app);

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
    exposedHeaders: "X-New-Access-Token",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const io = initializeSocket(server);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API Routes for authentication
 */
app.use("/auth", authRouter);

app.use("/posts", authMiddleware, postRoute);

app.use("/friends", authMiddleware, friendRouter);

app.use("/users", authMiddleware, userRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(async (req, res, next) => {
  next(createError(404, "Not Found"));
});

app.use(async (err, req, res, next) => {
  res.status = err.status;
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
