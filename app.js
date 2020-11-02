require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const moment = require('moment');
const { getCoffees } = require('./clients/coffee-client');

const app = express();
const start = moment('2020-12-01');
const today = process.env.FAKE_TODAY ? moment(process.env.FAKE_TODAY) : moment();

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());

app.get('/', async function (req, res, next) {
  const day = getTargetDay();
  const data = await getCalendar(day);
  res.render('index', data);
});

app.get('/:day', async function (req, res, next) {
  const day = getTargetDay(req.params.day);
  const data = await getCalendar(day);
  res.render('index', data);
});

function getTargetDay(dayParam) {
  if (!dayParam) {
    return Math.max(1, today.date() - 1);
  }

  let day = parseInt(dayParam, 10);
  if (isNaN(day)) {
    day = today.date();
  }

  return Math.max(1, day - 1);
}

async function getCalendar(targetDay) {
  const coffees = await getCoffees(targetDay, today);
  const revealed = coffees.filter(c => c.date.isSameOrBefore(today));
  const remaining = coffees.slice(revealed.length).map(d => ({ day: d.day, target: d.target }));
  const ready = today.isSameOrAfter(start);

  return {
    revealed,
    remaining,
    ready
  }
}

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
