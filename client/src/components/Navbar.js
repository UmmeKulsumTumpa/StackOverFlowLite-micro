import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { FaBell, FaHome, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

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
        <nav className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 shadow-lg">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <div className="text-white text-3xl font-extrabold tracking-tight">
                    <Link to="/" className="font-['Inter'] hover:text-blue-400 transition duration-300 flex items-center space-x-2">
                        <FaHome className="inline-block mr-2" />
                        Stack Overflow Lite
                    </Link>
                </div>
                <div className="flex gap-4 items-center">
                    {isAuthenticated && (
                        <Link to="/notifications" className="relative text-white text-2xl group">
                            <FaBell className="transition-transform group-hover:scale-110" />
                            {unseenCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                                    {unseenCount}
                                </span>
                            )}
                        </Link>
                    )}
                    {isAuthenticated ? (
                        <>
                            <Link 
                                to="/profile" 
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 flex items-center space-x-2 group"
                            >
                                <FaUser className="group-hover:animate-spin" />
                                <span>Profile</span>
                            </Link>
                            <button 
                                onClick={handleLogout} 
                                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300 flex items-center space-x-2 group"
                            >
                                <FaSignOutAlt className="group-hover:rotate-45" />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/signup" 
                                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 flex items-center space-x-2 group"
                            >
                                <FaUserPlus className="group-hover:scale-110" />
                                <span>Register</span>
                            </Link>
                            <Link 
                                to="/signin" 
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 flex items-center space-x-2 group"
                            >
                                <FaSignInAlt className="group-hover:scale-110" />
                                <span>Sign In</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;