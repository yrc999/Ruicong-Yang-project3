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
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");
    const [sharedPasswords, setSharedPasswords] = useState([]);
    const [messageReceiver, setMessageReceiver] = useState("");

    useEffect(() => {
        fetchPasswords(username);
        fetchMessages();
        fetchSharedUsers();
    }, [username]);

    const fetchSharedUsers = async () => {
        try {
            const response = await axios.get(`/api/messages/share?receiver=${username}`);
            let sharedUsers = response.data;
            let newSharedPasswords = [];
            for (let i = 0; i < sharedUsers.length; i++) {
                try {
                    const response = await axios.get(`/api/passwords/list?username=${sharedUsers[i].sender}`);
                    newSharedPasswords = [...newSharedPasswords, ...response.data];
                } catch (error) {
                    setError("Failed to fetch shared passwords.");
                }
            }
            setSharedPasswords(newSharedPasswords);
        } catch (error) {
            setError("Failed to fetch shared Users.");
        }
    }

    const fetchPasswords = async (username) => {
        try {
            const response = await axios.get(`/api/passwords/list?username=${username}`);
            setPasswords(response.data);
        } catch (error) {
            setError("Failed to fetch passwords.");
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`/api/messages/receive?receiver=${username}`);
            setMessages(response.data);
        } catch (error) {
            setError("Failed to fetch passwords.");
        }
    };

    const handleDeletePassword = async (index) => {
        const passwordToDelete = passwords[index];
        try {
            await axios.delete(`/api/passwords/delete/${passwordToDelete._id}`);
            fetchPasswords(username);
            setError("");
        } catch (error) {
            setError("Failed to delete password. Try again.");
        }
    };

    const handleSendMessage = async (event) => {
        event.preventDefault();
        if (!messageReceiver) {
            setError("Please enter a message receiver.");
            return;
        }

        if (messageReceiver === username) {
            setError("You can't share password with yourself.");
            return;
        }

        try {
            await axios.post("/api/users/check", {
                receiver: messageReceiver,
            });
        } catch (error) {
            setError("Failed to find users. Try again.");
            return;
        }

        try {
            await axios.post("/api/messages/send", {
                sender: username,
                receiver: messageReceiver,
                accepted: false
            });
            setMessageReceiver("");
            setError("");
        } catch (error) {
            setError("Failed to send message. Try again.");
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

    const handleAcceptMessage = async (index) => {
        const messageToUpdate = messages[index];
        try {
            await axios.put(`/api/messages/accept/${messageToUpdate._id}`);
            fetchMessages();
            fetchSharedUsers();
            setError("");
        } catch (error) {
            setError("Failed to accept share request. Try again.");
        }

        try {
            await axios.post("/api/messages/send", {
                sender: username,
                receiver: messageToUpdate.sender,
                accepted: true
            });
            setError("");
        } catch (error) {
            setError("Failed to accept share request. Try again.");
        }
    }

    const handleDeclineMessage = async (index) => {
        const messageToUpdate = messages[index];
        try {
            await axios.delete(`/api/messages/clear/${messageToUpdate._id}`);
            fetchMessages();
            setError("");
        } catch (error) {
            setError("Failed to decline share request. Try again.");
        }
    }

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
            fetchPasswords(username);
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
                <div className="error">{error && <div>{error}</div>}</div>
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
                    <h2>Shared Password List:</h2>
                    <ul>
                        {sharedPasswords.map((item, index) => (
                            <li key={index}>
                                <ul>
                                    <li>{"Username: " + item.username}</li>
                                    <li>{"Url: " + item.url}</li>
                                    <li>{"Password: " + item.password}</li>
                                    <li>{"Date: " + item.updatedAt.substring(0, 10)}</li>
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="container">
                    <h2>Message:</h2>
                    <form onSubmit={handleSendMessage}>
                        <div>
                            <label>Send Share Password Request:</label>
                            <input type="text" value={messageReceiver} onChange={(e) => setMessageReceiver(e.target.value)} />
                        </div>
                        <button type="submit">Send</button>
                    </form>
                    <ul>
                        {messages.map((item, index) => (
                            <li key={index}>
                                {"Sender: " + item.sender + " willing to share you passwords."}
                                <button className="accept" onClick={() => handleAcceptMessage(index)}>Accept</button>
                                <button className="delete" onClick={() => handleDeclineMessage(index)}>Decline</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Password;
