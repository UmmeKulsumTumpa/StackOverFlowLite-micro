import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './components/Home';
import Notification from './components/Notification';
import PostDetail from './components/PostDetails';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost';

function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="/signup" element={<SignUp />} />
				<Route path="/signin" element={<SignIn />} />
				<Route path="/" element={<Home />} />
				<Route path="/notifications" element={<Notification />} />
				<Route path="/post/:id" element={<PostDetail />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/create-post" element={<CreatePost />} />
			</Routes>
			<Footer />
		</Router>
	);
}

export default App;
