const createHttpError = require("http-errors");
const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    revokeRefreshToken,
} = require("../config/jwt.config.js");
const jwt = require("jsonwebtoken");
const path = require("path");
const ejs = require("ejs");
const transporter = require("../config/transporter");
const Token = require("../models/token.model.js");

const createUser = async (req, res, next) => {
    const { username, email, password, gender, dob } = req.body;

    console.log("req.body:", req.body);

    if (!username || !email || !password || !gender || !dob) {
        throw new createHttpError.BadRequest("Missing required fields");
    }

    try {
        const verificationCode = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            passwordHash,
            gender,
            dob: new Date(dob),
            avatarUrl: "",
            bio: null,
            location: {
                city: "",
                country: "",
                lat: 0,
                long: 0,
            },
            interests: [],
            role: "user",
            accountVerification: {
                isVerified: false,
                verificationCode: verificationCode,
            },
        });

        const result = await newUser.save();
        console.log("result:", result);

        const verificationLink = `${process.env.FRONTEND_URL}/verify/${verificationCode}/${email}`;

        try {
            await sendVerificationEmail(username, email, verificationLink);
        } catch (emailError) {
            console.error("Error sending verification email:", emailError);
            return res.status(201).json({
                message:
                    "User created successfully, but verification email could not be sent.",
                error: emailError.message,
            });
        }

        return res.status(201).json({
            message: "User created successfully. Verification email sent.",
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            throw new createHttpError.Unauthorized("Invalid username or password");
        }

        if (user.accountVerification.isVerified === false) {
            throw new createHttpError.Unauthorized("Please verify your email");
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new createHttpError.Unauthorized("Invalid username or password");
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        const tokenDocument = new Token({
            userId: user._id,
            accessToken: accessToken,
            refreshToken: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        await tokenDocument.save();

        res.status(200).json({ accessToken });
    } catch (err) {
        next(err);
    }
};

const logout = async (req, res, next) => {
    const { refreshToken } = req.body;

    try {
        await revokeRefreshToken(refreshToken);
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        next(err);
    }
};

const verifyUser = async (req, res, next) => {
    const { token, email } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.email !== email) {
            throw new createHttpError.BadRequest("Email does not match token");
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            throw new createHttpError.NotFound("User not found");
        }

        user.set({
            accountVerification: {
                isVerified: true,
                verificationCode: null,
                verifiedAt: new Date(),
            },
        });

        await user.save();

        res.status(200).json({ message: "User verified successfully" });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new createHttpError.Unauthorized("Token has expired");
        }
        throw new createHttpError.BadRequest("Invalid token");
    }
};

const resendVerification = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new createHttpError.NotFound("User not found");
        }

        if (user.accountVerification.isVerified === true) {
            throw new createHttpError.BadRequest("User already verified");
        }

        const verificationLink = `http://localhost:3000/auth/verify-account?token=${user.accountVerification.token}&email=${user.email}`;
        const info = await sendVerificationEmail(
            user.username,
            user.email,
            verificationLink
        );

        user.set({
            accountVerification: {
                isVerified: true,
                verificationCode: null,
                verifiedAt: new Date(),
            },
        });

        await user.save();

        res.status(200).json({ message: "Verification email sent", info });
    } catch (err) {
        next(err);
    }
};

const sendVerificationEmail = async (username, email, verificationLink) => {
    const templatePath = path.join(__dirname, "../views/verifyAccount.ejs");

    return new Promise((resolve, reject) => {
        ejs.renderFile(
            templatePath,
            { username, verificationLink },
            (err, data) => {
                if (err) {
                    return reject(
                        new createHttpError.InternalServerError(
                            "Error rendering email template"
                        )
                    );
                }

                transporter.sendMail(
                    {
                        from: process.env.EMAIL_USER,
                        to: email,
                        subject: "Verify Your Account",
                        html: data,
                    },
                    (err, info) => {
                        if (err) {
                            return reject(
                                new createHttpError.InternalServerError("Error sending email")
                            );
                        }

                        resolve(info.response);
                    }
                );
            }
        );
    });
};

const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new createHttpError.NotFound("User not found");
        }

        const verificationCode = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: "1m",
        });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${verificationCode}/${user.email}`;

        const info = await sendResetPasswordEmail(
            user.username,
            user.email,
            resetLink
        );

        res.status(200).json({ message: "Password reset email sent", info });
    } catch (error) {
        next(error);
    }
};

const checkResetPasswordToken = async (req, res, next) => {
    const { token, email } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.email !== email) {
            throw new createHttpError.BadRequest("Email does not match token");
        }

        res
            .status(200)
            .json({ message: "Token is valid. You can reset your password." });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new createHttpError.BadRequest("Invalid or expired token");
        }
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    const { token, email, password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.email !== email) {
            throw new createHttpError.BadRequest("Email does not match token");
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            throw new createHttpError.NotFound("User not found");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.set({ password: hashedPassword });
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        next(error);
    }
};

const resendForgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new createHttpError.NotFound("User not found");
        }

        const verificationCode = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: "1m",
        });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${verificationCode}/${user.email}`;

        const info = await sendResetPasswordEmail(
            user.username,
            user.email,
            resetLink
        );

        res.status(200).json({ message: "Password reset email sent", info });
    } catch (error) {
        next(error);
    }
};

const sendResetPasswordEmail = async (username, email, resetLink) => {
    const templatePath = path.join(__dirname, "../views/resetPassword.ejs");

    return new Promise((resolve, reject) => {
        ejs.renderFile(templatePath, { username, resetLink }, (err, data) => {
            if (err) {
                return reject(
                    new createHttpError.InternalServerError(
                        "Error rendering email template"
                    )
                );
            }
            transporter.sendMail(
                {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "Reset Your Password",
                    html: data,
                },
                (err, info) => {
                    if (err) {
                        return reject(
                            new createHttpError.InternalServerError("Error sending email")
                        );
                    }

                    resolve(info.response);
                }
            );
        });
    });
};

const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-passwordHash")
            .populate("friends", "username avatarUrl")
            .lean();

        if (!user) {
            throw new createHttpError.NotFound("User not found");
        }

        const countFriendsNotifications = user.friendRequestsReceived.length;

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            gender: user.gender,
            dob: user.dob,
            avatarUrl: user.avatarUrl,
            coverUrl: user.coverUrl,
            bio: user.bio,
            location: user.location,
            interests: user.interests,
            friends: user.friends,
            role: user.role,
            accountVerification: user.accountVerification,
            friendNotification: countFriendsNotifications,
        });
    } catch (error) {
        console.error("getMe error:", error);
        next(error);
    }
};

module.exports = {
    createUser,
    login,
    logout,
    verifyUser,
    resendVerification,
    forgotPassword,
    resetPassword,
    checkResetPasswordToken,
    resendForgotPassword,
    getMe,
};
