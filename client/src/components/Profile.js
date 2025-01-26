// Profile.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import PostDetails from './PostDetails';

const Profile = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchUserPosts = async () => {
            if (user && user._id) {
                try {
                    const response = await fetch(`http://localhost:8002/api/posts/${user._id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    });

                    const data = await response.json();
                    if (response.ok) {
                        setPosts(data.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                    } else {
                        setError(data.message);
                    }
                } catch (error) {
                    setError('Failed to fetch user posts.');
                }
            }
        };

        fetchUserPosts();
    }, [user]);

    return (
        <div className="max-w-4xl mx-auto py-10 px-6 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Profile</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">User Details</h3>
                <p className="text-lg text-gray-600 mb-4">Email: {user?.email || 'No email available'}</p>
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                    <Link to="/create-post">Create Post</Link>
                </button>
            </div>

            <h3 className="text-3xl font-semibold text-gray-800 mb-4">Your Posts</h3>
            {posts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {posts.map((post) => (
                        <PostDetails key={post._id} post={post} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-center">You have no posts yet.</p>
            )}
        </div>
    );
};

export default Profile;
