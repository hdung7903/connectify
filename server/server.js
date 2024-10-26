const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const createError = require('http-errors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./api-docs/swagger');
const connectDB = require('./config/database');
const path = require('path');
const authRouter = require('./routes/auth.route');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const PORT = process.env.PORT || 9999
const whitelist = process.env.FRONTEND_URL.split(',').map(url => url.trim());
const app = express();

app.use(morgan('dev'));
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);        
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    exposedHeaders: 'X-New-Access-Token',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 204
}));
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

connectDB();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use("/auth", authRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(async (req, res, next) => {
    next(createError(404, "Not Found"));
});

app.use(async (err, req, res, next) => {
    res.status = err.status;
    res.send({ message: { status: err.status, message: err.message } });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})