import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Bell, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:8001/api/notifications');
      const unread = response.data.notifications.filter((n) => !n.isSeen).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = async () => {
    try {
      navigate('/notifications');
    } catch (error) {
      console.error('Error navigating to notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 86400000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
        StackOverflow
      </h1>
      <div className="flex items-center space-x-6">
        <button onClick={() => navigate('/posts')}>Home</button>

        <button onClick={handleNotificationClick} className="relative">
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {unreadCount}
            </div>
          )}
          <Bell className="h-6 w-6" />
        </button>

        <button onClick={() => navigate('/profile')}>Profile</button>

        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
          <LogOut className="inline-block mr-2" /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
