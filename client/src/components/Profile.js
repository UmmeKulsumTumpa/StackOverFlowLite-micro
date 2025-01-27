import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import PostDetails from './PostDetails';
import { User, Mail, PlusCircle, Box, Sparkles } from 'lucide-react';

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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="relative mb-16">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25"></div>
                    <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                        <div className="flex justify-center mb-4">
                            <Sparkles className="w-12 h-12 text-blue-600" />
                        </div>
                        <h2 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Your Profile
                        </h2>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 transform hover:scale-[1.01] transition-all">
                        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl">
                            <p className="font-medium text-center">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <div className="transform hover:scale-[1.02] transition-all duration-300">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl blur opacity-25"></div>
                                <div className="relative bg-white p-6 rounded-xl shadow-sm">
                                    <div className="space-y-6">
                                        <div className="flex items-center">
                                            <User className="w-6 h-6 text-blue-600 mr-3" />
                                            <h3 className="text-2xl font-semibold text-gray-700">Profile Details</h3>
                                        </div>
                                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                            <Mail className="w-5 h-5 text-gray-500 mr-3" />
                                            <p className="text-gray-600">{user?.email || 'No email available'}</p>
                                        </div>
                                        <Link 
                                            to="/create-post" 
                                            className="group flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                                        >
                                            <PlusCircle className="w-5 h-5 mr-2 transform group-hover:rotate-90 transition-transform duration-300" />
                                            Create New Post
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="flex items-center mb-8">
                            <Box className="w-8 h-8 text-blue-600 mr-3" />
                            <h3 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                Your Posts
                            </h3>
                        </div>
                        
                        {posts.length > 0 ? (
                            <div className="space-y-6">
                                {posts.map((post, index) => (
                                    <div 
                                        key={post._id}
                                        className="transform hover:scale-[1.01] transition-all duration-200"
                                        style={{
                                            opacity: 0,
                                            animation: `fadeIn 0.5s ease-out forwards ${index * 0.1}s`
                                        }}
                                    >
                                        <style>
                                            {`
                                                @keyframes fadeIn {
                                                    from { opacity: 0; transform: translateY(20px); }
                                                    to { opacity: 1; transform: translateY(0); }
                                                }
                                            `}
                                        </style>
                                        <div className="relative">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl blur opacity-25"></div>
                                            <div className="relative bg-white rounded-xl shadow-sm overflow-hidden">
                                                <PostDetails post={post} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="transform hover:scale-[1.01] transition-all">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl blur opacity-25"></div>
                                    <div className="relative bg-white p-12 rounded-xl shadow-sm text-center">
                                        <Box className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 text-xl font-medium mb-2">No posts yet</p>
                                        <p className="text-gray-500">Start sharing your thoughts with the community!</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;