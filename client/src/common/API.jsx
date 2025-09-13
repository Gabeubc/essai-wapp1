/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
const SERVER_HOST = "http://localhost";
const SERVER_PORT = 3001;

const SERVER_BASE = `${SERVER_HOST}:${SERVER_PORT}/api`;


//api call interrface

const APICall = async (endpoint, method = "GET", body = undefined, headers = undefined, expectResponse = true) => {
    let errors = [];

    try {
        const response = await fetch(SERVER_BASE + endpoint, {
            method,
            body,
            headers,
            credentials: "include"
        });

        if (response.ok) {
            if (expectResponse) return await response.json();
        }else {
            throw await response.json();
        }
    } catch {
        const err = ["Failed to contact the server"];
        throw err;
    }

    if (errors.length !== 0)
        throw errors;
};


//auth

const logIn = async (credentials) => await APICall(
    '/session',
    'POST',
    JSON.stringify(credentials),
    {
        'Content-Type': 'application/json',
    }
);

const logOut = async () => await APICall(
    "/session/current",
    "DELETE",
    undefined,
    undefined,
    false
);


// seat management

const fetchSeat = async () => await APICall('/seat');

const fetchReservation = async () => await APICall('/reservations');

const updateSeatFirstClass = async (seatId, seat) => await APICall(
    `/seat/firstclass/${seatId}`,
    'PUT',
    JSON.stringify(seat),
    {
        'Content-Type': 'application/json',
    }
);

const updateSeatSecondClass = async (seatId, seat) => await APICall(
    `/seat/secondclass/${seatId}`,
    'PUT',
    JSON.stringify(seat),
    {
        'Content-Type': 'application/json',
    }
);

const updateSeatEconomy = async (seatId, seat) => await APICall(
    `/seat/economy/${seatId}`,
    'PUT',
    JSON.stringify(seat),
    {
        'Content-Type': 'application/json',
    }
);

const createReservation = async (reservation) => await APICall(
    `/reservations`,
    'POST',
    JSON.stringify(reservation),
    {
        'Content-Type': 'application/json',
    }
);

const confirmReservation = async (reservationId) => await APICall(
    `/reservations/${reservationId}/confirm`,
    'PUT'
);

const cancelReservation = async (reservationId) => await APICall(
    `/reservations/${reservationId}/cancel`,
    'PUT'
);

const totpVerify = async (code) => await APICall(
    '/totp/verify',
    'POST',
    JSON.stringify({ code }),
    {
        'Content-Type': 'application/json',
    }
);

const API = {
    logIn,
    logOut,
    fetchSeat,
    fetchReservation,
    updateSeatFirstClass,
    updateSeatSecondClass,
    updateSeatEconomy,
    createReservation,
    confirmReservation,
    cancelReservation,
    totpVerify
}

export default API;