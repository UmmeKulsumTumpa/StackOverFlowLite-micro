import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
  
    const handleExplorePosts = () => {
      navigate('/posts');
    };
  
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="max-w-2xl p-8 bg-white shadow-md rounded-lg text-center">
          <h1 className="text-4xl font-bold mb-5">Welcome to StackOverflow</h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover insightful posts, share your knowledge, and connect with like-minded people.
          </p>
          <button
            onClick={handleExplorePosts}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Explore Posts
          </button>
        </div>
      </div>
    );
  };
  
  export default HomePage;
  