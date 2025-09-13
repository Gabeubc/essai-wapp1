import { useState, useRef } from 'react';
import API from '../../common/API';
import { useNavigate } from 'react-router-dom';
import Navbar from "../sub-components/NavBar"

function TotpForm(props) {
  const [totpDigits, setTotpDigits] = useState(Array(6).fill(''));
  const [errorMessage, setErrorMessage] = useState('');
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const doTotpVerify = (totp) => {
    API.totpVerify(totp)
      .then(() => {
        console.log("TOTP verification successful");
        setErrorMessage('');
        props.interfaceSetTotpEnabled(true);
        navigate('/');
      })
      .catch(() => {
        setErrorMessage('Wrong code, please try again');
      });
  };

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow digits

    const newDigits = [...totpDigits];
    newDigits[index] = value;
    setTotpDigits(newDigits);

    // Auto-focus next input if filled
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }

    // If all digits filled, verify
    if (newDigits.every((d) => d !== '')) {
      doTotpVerify(newDigits.join(''));
      setTotpDigits(Array(6).fill(''));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !totpDigits[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <>
      <div className='m-4 p-4 flex flex-col justify-between items-center rounded-lg'>
        <Navbar
          loggedIn={props.loggedIn}
          doLogOut={props.doLogOut}
        />
        <form
          className="flex flex-col justify-center items-center h-screen"
          onSubmit={(e) => {
            e.preventDefault();
            const totp = totpDigits.join('');
            if (totp.length === 6) {
              doTotpVerify(totp);
            } else {
              setErrorMessage('Please enter a 6-digit code');
            }
          }}
        >
          <label className="text-2xl mb-4">Enter your 6-digit TOTP code</label>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <div className="flex gap-4" data-pin-input>
            {totpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                className="border border-gray-400 rounded text-center text-gray-600 
                       focus:ring-2 focus:ring-gray-400 focus:border-gray-400 
                       p-2 w-12 text-lg"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                autoFocus={index === 0}
                aria-label={`PIN digit ${index + 1}`}
              />
            ))}
          </div>
        </form>
      </div>
    </>
  );
}


export default TotpForm;
