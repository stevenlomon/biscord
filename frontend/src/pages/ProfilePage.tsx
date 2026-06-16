import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProfilePage = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    // await fetch('http://localhost:3007/logout'); // We don't need to save the response, do we? The logout end is intentionally designed to not allow failed requests
    // Correction: that might sound correct but... we still need to match the POST method and include credentials so that we pass the middleware haha
    // const data = await response.json(); But it's true that we don't need to check the data! 
    // We only need to check that the response explicitly has given "ok"
    try {
      const response = await fetch('http://localhost:3007/logout', {
        method: "POST",
        credentials: "include"
      });

      if (response.ok) {
        console.log("Logging user out...")
        setCurrentUser(null); // Set currentUser back to null!
        navigate('/login');
      } else {
        console.error("Logout failed on the server.");
      }
    } catch (err) {
      console.error("Network error during logout:", err);
    }
  };

  // Same useEffect used in LoginForm.tsx
  useEffect(() => {
      if (!currentUser) return;
      
      console.log("From ProfilePage.tsx: React has successfully updated the currentUser state to:", currentUser);
    }, [currentUser]);

  return (
    <div>
      ProfilePage
      {/* Will be dynamically rendered with display name / username, online status, bio etc etc etc */}
      {/* But that's when we have Log in Context working so that we have a global state for the currently logged in user */}
      {/* For now, let's just make sure log out works */}
      <h2>{currentUser?.displayName || currentUser?.username}</h2>
      <p>{currentUser?.username}</p>
      
      <button onClick={handleLogout}>Log out</button>
      {/* Will be expanded upon with a "Logging you out..." spinner */}
    </div>
  )
}

export default ProfilePage