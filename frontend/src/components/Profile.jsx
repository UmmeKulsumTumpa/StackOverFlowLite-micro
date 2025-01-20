const Profile = () => {
    let user = {};
  
    try {
      const storedUser = localStorage.getItem('user');
      user = storedUser ? JSON.parse(storedUser) : {};
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }
  
    return (
      <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-5">Profile</h2>
        {user.email ? (
          <>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>ID:</strong> {user.id}</p>
          </>
        ) : (
          <p>No user data available. Please log in.</p>
        )}
      </div>
    );
  };
  
  export default Profile;
  