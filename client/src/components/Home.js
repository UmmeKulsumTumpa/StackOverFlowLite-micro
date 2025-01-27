import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import PostDetails from './PostDetails';
import { AlertTriangle, MessageSquare, Sparkles } from 'lucide-react';

const Home = () => {
    const { isAuthenticated, user } = React.useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const url = isAuthenticated
                    ? `http://localhost:8002/api/posts?excludeUserId=${user._id}`
                    : 'http://localhost:8002/api/posts';
    
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                const data = await response.json();
                if (response.ok) {
                    setPosts(
                        [...data.posts].sort(
                            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                        )
                    );
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError('Failed to fetch posts.');
            }
        };
    
        fetchPosts();
    }, [isAuthenticated, user]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="relative inline-block">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25"></div>
                        <div className="relative bg-white px-8 py-10 rounded-2xl shadow-xl">
                            <div className="flex justify-center mb-6">
                                <Sparkles className="w-12 h-12 text-blue-600" />
                            </div>
                            <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                                Discover Latest Posts
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                Join the conversation and explore insights from our vibrant community
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 transform hover:scale-[1.01] transition-all">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-red-100 rounded-lg blur opacity-25"></div>
                            <div className="relative bg-white border border-red-100 rounded-xl p-6 flex items-center justify-center space-x-4">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                                <p className="text-red-800 font-medium">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {posts.length > 0 ? (
                    <div className="space-y-8">
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
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg blur opacity-25"></div>
                                    <div className="relative bg-white rounded-xl shadow-sm overflow-hidden">
                                        <PostDetails post={post} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center transform hover:scale-[1.01] transition-all">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg blur opacity-25"></div>
                            <div className="relative bg-white p-12 rounded-xl shadow-sm">
                                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 text-xl font-medium mb-2">No posts yet</p>
                                <p className="text-gray-500">Be the first to share your thoughts!</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;