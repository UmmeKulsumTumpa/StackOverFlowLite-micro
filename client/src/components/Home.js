// Home.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import PostDetails from './PostDetails';

const Home = () => {
    const { isAuthenticated, user } = React.useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Construct the API URL with the excludeUserId query parameter if the user is authenticated
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
        <div className="max-w-5xl mx-auto py-10 px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Recent Posts</h2>
            {error && <p className="text-red-500">{error}</p>}
            {posts.length > 0 ? (
                posts.map((post) => (
                    <PostDetails key={post._id} post={post} />
                ))
            ) : (
                <p className="text-gray-600 text-center">No posts available</p>
            )}
        </div>
    );
};

export default Home;
