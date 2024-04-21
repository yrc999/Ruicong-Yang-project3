import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthProvider";
import Nav from "./Nav";

function Register() {
    const navigate = useNavigate();
    const [usernameState, setUsernameState] = useState('');
    const [passwordState, setPasswordState] = useState('');
    const [confirmPasswordState, setConfirmPasswordState] = useState('');
    const [errorMsgState, setErrorMsgState] = useState('');
    const { login, isLoggedIn, username, logout } = useAuth();

    async function onSubmit() {
        setErrorMsgState('');
        if (!usernameState || !passwordState || !confirmPasswordState) {
            setErrorMsgState("Please fill in all fields.");
            return;
        }
        if (confirmPasswordState !== passwordState) {
            setErrorMsgState('Passwords do not match.');
            return;
        }

        try {
            await axios.post('/api/users/register', {
                username: usernameState,
                password: passwordState,
            });
            setUsernameState('');
            setPasswordState('');
            setConfirmPasswordState('');
            login(usernameState);
            navigate('/password');
        } catch (error) {
            setErrorMsgState(error.response.data);
        }
    }

    function updatePassword(event) {
        setPasswordState(event.target.value);
    }

    function updateConfirmPassword(event) {
        setConfirmPasswordState(event.target.value);
    }

    function updateUsername(event) {
        setUsernameState(event.target.value);
    }

    return (
        <div>
            <Nav isLoggedIn={isLoggedIn} username={username} onLogout={logout} />

            <div className="container">
                {errorMsgState && <h1>{errorMsgState}</h1>}
                <div>
                    <label>Username:</label> <input value={usernameState} onChange={(event) => updateUsername(event)} />
                </div>
                <div>
                    <label>Password:</label> <input type="password" value={passwordState} onChange={(event) => updatePassword(event)} />
                </div>
                <div>
                    <label>Confirm Password:</label> <input type="password" value={confirmPasswordState} onChange={(event) => updateConfirmPassword(event)} />
                </div>
                <div>
                    <button onClick={() => onSubmit()}>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default Register;
