
import PlaneLayout from "../sub-components/PlaneLayout"
import API from "../../common/API"
import Navbar from "../sub-components/NavBar"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ReservationLayout(props) {

    const navigate = useNavigate();

    console.log(props.filter);

    return (
        <>
            <div className="m-4 p-4 flex flex-col items-center  rounded-lg">
                <Navbar
                    loggedIn={props.loggedIn}
                    doLogOut={props.doLogOut}
                />
                <div className="w-full flex flex-col items-center border rounded-lg p-4">
                    <div className="mb-4 w-full flex justify-end">
                        <select id="filter"
                            className="ml-2 border rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                            value={props.stateFilter} onChange={(e) => {
                                props.interfaceSetStateFilter(e.target.value)
                            }}>
                            <option value="Economy" className="text-gray-600">Economy</option>
                            <option value="Second" className="text-gray-600">Second</option>
                            <option value="First" className="text-gray-600">First</option>
                        </select>
                    </div>
                    <div className="w-full flex justify-around items-center border rounded-lg p-4">
                        <div className="mb-4 flex flex-col items-center gap-4">
                            <div className="text-gray-600 font-bold">Requested: {props.seatRequested}</div>
                            <div className="text-gray-600 font-bold">Available: {props.seatAvailable}</div>
                            <div className="text-gray-600 font-bold">Occupied by me: {props.seatOccupiedByMe}</div>
                            <div className="text-gray-600 font-bold">Occupied by others: {props.seatOccupiedByOther}</div>
                            <div className="text-gray-600 font-bold">Total seats: {props.totalSeats}</div>
                            {
                                props.selectedSeats && props.selectedSeats.length > 0 ?
                                    <input
                                        disabled
                                        type='number'
                                        className='border border-gray-400 rounded text-gray-600 focus:ring-gray-400 focus:border-gray-400 p-1.5'
                                        placeholder="0"
                                    />
                                    : <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            API.createReservation({ 'numberOfSeat': props.numberOfSeat })
                                                .then(() => {
                                                    props.interfaceSetStateCanReserve(false);
                                                    props.interfaceSetStateCanCancel(true);
                                                    props.interfaceSetCanConfirmReservation(true);
                                                    props.interfaceSetReserveByNumber(false);
                                                    props.interfaceSetStateReload(!props.stateReload);
                                                    props.interfaceSeatToBeRequested([]);
                                                })
                                                .catch(() => {
                                                    props.interfaceSetStateCanReserve(false);
                                                    props.interfaceSetStateCanCancel(false);
                                                    props.interfaceSetCanConfirmReservation(false);
                                                    props.interfaceSetStateReload(!props.stateReload);
                                                });
                                        }}
                                    >
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            className="border border-gray-400 rounded text-gray-600 focus:ring-gray-400 focus:border-gray-400 p-1.5"
                                            value={props.numberOfSeat}
                                            onChange={(e) => {
                                                console.log(e.target.value);
                                                props.interfaceSetNumberOfSeat(e.target.value);
                                                if (e.target.value > 0) {
                                                    props.interfaceSetReserveByNumber(true);
                                                    props.interfaceSetStateCanReserve(true);
                                                    props.interfaceSetStateReload(!props.stateReload);
                                                } else {
                                                    props.interfaceSetReserveByNumber(false);
                                                    props.interfaceSetStateCanReserve(false);
                                                }
                                            }}
                                        />
                                    </form>


                            }
                            {
                                props.filter == 'First' && !props.totpEnabled ?
                                    <button
                                        className={props.canReserve && (props.selectedSeats.length > 0 || props.reserveByNumber) ? "bg-blue-500 text-white font-bold py-2 px-4 rounded w-full" : "bg-gray-500 text-white font-bold py-2 px-4 rounded  w-full"}
                                        onClick={() => navigate('/api/login/totp')}
                                    >
                                        Enable OTP
                                    </button> :
                                    <></>
                            }
                            {
                                props.filter !== 'First'?
                                props.canReserve && (props.selectedSeats.length > 0 || props.reserveByNumber) ?
                                    <button
                                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
                                        onClick={() => {
                                            if (props.selectedSeats && props.selectedSeats.length > 0)
                                                API.createReservation(
                                                    props
                                                        .seatsToBeRequested
                                                        .map(seatToBeRequested => {
                                                            return {
                                                                'seatId': seatToBeRequested.seatId,
                                                                'A': seatToBeRequested.column === 'A' ? true : false,
                                                                'B': seatToBeRequested.column === 'B' ? true : false,
                                                                'C': seatToBeRequested.column === 'C' ? true : false,
                                                                'D': seatToBeRequested.column === 'D' ? true : false
                                                            }
                                                        })
                                                ).then(() => {
                                                    props.interfaceSetStateCanReserve(false);
                                                    props.interfaceSetStateCanCancel(true);
                                                    props.interfaceSetCanConfirmReservation(true);
                                                    props.interfaceSetStateReload(!props.stateReload);
                                                    props.interfaceSeatToBeRequested([]);
                                                })
                                                    .catch(() => {
                                                        props.interfaceSetStateCanReserve(false);
                                                        props.interfaceSetStateCanCancel(false);
                                                        props.interfaceSetCanConfirmReservation(false);
                                                        props.interfaceSetStateReload(!props.stateReload);
                                                    })
                                            else {

                                                API.createReservation({ 'numberOfSeat': props.numberOfSeat })
                                                    .then(() => {
                                                        props.interfaceSetStateCanReserve(false);
                                                        props.interfaceSetStateCanCancel(true);
                                                        props.interfaceSetCanConfirmReservation(true);
                                                        props.interfaceSetReserveByNumber(false);
                                                        props.interfaceSetStateReload(!props.stateReload);
                                                        props.interfaceSeatToBeRequested([]);
                                                    })
                                                    .catch(() => {
                                                        props.interfaceSetStateCanReserve(false);
                                                        props.interfaceSetStateCanCancel(false);
                                                        props.interfaceSetCanConfirmReservation(false);
                                                        props.interfaceSetStateReload(!props.stateReload);
                                                    });
                                            }
                                        }
                                        }
                                    >
                                        Reserve
                                    </button> :
                                    <button
                                        disabled
                                        className="bg-gray-500 text-white font-bold py-2 px-4 rounded  w-full"
                                    >
                                        Reserve
                                    </button>:
                                props.canReserve && (props.selectedSeats.length > 0 || props.reserveByNumber) && props.totpEnabled ?
                                    <button
                                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
                                        onClick={() => {
                                            if (props.selectedSeats && props.selectedSeats.length > 0)
                                                API.createReservation(
                                                    props
                                                        .seatsToBeRequested
                                                        .map(seatToBeRequested => {
                                                            return {
                                                                'seatId': seatToBeRequested.seatId,
                                                                'A': seatToBeRequested.column === 'A' ? true : false,
                                                                'B': seatToBeRequested.column === 'B' ? true : false,
                                                                'C': seatToBeRequested.column === 'C' ? true : false,
                                                                'D': seatToBeRequested.column === 'D' ? true : false
                                                            }
                                                        })
                                                ).then(() => {
                                                    props.interfaceSetStateCanReserve(false);
                                                    props.interfaceSetStateCanCancel(true);
                                                    props.interfaceSetCanConfirmReservation(true);
                                                    props.interfaceSetStateReload(!props.stateReload);
                                                    props.interfaceSeatToBeRequested([]);
                                                })
                                                    .catch(() => {
                                                        props.interfaceSetStateCanReserve(false);
                                                        props.interfaceSetStateCanCancel(false);
                                                        props.interfaceSetCanConfirmReservation(false);
                                                        props.interfaceSetStateReload(!props.stateReload);
                                                    })
                                            else {

                                                API.createReservation({ 'numberOfSeat': props.numberOfSeat })
                                                    .then(() => {
                                                        props.interfaceSetStateCanReserve(false);
                                                        props.interfaceSetStateCanCancel(true);
                                                        props.interfaceSetCanConfirmReservation(true);
                                                        props.interfaceSetReserveByNumber(false);
                                                        props.interfaceSetStateReload(!props.stateReload);
                                                        props.interfaceSeatToBeRequested([]);
                                                    })
                                                    .catch(() => {
                                                        props.interfaceSetStateCanReserve(false);
                                                        props.interfaceSetStateCanCancel(false);
                                                        props.interfaceSetCanConfirmReservation(false);
                                                        props.interfaceSetStateReload(!props.stateReload);
                                                    });
                                            }
                                        }
                                        }
                                    >
                                        Reserve
                                    </button> :
                                    <button
                                        disabled
                                        className="bg-gray-500 text-white font-bold py-2 px-4 rounded  w-full"
                                    >
                                        Reserve
                                    </button>
                            }
                            {
                                props.canConfirmReservation ?
                                    <button
                                        className="bg-green-500 text-white font-bold py-2 px-4 rounded w-full"
                                        onClick={() => {
                                            API.confirmReservation(
                                                props.stateSelectedSeat.reservationId
                                            ).then(() => {
                                                props.interfaceSetStateCanReserve(false);
                                                props.interfaceSetStateCanCancel(true);
                                                props.interfaceSetCanConfirmReservation(false);
                                                props.interfaceSetStateReload(!props.stateReload);
                                            })
                                                .catch(() => {
                                                    props.interfaceSetStateCanReserve(false);
                                                    props.interfaceSetStateCanCancel(false);
                                                    props.interfaceSetCanConfirmReservation(true);
                                                    props.interfaceSetStateReload(!props.stateReload);
                                                })
                                        }}
                                    >
                                        Confirm Reservation
                                    </button> :
                                    <button
                                        disabled
                                        className="bg-gray-500 text-white font-bold py-2 px-4 rounded w-full"
                                    >
                                        Confirm Reservation
                                    </button>
                            }
                            {
                                props.canCancel ?
                                    <button
                                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
                                        onClick={() => {
                                            API.cancelReservation(
                                                props.stateSelectedSeat.reservationId
                                            ).then(() => {
                                                props.interfaceSetStateCanReserve(false);
                                                props.interfaceSetStateCanCancel(false);
                                                props.interfaceSetCanConfirmReservation(false);
                                                props.interfaceSetStateReload(!props.stateReload);
                                            })
                                                .catch(() => {
                                                    props.interfaceSetStateReload(!props.stateReload);
                                                })
                                        }}
                                    >
                                        Cancel
                                    </button> :
                                    <button
                                        disabled
                                        className="bg-gray-500 text-white font-bold py-2 px-4 rounded w-full"
                                    >
                                        Cancel
                                    </button>

                            }
                        </div>
                        <PlaneLayout
                            user={props.user}
                            reservations={props.reservations}
                            seats={props.seats}
                            canReserve={props.canReserve}
                            canCancel={props.canCancel}
                            stateReload={props.stateReload}
                            selectedSeats={props.selectedSeats}
                            filter={props.stateFilter}
                            numberOfSeat={props.numberOfSeat}
                            reserveByNumber={props.reserveByNumber}
                            interfaceSetReserveByNumber={props.interfaceSetReserveByNumber}
                            interfaceSetNumberOfSeat={props.interfaceSetNumberOfSeat}
                            interfaceSetSelectedSeats={props.interfaceSetSelectedSeats}
                            interfaceSetStateReload={props.interfaceSetStateReload}
                            interfaceSetStateFilter={props.interfaceSetStateFilter}
                            interfaceSetSeats={props.interfaceSetSeats}
                            interfaceSetStateCanReserve={props.interfaceSetStateCanReserve}
                            interfaceSetStateCanCancel={props.interfaceSetStateCanCancel}
                            interfaceSetSelectedSeat={props.interfaceSetSelectedSeat}
                            loggedIn={props.loggedIn}
                            interfaceSetCanConfirmReservation={props.interfaceSetCanConfirmReservation}
                            seatsToBeRequested={props.seatsToBeRequested}
                            interfaceSeatToBeRequested={props.interfaceSeatToBeRequested}
                            availableSeatList={props.availableSeatList}
                            interfaceSetAvailableSeatList={props.interfaceSetAvailableSeatList}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReservationLayout;