require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const ipLookup = require('request-ip');
const geoip = require('geoip-lite');

const { getCoffees } = require('./clients/coffee-client');

const app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());

app.get('/', get);
app.get('/game-genie/:code', cheatMode);
app.get('/:day', get);

async function get(req, res) {
  const data = await getData(req, res);
  res.render('index', data);
};

async function cheatMode(req, res) {
  if (req.params.code) {
    const ip = process.env.FAKE_IP || ipLookup.getClientIp(req);
    if (ip !== decode(req.params.code)) {
      return res.sendStatus(404);
    }
  }

  const data = await getData(req, res, true);
  res.render('index', data);
}

app.get('/api/coffees', async (req, res) => {
  const data = await (getData(req, res));
  res.json(data);
});

async function getData(req, res, isCheatMode) {
  const moment = require('moment-timezone');
  const ip = process.env.FAKE_IP || ipLookup.getClientIp(req);

  const lookup = geoip.lookup(ip);
  const timezone = lookup && lookup.timezone
    ? lookup.timezone
    : 'America/Los_Angeles';

  const start = moment.tz('2020-12-01 00:00', timezone);

  let today;
  if (isCheatMode) {
    today = moment.tz('2020-12-25 00:00', timezone);
  } else if (!!process.env.FAKE_TODAY) {
    today = moment.tz(process.env.FAKE_TODAY, timezone)
  } else {
    today = moment.tz(timezone);
  }

  const day = !!req.params.day
    ? getTargetDay(req.params.day, today)
    : Math.max(1, today.date() - 1);

  const cal = await getCalendar(day, start, today, timezone);

  return {
    ...cal,
    code: encode(ip)
  }
}

const encode = ip => Buffer.from(ip).toString('base64');
const decode = path => Buffer.from(path, 'base64').toString('ascii');

function getTargetDay(dayParam, today) {
  let day = parseInt(dayParam, 10);

  if (isNaN(day) || day >= 25) {
    day = today.date();
  }

  return Math.max(1, day - 1);
}

async function getCalendar(targetDay, start, today, timezone) {
  const coffees = await getCoffees(targetDay, today, timezone);
  const revealed = coffees.filter(c => c.date.isSameOrBefore(today));
  const remaining = coffees.slice(revealed.length).map(d => ({ day: d.day, target: d.target }));
  const ready = today.isSameOrAfter(start);

  return {
    revealed,
    remaining,
    ready
  };
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
