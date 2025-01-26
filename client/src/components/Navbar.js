import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { FaBell } from 'react-icons/fa';

const Navbar = () => {
    const { isAuthenticated, logout, token } = useContext(AuthContext);
    const [unseenCount, setUnseenCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && token) {
            fetchUnseenNotifications();
        }
    }, [isAuthenticated, token]);

    const fetchUnseenNotifications = async () => {
        try {
            const response = await fetch('http://localhost:8000/notifications', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.ok) {
                setUnseenCount(data.notifications.filter(noti => !noti.isSeen).length);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-gray-900 p-4 flex justify-between items-center">
            <div className="text-white text-3xl font-bold">
                <Link to="/" className="font-serif hover:text-yellow-400 transition duration-300">
                    Stack Overflow Lite
                </Link>
            </div>
            <div className="flex gap-4 items-center">
                {isAuthenticated && (
                    <Link to="/notifications" className="relative text-white text-2xl">
                        <FaBell />
                        {unseenCount > 0 && (
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                        )}
                    </Link>
                )}
                {isAuthenticated ? (
                    <>
                        <Link to="/profile" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300">
                            Profile
                        </Link>
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-300">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/signup" className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-300">
                            Register
                        </Link>
                        <Link to="/signin" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300">
                            Sign In
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
