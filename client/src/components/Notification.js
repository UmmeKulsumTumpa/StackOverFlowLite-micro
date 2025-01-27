import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import PostDetails from './PostDetails';

const Notifications = () => {
    const { token } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, [token]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:8003/api/notifications', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log(data);
            
            if (response.ok) {
                setNotifications(data.notifications);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsSeen = async (notificationId) => {
        try {
            await fetch(`http://localhost:8003/api/notifications/${notificationId}/markAsSeen`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            // Update the notification state locally after marking it as seen
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification._id === notificationId
                        ? { ...notification, isSeen: true }
                        : notification
                )
            );
        } catch (error) {
            console.error('Error marking notification as seen:', error);
        }
    };

    return (
        <div className="container mx-auto max-w-4xl p-4">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <div
                        key={notification._id}
                        className={`p-4 mb-4 border rounded ${notification.isSeen ? 'bg-gray-100' : 'bg-blue-100'}`}
                    >
                        <p className="text-lg text-gray-800">
                            {notification.message}
                        </p>
                        <p className="text-sm text-gray-500">
                            {new Date(notification.createdAt).toLocaleString()}
                        </p>
                        {notification.postId && (
                            <div className="mt-4">
                                <PostDetails post={notification.postId} />
                                <button
                                    onClick={() => markAsSeen(notification._id)}
                                    className="mt-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    {notification.isSeen ? 'Seen' : 'Mark as Seen'}
                                </button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-sm text-gray-500">No notifications available.</p>
            )}
        </div>
    );
};

export default Notifications;
