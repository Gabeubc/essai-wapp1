import PlaneLayout from "../sub-components/PlaneLayout";
import { useNavigate } from "react-router-dom";
import  Navbar  from "../sub-components/NavBar";

function HomeLayout(props) {

    return (
        <>
            <div className="m-4 p-4 flex flex-col items-center  rounded-lg">
                <Navbar
                    loggedIn={props.loggedIn}
                    doLogOut={props.doLogOut} 
                />
                <div className="w-full flex flex-col items-center border rounded-lg p-4">
                    <div className="mb-4 w-full flex justify-end">
                        {/* <label htmlFor="filter" className="mr-2">Filter by Class:</label> */}
                        <select id="filter"
                            className="ml-2 border rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={props.stateFilter} onChange={(e) => {
                                props.interfaceSetStateFilter(e.target.value)
                            }}>
                            <option value="Economy" className="text-gray-600">Economy</option>
                            <option value="Second" className="text-gray-600">Second</option>
                            <option value="First" className="text-gray-600">First</option>
                        </select>
                    </div>
                    <PlaneLayout
                        reservations={props.reservations}
                        seats={props.seats}
                        canReserve={props.canReserve}
                        canCancel={props.canCancel}
                        stateReload={props.stateReload}
                        interfaceSetStateReload={props.interfaceSetStateReload}
                        interfaceSetStateFilter={props.interfaceSetStateFilter}
                        interfaceSetSeats={props.interfaceSetSeats}
                        interfaceSetStateCanReserve={props.interfaceSetStateCanReserve}
                        interfaceSetStateCanCancel={props.interfaceSetStateCanCancel}
                        loggedIn = {props.loggedIn}
                        interfaceSetSelectedSeat={props.interfaceSetSelectedSeat}
                    />
                </div>
            </div>
        </>
    )
}

export default HomeLayout;