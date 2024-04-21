import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import axios from "axios";
import { useAuth } from "./AuthProvider";
import "./Password.css";

function Password() {
    const { isLoggedIn, username, logout } = useAuth();
    const [url, setUrl] = useState("");
    const [password, setPassword] = useState("");
    const [alphabet, setAlphabet] = useState(false);
    const [numerics, setNumerics] = useState(false);
    const [symbols, setSymbols] = useState(false);
    const [length, setLength] = useState(8);
    const [passwords, setPasswords] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPasswords();
    }, [username]);

    const fetchPasswords = async () => {
        try {
            const response = await axios.get(`/api/passwords/list?username=${username}`);
            setPasswords(response.data);
        } catch (error) {
            setError("Failed to fetch passwords.");
        }
    };

    const handleDeletePassword = async (index) => {
        const passwordToDelete = passwords[index];
        try {
            await axios.delete(`/api/passwords/delete/${passwordToDelete._id}`);
            fetchPasswords();
            setError("");
        } catch (error) {
            setError("Failed to delete password. Try again.");
        }
    };

    const generatePassword = () => {
        let chars = "";
        let generatedPassword = "";
        let ignore = 0;
        if (alphabet) {
            chars += "abcdefghijklmnopqrstuvwxyz";
            ignore += 1;
            generatedPassword += "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * "abcdefghijklmnopqrstuvwxyz".length));
        }

        if (numerics) {
            chars += "0123456789";
            ignore += 1;
            generatedPassword += "0123456789".charAt(Math.floor(Math.random() * "0123456789".length));
        }

        if (symbols) {
            chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
            ignore += 1;
            generatedPassword += "!@#$%^&*()_+-=[]{}|;:,.<>?".charAt(Math.floor(Math.random() * "!@#$%^&*()_+-=[]{}|;:,.<>?".length));
        }

        for (let i = 0; i < length - ignore; i++) {
            generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return generatedPassword;
    };

    const handleGeneratePassword = () => {
        setPassword(generatePassword());
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!url) {
            setError("Please enter a URL.");
            return;
        }

        if (!password && !alphabet && !numerics && !symbols) {
            setError("Please select at least one character set or provide a password.");
            return;
        }

        if (length < 4 || length > 50) {
            setError("Please enter a valid length.");
            return;
        }

        let newPassWord = password;

        if (!newPassWord) {
            newPassWord = generatePassword();
        }

        try {
            const response = await axios.post("/api/passwords/store", {
                username,
                url,
                password: newPassWord
            });
            fetchPasswords();
            setUrl("");
            setPassword("");
            setError("");
        } catch (error) {
            setError("Failed to store password. Try again.");
        }
    };

    return (
        <div>
            <Nav isLoggedIn={isLoggedIn} username={username} onLogout={logout} />
            <div className="blocks">
                <div className="container">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>URL:</label>
                            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button type="button" onClick={handleGeneratePassword}>Generate</button>
                        </div>
                        <div>
                            <div className="fields">
                                <label>Alphabet</label>
                                <input type="checkbox" checked={alphabet} onChange={(e) => setAlphabet(e.target.checked)} />
                            </div>
                            <div className="fields">
                                <label>Numeric</label>
                                <input type="checkbox" checked={numerics} onChange={(e) => setNumerics(e.target.checked)} />
                            </div>
                            <div className="fields">
                                <label>Symbols</label>
                                <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} />
                            </div>
                        </div>
                        <div>
                            <label>Length:</label>
                            <input type="number" value={length} onChange={(e) => setLength(e.target.value)} />
                        </div>
                        {error && <div className="error">{error}</div>}
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div className="container">
                    <h2>My Password List:</h2>
                    <ul>
                        {passwords.map((item, index) => (
                            <li key={index}>
                                <ul>
                                    <li>{"Url: " + item.url}</li>
                                    <li>{"Password: " + item.password}</li>
                                    <li>{"Date: " + item.updatedAt.substring(0, 10)}</li>
                                    <button className="delete" onClick={() => handleDeletePassword(index)}>Delete</button>
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Password;
