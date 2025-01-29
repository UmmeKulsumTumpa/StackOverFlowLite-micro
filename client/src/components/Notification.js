import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import PostDetails from './PostDetails';
import { Bell, Check, ChevronDown, ChevronUp, Eye } from 'lucide-react';

const Notifications = () => {
    const { token, user } = useContext(AuthContext); // Get token and user info
    const [notifications, setNotifications] = useState([]);
    const [expandedNotificationId, setExpandedNotificationId] = useState(null);
    const [postDetails, setPostDetails] = useState({});
    const [loadingPost, setLoadingPost] = useState(false);

    useEffect(() => {
        if (token) {
            fetchNotifications();
        }
    }, [token]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:8003/api/notifications', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

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
            const response = await fetch(`http://localhost:8003/api/notifications/${notificationId}/markAsSeen`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setNotifications((prevNotifications) =>
                    prevNotifications.map((notification) =>
                        notification._id === notificationId
                            ? { ...notification, isSeen: true }
                            : notification
                    )
                );
            } else {
                console.error('Failed to mark notification as seen');
            }
        } catch (error) {
            console.error('Error marking notification as seen:', error);
        }
    };

    const fetchPostDetails = async (postId) => {
        try {
            setLoadingPost(true);
            const response = await fetch(`http://localhost:8002/api/posts/${postId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (response.ok) {
                setPostDetails((prevDetails) => ({
                    ...prevDetails,
                    [postId]: data.post,
                }));
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching post details:', error);
        } finally {
            setLoadingPost(false);
        }
    };

    const togglePostDetails = (notification) => {
        const postId = notification.postId;

        if (expandedNotificationId === notification._id) {
            setExpandedNotificationId(null);
        } else {
            setExpandedNotificationId(notification._id);
            if (!postDetails[postId]) {
                fetchPostDetails(postId);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto max-w-4xl p-6">
                <div className="flex items-center gap-3 mb-8">
                    <Bell className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                </div>
                
                {notifications.length > 0 ? (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`
                                    transform transition-all duration-200 
                                    hover:shadow-lg rounded-xl overflow-hidden
                                    ${notification.isSeen ? 'bg-white' : 'bg-blue-50'}
                                    border ${notification.isSeen ? 'border-gray-200' : 'border-blue-200'}
                                `}
                            >
                                <div className="p-6">
                                    <p className="text-lg text-gray-800 mb-4">{notification.message}</p>
                                    
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => markAsSeen(notification._id)}
                                            className={`
                                                inline-flex items-center gap-2 px-4 py-2 rounded-lg
                                                transition-colors duration-200
                                                ${notification.isSeen 
                                                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'}
                                            `}
                                        >
                                            {notification.isSeen ? (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    <span>Seen</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="w-4 h-4" />
                                                    <span>Mark as Seen</span>
                                                </>
                                            )}
                                        </button>

                                        {notification.postId && (
                                            <button
                                                onClick={() => togglePostDetails(notification)}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                                                    bg-blue-100 text-blue-700 hover:bg-blue-200
                                                    transition-colors duration-200"
                                            >
                                                {expandedNotificationId === notification._id ? (
                                                    <>
                                                        <ChevronUp className="w-4 h-4" />
                                                        <span>Hide Post</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown className="w-4 h-4" />
                                                        <span>View Post</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {expandedNotificationId === notification._id && notification.postId && (
                                    <div className="px-6 pb-6">
                                        <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                                            {loadingPost && !postDetails[notification.postId] ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                </div>
                                            ) : postDetails[notification.postId] ? (
                                                <PostDetails post={postDetails[notification.postId]} />
                                            ) : (
                                                <p className="text-red-500 text-center py-4">Error fetching post details.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No notifications available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
