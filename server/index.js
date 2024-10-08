const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const createError = require('http-errors');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(async (req, res, next) => {
    next(createError(404, "Not Found"));
});

app.use(async (err, req, res, next) => {
    res.status = err.status;
    res.send({ message: { status: err.status, message: err.message } });
});

app.listen(9999, () => {
    console.log('Server started on port 9999');
})