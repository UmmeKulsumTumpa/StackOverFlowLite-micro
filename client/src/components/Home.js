import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import PostDetails from './PostDetails';
import { FaExclamationTriangle } from 'react-icons/fa';

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
        <div className="max-w-6xl mx-auto py-10 px-4 bg-gray-50 min-h-screen">
            <div className="text-center mb-12 bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                    Recent Posts
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Explore the latest discussions and insights from our community
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-center justify-center mb-8">
                    <FaExclamationTriangle className="mr-4 text-2xl text-red-500" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {posts.length > 0 ? (
                <div className="space-y-8">
                    {posts.map((post) => (
                        <PostDetails key={post._id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center bg-white p-8 rounded-xl shadow-md">
                    <p className="text-gray-600 text-xl">No posts available</p>
                    <p className="text-gray-500 mt-2">Check back later or create a new post!</p>
                </div>
            )}
        </div>
    );
};

export default Home;