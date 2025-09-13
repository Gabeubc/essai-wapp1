
import { useNavigate } from 'react-router-dom';
import Navbar from "../sub-components/NavBar"

function RequireToEnableTotp(props) {
  const navigate = useNavigate();
    return (
        <>
            <div className='m-4 p-4 flex flex-col justify-between items-center rounded-lg'>
                <Navbar
                    loggedIn={props.loggedIn}
                    doLogOut={props.doLogOut}
                />
                <div className="flex justify-between w-1/2">
                    <button
                        className='bg-gray-500 text-white font-bold py-2 px-4 rounded w-1/4 hover:bg-blue-500'
                        onClick={() => navigate('/api/login/totp')}
                    >Proceed with TOTP</button>
                    <button
                        className='bg-gray-500 text-white font-bold py-2 px-4 rounded w-1/4 hover:bg-blue-500'
                        onClick={() => navigate('/')}
                    >Proceed without TOTP</button>
                </div>

            </div>
        </>
    )
}

export default RequireToEnableTotp;