import React, { useState } from "react";
import Nav from "./Nav";
import "./Home.css";
import { useAuth } from "./AuthProvider";

function Home() {

    const { isLoggedIn, username, logout } = useAuth();

    return (
        <div>
            <Nav isLoggedIn={isLoggedIn} username={username} onLogout={logout} />
            <div className="container">
                <h1 style={{ fontWeight: "lighter", fontSize: "2em" }}>My Password Management Page</h1>
                <p>
                As more and more companies experience hacks and cybersecurity becomes more important,
                there are many services that can generate and manage passwords on your behalf.
 
                </p>
                <p>Created by: Ruicong Yang</p>
            </div>
        </div>
    );
}

export default Home;
