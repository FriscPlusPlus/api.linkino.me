const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./rest');

const app = express();
app.use(cors());
app.options('*', cors());

app.enable('trust proxy', 1);

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

app.use('/', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
