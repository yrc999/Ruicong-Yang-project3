import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Nav.css";

export default function Nav({ isLoggedIn, username, onLogout }) {
    return (
        <nav>
            <NavLink to="/" exact activeClassName="active">
                Home
            </NavLink>
            {isLoggedIn ? (
                <div className="user-section">
                    <span>Welcome, {username}</span>
                    <NavLink to="/password" activeClassName="active">
                        Passwords
                    </NavLink>
                    <button onClick={onLogout}>Logout</button>
                </div>
            ) : (
                <div className="auth-section">
                    <NavLink to="/login" activeClassName="active">
                        Login
                    </NavLink>
                    <NavLink to="/register" activeClassName="active">
                        Register
                    </NavLink>
                </div>
            )}
        </nav>
    );
}
