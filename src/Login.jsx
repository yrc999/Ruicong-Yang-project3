import React, { useState } from "react";
import Nav from "./Nav";
import axios from "axios";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
    const navigate = useNavigate();
    const { login, isLoggedIn, username, logout } = useAuth();
    const [usernameState, setUsernameState] = useState("");
    const [passwordState, setPasswordState] = useState("");
    const [errorMsgState, setErrorMsgState] = useState("");

    async function onSubmit() {
        setErrorMsgState("");
        try {
            await axios.post("/api/users/login", {
                username: usernameState,
                password: passwordState,
            });
            setUsernameState("");
            setPasswordState("");
            login(usernameState);
            navigate("/password");
        } catch (error) {
            setErrorMsgState(error.response.data);
        }
    }

    function updatePassword(event) {
        setPasswordState(event.target.value);
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
                    <label>Username:</label>{" "}
                    <input
                        value={usernameState}
                        onChange={(event) => updateUsername(event)}
                        autoFocus
                    />
                </div>
                <div>
                    <label>Password:</label>{" "}
                    <input
                        type="password"
                        value={passwordState}
                        onChange={(event) => updatePassword(event)}
                    />
                </div>
                <div>
                    <button onClick={() => onSubmit()}>Submit</button>
                </div>
            </div>
        </div>
    );
}
