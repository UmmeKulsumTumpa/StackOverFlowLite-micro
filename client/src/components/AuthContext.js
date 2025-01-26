// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
	const [error, setError] = useState(null);


    useEffect(() => {
        // On component mount, check if token exists in localStorage
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                console.log("decoded: ",decoded);
                
                setToken(storedToken);
                setIsAuthenticated(true);
                setUser({ _id: decoded.id, email: decoded.email }); // Adjust based on token payload
            } catch (err) {
                console.error('Invalid token:', err);
                logout(); // Optionally logout if token is invalid
            }
        }
    }, []);

    const login = (token) => {
        try {
            const decoded = jwtDecode(token);
            localStorage.setItem('token', token);
            setToken(token);
            setIsAuthenticated(true);
            setUser({ _id: decoded.id, email: decoded.email }); // Adjust based on token payload
        } catch (err) {
            console.error('Invalid token during login:', err);
            setError('Invalid token received.');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
};
