import { useState } from "react"
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

const CreateServerForm = () => {
  const { currentUser } = useAuth();
  const [serverName, setServerName] = useState(currentUser?.displayName ? `${currentUser.displayName}'s server` : `${currentUser?.username}'s server`);
  const [error, setError] = useState<string | null>(null);

  let navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3007/create-server", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
          name: serverName,
        }),
        credentials: "include",
      });
      console.log("Raw Response Status:", response.status);

      const data = await response.json();
      console.log("Parsed JSON Data from Server:", data);

      if (data?.success === "ok") {
        setServerName("");
        console.log(`Server created and current user set to Admin! data: ${data}`);

        navigate('/profile'); // For now. Will eventually become the server page where the user can see who's online, see channels, edit their profile etc etc etc
      } else if (data?.success === "not ok") {
        console.error("Database error when creating server. Please try again in a few minutes.");
        setError("Database error when creating server. Please try again in a few minutes.");
      }
    } catch (err) {
      console.error("Network error: ", err);
      // Same error handling used in LoginForm
      if (err instanceof Error) {
        setError(err.message); // If err a standard Error object, extract the message
      } else { 
        setError("An unexpected network error occurred."); // If it isn't, set it as a default fallback string
      }
    };
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Server Name <span>*</span></label>
      <input type="text" value={serverName} onChange={(e) => setServerName(e.target.value)} />
      <p>Community Guidelines? No idea what that is</p>
      <button type="submit">Create</button>
    </form>
  )
}

export default CreateServerForm