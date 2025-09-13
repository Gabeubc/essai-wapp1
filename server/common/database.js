"use strict"

const sqlite = require("sqlite3");
const crypto = require("crypto");

/**
 * Wrapper around db.all
 */
const dbAllAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});


/**
 * Wrapper around db.run
 */
const dbRunAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if (err) {
      reject(err);
    } else {
      resolve({ lastID: this.lastID });
    }
  });
});

/**
 * Wrapper around db.get
 */
const dbGetAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

/**
 * Interface to the sqlite database for the application
 *
 * @param dbname name of the sqlite3 database file to open
 */
function Database(dbname) {
  this.db = new sqlite.Database(dbname, err => {
    if (err) throw err;
  });



  // common db operations

  this.getSeats = async () => {
    try {
      const seats = await (dbAllAsync(this.db, "SELECT * FROM seat", []));
      return seats;
    } catch (err) {
      return err;
    }
  };

  this.updateSeatFirstClass = async (seatId, seats) => {
    try {
      const result = await (dbRunAsync(this.db, "UPDATE seat SET a = ?, b = ? WHERE seat_id = ?", [seats.a, seats.b, seatId]));
      return result;
    } catch (err) {
      return err;
    }
  };

  this.updateSeatSecondClass = async (seatId, seats) => {
    try {
      const result = await (dbRunAsync(this.db, "UPDATE seat SET a = ?, b = ? , c = ? WHERE seat_id = ?", [seats.a, seats.b, seats.c, seatId]));
      return result;
    } catch (err) {
      return err;
    }
  };

  this.updateSeatEconomy = async (seatId, seats) => {
    try {
      const result = await (dbRunAsync(this.db, "UPDATE seat SET a = ?, b = ? , c = ?, d = ? WHERE seat_id = ?", [seats.a, seats.b, seats.c, seats.d, seatId]));
      return result;
    } catch (err) {
      return err;
    }
  };

  this.createReservation = async (userId, reservation) => {
    try {
      const result = await (dbRunAsync(this.db, "INSERT INTO reservation (SEAT_ID, USER_ID, A, B, C, D, status) VALUES (?, ?, ?, ?, ?, ?, 'REQUESTED')", [reservation.seatId, userId, reservation.A, reservation.B, reservation.C, reservation.D]));
      return result;
    } catch (err) {
      return err;
    }
  };

  this.confirmReservation = async (reservationId) => {
    try {
      const result = await (dbRunAsync(this.db, "UPDATE reservation SET STATUS = 'CONFIRMED' WHERE id = ?", [reservationId]));
      return result;
    } catch (err) {
      return err;
    } 
  };

  this.cancelReservation = async (reservationId) => {
    try {
      const result = await (dbRunAsync(this.db, "delete from reservation WHERE id = ?", [reservationId]));
      return result;
    } catch (err) {
      return err;
    }
  };



  this.getReservations = async () => {
    try {
      const reservations = await (dbAllAsync(this.db, "SELECT * FROM reservation", []));
      return reservations;
    } catch (err) {
      return err;
    }
  };

  this.getSeatThatAreNotReserved = async () => {
    try {
      const seats = await (dbAllAsync(this.db, "SELECT * FROM seat WHERE seat_id NOT IN (SELECT SEAT_ID FROM reservation)", []));
      return seats;
    } catch (err) {
      return err;
    }
  };

 


  // db authentication operation


  /**
     * Authenticate a user from their email and password
     * 
     * @param email email of the user to authenticate
     * @param password password of the user to authenticate
     * 
     * @returns a Promise that resolves to the user object {id, username, name, type}
     */

  this.authUser = (email, password) => new Promise((resolve, reject) => {
    // Get the user with the given email
    dbGetAsync(
      this.db,
      "select * from user where email = ?",
      [email]
    )
      .then(user => {
        // If there is no such user, resolve to false.
        // This is used instead of rejecting the Promise to differentiate the
        // failure from database errors
        if (!user) resolve(user);

        // Verify the password
        crypto.scrypt(password, user['SALT'], 32, (err, hash) => {
          if (err) reject(err);

          if (crypto.timingSafeEqual(hash, Buffer.from(user['HASHED_PASSWORD'], "hex"))){
            delete user['HASHED_PASSWORD']; 
            delete user['SALT'];
            resolve(user); // Avoid full_time = null being cast to false
          } else resolve(false);
        });
      })
      .catch(e => reject(e));
  });

  /**
  * Retrieve the user with the specified id
  * 
  * @param id the id of the user to retrieve
  * 
  * @returns a Promise that resolves to the user object {id, username, name, type}
  */
  this.getUser = async id => {
    const user = await dbGetAsync(
      this.db,
      "select * from user where id = ?",
      [id]
    );
    return user;

  }

}



module.exports = Database