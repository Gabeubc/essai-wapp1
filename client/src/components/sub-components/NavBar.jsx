/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useNavigate } from 'react-router-dom';


function NavBar(props) {

    return (
        props.hideLoginButton ? <BarWithoutLoginButton loggedIn={props.loggedIn} doLogOut={props.doLogOut} /> :
            <BarWithLoginButton loggedIn={props.loggedIn} doLogOut={props.doLogOut} />

    );
}

function BarWithLoginButton(props) {
    const navigate = useNavigate();
    return (
        <div className="flex flex-row justify-between w-full mb-4">
            <h1 className="text-lg font-bold mb-4">Airline Reservation System</h1>
            <button
                className="bg-blue-500 text-white px-14 rounded h-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-600 active:bg-blue-700"
                onClick={() => { !props.loggedIn ? navigate("/api/login") : navigate("/"); props.doLogOut() }}>
                {props.loggedIn ? 'Logout' : 'Login'}
            </button>
        </div>
    );
}


function BarWithoutLoginButton(props) {
    const navigate = useNavigate();
    return (
        <div className="w-full mb-4">
            <h1 className="text-lg text-center font-bold mb-4 cursor-default"><a onClick={() => navigate("/")}>Airline Reservation System</a></h1>
        </div>
    );
}

export default NavBar;