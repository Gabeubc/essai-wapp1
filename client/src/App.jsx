/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import './index.css';
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import ReservationLayout from './components/main-components/ReservationLayout'
import HomeLayout from './components/main-components/HomeLayout';
import API from './common/API'
import { LoginForm } from './components/main-components/LoginForm'
import TotpForm from './components/main-components/TotpForm';
import RequireToEnableTotp from './components/main-components/RequireToEnableTotp';



function App() {

  const [stateSelectedSeat, setStateSelectedSeat] = useState({});
  const [stateFilter, setStateFilter] = useState('Economy');
  const [stateReload, setStateReload] = useState(false);
  const [stateReservations, setStateReservations] = useState([]);
  const [stateSeats, setStateSeats] = useState([]);
  const [stateCanReserve, setStateCanReserve] = useState(false);
  const [stateCanCancel, setStateCanCancel] = useState(false);
  const [stateCanConfirmReservation, setStateCanConfirmReservation] = useState(false);
  const [user, setUser] = useState(undefined);
  const [seatOccupiedByOther, setSeatOccupiedByOther] = useState(0);
  const [seatOccupiedByMe, setSeatOccupiedByMe] = useState(0);
  const [seatAvailable, setSeatAvailable] = useState(0);
  const [availableSeatList, setAvailableSeatList] = useState([]);
  const [seatRequested, setSeatRequested] = useState(0);
  const [totalSeats, setTotalSeats] = useState(0);
  const [seatsToBeRequested, setSeatsToBeRequested] = useState([]);

  const [selectedSeats, setSelectedSeats] = useState([])

  const [numberOfSeat, setNumberOfSeat] = useState(0);
  const [reserveByNumber, setReserveByNumber] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);
  const [totpEnabled, setTotpEnabled] = useState(false);

  function interfaceSetSelectedSeats(selectedSeats) {
    setSelectedSeats(selectedSeats)
  }

  function interfaceSetReserveByNumber(reserveByNumber) {
    setReserveByNumber(reserveByNumber)
  }

  function interfaceSetNumberOfSeat(numberOfSeat) {
    setNumberOfSeat(numberOfSeat)
  }

  function interfaceSetAvailableSeatList(availableSeatList) {
    setAvailableSeatList(availableSeatList)
  }

  function interfaceSetTotpEnabled(totpEnabled) {
    setTotpEnabled(totpEnabled);
  }

  function interfaceSeatToBeRequested(seatsToBeRequested) {
    setSeatsToBeRequested(seatsToBeRequested)
  }

  function interfaceSetCanConfirmReservation(canConfirmReservation) {
    setStateCanConfirmReservation(canConfirmReservation)
  }

  function interfaceSetStateReload(stateReload) {
    setStateReload(stateReload)
  }

  function interfaceSetSelectedSeat(seat) {
    setStateSelectedSeat(seat)
  }

  function interfaceSetSeats(seats) {
    setStateSeats(seats)
  }

  function interfaceSetStateCanReserve(canReserve) {
    setStateCanReserve(canReserve)
  }

  function interfaceSetStateFilter(filter) {
    setStateFilter(filter);
  }

  function interfaceSetStateCanCancel(canCancel) {
    setStateCanCancel(canCancel)
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(undefined);
    setTotpEnabled(false);
    setStateReload(!stateReload);
  }


  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
    setStateReload(!stateReload);
  }

  useEffect(() => {
    API.fetchReservation().then(reservations => {
      setStateReservations(reservations);
      API.fetchSeat().then(seats => {
        setStateSeats(seats.filter(seat => seat['CATEGORY'] === stateFilter));
        const availableSeatList_ = [];
        // TODO reservaation number based
        seats
          .forEach(s => {
            reservations
              .forEach(r => {
                if (r['SEAT_ID'] !== s['SEAT_ID'])
                  availableSeatList_.push(s['SEAT_ID'])
              }
              )
          });
        //end
        setAvailableSeatList(availableSeatList_);
        setTotalSeats(seats.length);
        let countOccupiedByOther = 0;
        let countOccupiedByMe = 0;
        let countRequested = 0;
        (reservations ? reservations : []).forEach(r => {
          if (user && r['USER_ID'] == user['ID']) {
            if (r['STATUS'] == 'CONFIRMED')
              countOccupiedByMe += 1;
            else if (r['STATUS'] == 'REQUESTED')
              countRequested += 1;
          } else {
            countOccupiedByOther += 1;
          }
        });
        setSeatOccupiedByOther(countOccupiedByOther);
        setSeatOccupiedByMe(countOccupiedByMe);
        setSeatRequested(countRequested);
        setSeatAvailable((totalSeats - countOccupiedByOther - countOccupiedByMe - countRequested < 0) ? 0 : (totalSeats - countOccupiedByOther - countOccupiedByMe - countRequested));
      });
    });
  }, [stateReload, stateFilter]);



  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={
            loggedIn ?
              <ReservationLayout
                user={user}
                reservations={stateReservations}
                seats={stateSeats}
                canReserve={stateCanReserve}
                canCancel={stateCanCancel}
                stateSelectedSeat={stateSelectedSeat}
                stateReload={stateReload}
                canConfirmReservation={stateCanConfirmReservation}
                seatOccupiedByOther={seatOccupiedByOther}
                seatOccupiedByMe={seatOccupiedByMe}
                seatRequested={seatRequested}
                seatAvailable={seatAvailable}
                totalSeats={totalSeats}
                seatsToBeRequested={seatsToBeRequested}
                availableSeatList={availableSeatList}
                filter={stateFilter}
                totpEnabled={totpEnabled}
                selectedSeats={selectedSeats}
                numberOfSeat={numberOfSeat}
                reserveByNumber={reserveByNumber}
                interfaceSetReserveByNumber={interfaceSetReserveByNumber}
                interfaceSetNumberOfSeat={interfaceSetNumberOfSeat}
                interfaceSetSelectedSeats={interfaceSetSelectedSeats}
                interfaceSetAvailableSeatList={interfaceSetAvailableSeatList}
                interfaceSetStateFilter={interfaceSetStateFilter}
                interfaceSetSeats={interfaceSetSeats}
                interfaceSetStateCanReserve={interfaceSetStateCanReserve}
                interfaceSetStateCanCancel={interfaceSetStateCanCancel}
                interfaceSetCanConfirmReservation={interfaceSetCanConfirmReservation}
                interfaceSetSelectedSeat={interfaceSetSelectedSeat}
                interfaceSetStateReload={interfaceSetStateReload}
                interfaceSeatToBeRequested={interfaceSeatToBeRequested}
                loggedIn={loggedIn}
                doLogOut={doLogOut}
              /> :
              <HomeLayout
                reservations={stateReservations}
                seats={stateSeats}
                canReserve={stateCanReserve}
                canCancel={stateCanCancel}
                stateSelectedSeat={stateSelectedSeat}
                stateReload={stateReload}
                canConfirmReservation={stateCanConfirmReservation}
                interfaceSetStateFilter={interfaceSetStateFilter}
                interfaceSetSeats={interfaceSetSeats}
                interfaceSetStateCanReserve={interfaceSetStateCanReserve}
                interfaceSetStateCanCancel={interfaceSetStateCanCancel}
                interfaceSetCanConfirmReservation={interfaceSetCanConfirmReservation}
                interfaceSetSelectedSeat={interfaceSetSelectedSeat}
                setStateReload={interfaceSetStateReload}
                loggedIn={loggedIn}
                doLogOut={doLogOut}
              />
          }
          />
          <Route path='/api/login' element={
            <LoginForm loginSuccessful={loginSuccessful} interfaceSetSeats={interfaceSetSeats} />
          }
          />
          <Route path='/api/login/totp' element={
            loggedIn && totpEnabled ?
              <Navigate replace to='/' /> :
              <TotpForm
                loggedIn={loggedIn}
                doLogOut={doLogOut}
                interfaceSetTotpEnabled={interfaceSetTotpEnabled}
                interfaceSetReload={interfaceSetStateReload}
              />
          }
          />
          <Route path='/api/login/totp/require' element={
            loggedIn && totpEnabled ?
              <Navigate replace to='/' /> :
              <RequireToEnableTotp
                loggedIn={loggedIn}
                doLogOut={doLogOut}
                interfaceSetTotpEnabled={interfaceSetTotpEnabled}
                interfaceSetReload={interfaceSetStateReload}
              />
          }
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
