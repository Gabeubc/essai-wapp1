"use strict"

const Database = require("./common/database");
const express = require("express");
const morgan = require('morgan');
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const { initAuthentication, isLoggedIn } = require("./common/auth");
const passport = require("passport");
const base32 = require('thirty-two');
const TotpStrategy = require('passport-totp').Strategy; // totp

const ADMIN_VALUE = "admin"

const EDITABLE = "editable"
// init express
const PORT = 3001;
const db = new Database("plane-reservation-project.db");

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/static', express.static('./common/images'));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


initAuthentication(app, db);


//utils
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function randomCharInRange(startChar, endChar) {
  const start = startChar.charCodeAt(0);
  const end = endChar.charCodeAt(0);

  const randomCode = Math.floor(Math.random() * (end - start + 1)) + start;
  return String.fromCharCode(randomCode);
}


/**
 * Authenticate
 */


function clientUserInfo(req) {
  const user = req.user;
  return { id: user['ID'], username: user['USERNAME'], canDoTotp: user['SECRET'] ? true : false, isTotp: req.session.method === 'totp' };
}

// login
app.post(
  "/api/session",
  body("username", "username is not a valid email").isEmail(),
  body("password", "password must be a non-empty string").isString().notEmpty(),
  (req, res, next) => {
    // Check if validation is ok
    const err = validationResult(req);
    const errList = [];
    if (!err.isEmpty()) {
      err.errors.map(e => errList.push(e.msg))
      return res.status(400).json({ errors: errList });
    }

    // Perform the actual authentication
    passport.authenticate("local", (err, user, info) => {
      if (err)
        return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        return res.json(clientUserInfo(req));
      });
    })(req, res, next);
  });

app.post('/api/totp/verify', isLoggedIn, (req, res, next) => {
  passport.authenticate('totp', (err, user) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!user) return res.status(401).json({ error: 'Invalid code' });

    req.session.method = 'totp';
    res.json({ otp: 'authorized' });
  })(req, res, next);
});

// logout
app.delete('/api/session/current', (req, res) => {
  req.logout(() => { res.end(); });
});

/**
 * Other API impl
 */


// seat management

app.get("/api/seat", (req, res) => {
  db.getSeats()
    .then(results => {
      res.json(results);
    })
    .catch(() => res.status(500).json({ errors: ["Database error"] }));
});

app.get("/api/reservations", async (req, res) => {
  db.getReservations()
    .then(results => {
      res.json(results);
    })
    .catch(() => res.status(500).json({ errors: ["Database error"] }));
});


app.put("/api/seat/firstclass/:seatId", isLoggedIn, async (req, res) => {
  db.updateSeatFirstClass(req.params.seatId, req.body[req.params.seatId])
    .then(result => res.json(result))
    .catch(() => res.status(500).json({ errors: ["Database error"] }));
});

app.put("/api/seat/secondclass/:seatId", isLoggedIn, async (req, res) => {
  db.updateSeatSecondClass(req.params.seatId, req.body[req.params.seatId])
    .then(result => res.json(result))
    .catch(() => res.status(500).json({ errors: ["Database error"] }));
});

app.put("/api/seat/economy/:seatId", isLoggedIn, async (req, res) => {
  db.updateSeatEconomy(req.params.seatId, req.body[req.params.seatId])
    .then(result => res.json(result))
    .catch(() => res.status(500).json({ errors: ["Database error"] }));
});

app.post("/api/reservations", isLoggedIn, async (req, res) => {
  if (Array.isArray(req.body)){
  req
    .body
    .forEach(async (input) => {
      await db.createReservation(req.user['ID'], input)
        .then(() => 'reservation created' + input['seatId'])
        .catch(() => res.status(500).json({ errors: ["Database error"] }));
    });
  res.json({ message: "Reservations created" });
  }else if (req.body.numberOfSeat){
    console.log("not array");
    const freeSeats = await db.getSeatThatAreNotReserved();
    const lenFreeSeats = freeSeats.length;
    let n = req.body.numberOfSeat;
    const seatToReserve = [];
    while(n > 0){
      const randomIndex = getRandomInt(lenFreeSeats);
      seatToReserve.push(freeSeats[randomIndex]);
      n--;
    }
    seatToReserve
    .forEach(async (input) => {
      const c = randomCharInRange('A', 'D');
      console.log(c);
      await db.createReservation(req.user['ID'],
        {'seatId': input['SEAT_ID'], 'A': c === 'A', 'B': c === 'B', 'C': c === 'C', 'D': c === 'D'}
      )
        .then(() => 'reservation created' + input['seatId'])
        .catch(() => res.status(500).json({ errors: ["Database error"] }));
    });
    res.json({ message: "Reservations created" });
  }else{
    res.status(400).json({ errors: ["Bad request"] });
  }
});

app.put("/api/reservations/:id/confirm", isLoggedIn, async (req, res) => {
  db.confirmReservation(req.params.id)
    .then(result => res.json(result))
    .catch(() => res.status(500).json({ errors: ["Database error"] }));
});

app.put("/api/reservations/:id/cancel", isLoggedIn, async (req, res) => {
  db.cancelReservation(req.params.id)
    .then(result => res.json(result))
    .catch(() => res.status(500).json({ errors: ["Database error"] }));
});



// activate the server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

