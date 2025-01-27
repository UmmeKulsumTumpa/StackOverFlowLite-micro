import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import PostDetails from './PostDetails';
import { FaUser, FaEnvelope, FaPlusCircle, FaBox } from 'react-icons/fa';

const Profile = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchUserPosts = async () => {
            if (user && user._id) {
                try {
                    const response = await fetch(`http://localhost:8002/api/posts/user/${user._id}`, {
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
        <div className="max-w-6xl mx-auto py-10 px-6 bg-gray-50 min-h-screen">
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4 flex items-center justify-center">
                    <FaUser className="mr-4 text-gray-400" />
                    Profile
                </h2>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-center justify-center mb-8">
                    <p className="font-medium">{error}</p>
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-md h-fit">
                    <div className="flex items-center mb-4">
                        <FaUser className="text-blue-600 mr-3 text-2xl" />
                        <h3 className="text-2xl font-semibold text-gray-700">User Details</h3>
                    </div>
                    <div className="flex items-center mb-4">
                        <FaEnvelope className="text-gray-500 mr-3" />
                        <p className="text-gray-600">{user?.email || 'No email available'}</p>
                    </div>
                    <Link 
                        to="/create-post" 
                        className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 group"
                    >
                        <FaPlusCircle className="mr-2 group-hover:rotate-180 transition duration-300" />
                        Create Post
                    </Link>
                </div>

                <div className="md:col-span-2">
                    <h3 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center">
                        <FaBox className="mr-4 text-gray-400" />
                        Your Posts
                    </h3>
                    {posts.length > 0 ? (
                        <div className="space-y-6">
                            {posts.map((post) => (
                                <PostDetails key={post._id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-xl shadow-md text-center">
                            <p className="text-gray-600 text-xl">You have no posts yet.</p>
                            <p className="text-gray-500 mt-2">Start sharing your thoughts!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;