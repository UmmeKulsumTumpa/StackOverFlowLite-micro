//src/App.jsx
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost';
import HomePage from './pages/HomePage';
import PostsList from './components/PostList';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if the user is logged in

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {isAuthenticated && <Navbar />} 
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<LoginPage />} />
            {isAuthenticated ? (
              <>
                <Route path="/posts" element={<PostsList />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/posts" />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/signin" />} />
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;