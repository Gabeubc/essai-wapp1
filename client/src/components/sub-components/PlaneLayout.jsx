

function PlaneLayout(props) {
  return (
    <div className="p-4 flex flex-col items-center border rounded-lg">
      {props.seats.map((row) => (
        <div key={row['SEAT_ID']} className="flex flex-row">
          {['A', 'B', 'C', 'D'].map((letter) => {
            const seat = row[letter];
            if (!seat) return null;
            const matchingReservation = (props.reservations ? props.reservations : []).filter(r => r['SEAT_ID'] === row['SEAT_ID'] && r[letter]).map(r => {
              if (props.user && r['USER_ID'] == props.user.id) {
                if (r['STATUS'] == 'CONFIRMED') {
                  return {
                    'orange': true,
                    'confirmed': true,
                    'ID': r['ID']
                  };
                } else if (r['STATUS'] == 'REQUESTED') {
                  return {
                    'yellow': true,
                    'confirmed': false,
                    'ID': r['ID']
                  };
                }
              } else {
                return {
                  'red': true
                };
              }
            });
            const isReserved = matchingReservation.length > 0;
            const selectedSeatExist = props.selectedSeats && props.selectedSeats.filter(it => it === row['SEAT_ID'] + row['SEAT_NUMBER'] + letter).length > 0;
            return (
              <button
                key={`${row['SEAT_ID']}-${row['SEAT_NUMBER']}-${letter}`}
                className={`w-12 h-12 m-1 flex items-center justify-center border rounded ${isReserved && matchingReservation[0] && matchingReservation[0]['red'] ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer active:bg-red-700' :
                    isReserved && matchingReservation[0] && matchingReservation[0]['orange'] ? 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer active:bg-orange-700' :
                      isReserved && matchingReservation[0] && matchingReservation[0]['yellow'] ? 'bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer active:bg-yellow-700' :
                        selectedSeatExist ? 'bg-purple-500 text-white hover:bg-purple-600 cursor-pointer active:bg-purple-700' :
                          'bg-green-500 text-white hover:bg-green-600 cursor-pointer active:bg-green-700'
                  }`}
                onClick={() => {
                  if (!isReserved && props.loggedIn) {
                    const listSeatToBeRequested = (props.seatsToBeRequested ? [...props.seatsToBeRequested] : []);
                    listSeatToBeRequested.push(
                      { 'seatId': row['SEAT_ID'], 'seatNumber': row['SEAT_NUMBER'], 'column': letter }
                    );
                    if (selectedSeatExist){
                      props.interfaceSetSelectedSeats(props.selectedSeats.filter(it => it !== row['SEAT_ID'] + row['SEAT_NUMBER'] + letter))
                    }else {
                      props.selectedSeats.push(row['SEAT_ID'] + row['SEAT_NUMBER'] + letter);
                      props.interfaceSetSelectedSeats(props.selectedSeats);
                    }
                    props.interfaceSeatToBeRequested(listSeatToBeRequested);
                    props.interfaceSetSelectedSeat({ 'seatIds': listSeatToBeRequested, 'seatNumber': row['SEAT_NUMBER'], 'column': letter });
                    props.interfaceSetStateCanReserve(true);
                    props.interfaceSetStateCanCancel(false);
                    props.interfaceSetCanConfirmReservation(false);
                    props.interfaceSetStateReload(!props.stateReload);
                  } else if (isReserved && matchingReservation[0] && matchingReservation[0]['red'] && props.loggedIn) {
                    props.interfaceSetSelectedSeat({ 'seatId': row['SEAT_ID'], 'seatNumber': row['SEAT_NUMBER'], 'column': letter, 'reservationId': matchingReservation[0]['ID'] });
                    props.interfaceSetStateCanReserve(false);
                    props.interfaceSetStateCanCancel(false);
                    props.interfaceSetCanConfirmReservation(false);
                    props.interfaceSetStateReload(!props.stateReload);
                  } else if (isReserved && matchingReservation[0] && matchingReservation[0]['yellow'] && props.loggedIn) {
                    props.interfaceSetSelectedSeat({ 'seatId': row['SEAT_ID'], 'seatNumber': row['SEAT_NUMBER'], 'column': letter, 'reservationId': matchingReservation[0]['ID'] });
                    props.interfaceSetStateCanReserve(false);
                    props.interfaceSetStateCanCancel(true);
                    props.interfaceSetCanConfirmReservation(true);
                    props.interfaceSetStateReload(!props.stateReload);
                  } else if (isReserved && matchingReservation[0] && matchingReservation[0]['orange'] && props.loggedIn) {
                    props.interfaceSetSelectedSeat({ 'seatId': row['SEAT_ID'], 'seatNumber': row['SEAT_NUMBER'], 'column': letter, 'reservationId': matchingReservation[0]['ID'] });
                    props.interfaceSetStateCanReserve(false);
                    props.interfaceSetStateCanCancel(true);
                    props.interfaceSetCanConfirmReservation(false);
                    props.interfaceSetStateReload(!props.stateReload);
                  }
                }}
              >
                {`${row['SEAT_NUMBER']}-${letter}`}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default PlaneLayout;
