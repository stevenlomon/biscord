import { useState } from "react"
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

// Define the props interface to accept the onBack function
interface CreateServerFormProps {
  onBack: () => void;
}

const CreateServerForm = ({ onBack }: CreateServerFormProps) => {
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
    <form onSubmit={handleSubmit} className="w-full text-left flex flex-col">
      
      {/* Input Field */}
      <div className="mb-4">
        <label className="text-xs font-bold text-[#B5BAC1] uppercase tracking-wide mb-2 block">
          Server Name <span className="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          value={serverName} 
          onChange={(e) => setServerName(e.target.value)} 
          className="w-full bg-[#1E1F22] text-[#DBDEE1] rounded-[3px] p-[10px] focus:outline-none focus:ring-1 focus:ring-[#00A8FC] transition-shadow"
          required
        />
      </div>

      {/* Error State */}
      {error && <p className="text-xs text-red-400 mb-2">{error}</p>}

      {/* Scuffed Guidelines */}
      <p className="text-xs text-[#B5BAC1] mb-6">
        🅱️iscord's <span className="text-[#00A8FC] font-medium">Community Guidelines?</span> No idea what that is.
      </p>

      {/* The Magic Footer! 
        -mx-6 (negative margin left/right) pulls it perfectly into the edges of the parent padding
        -mb-6 (negative margin bottom) anchors it to the bottom 
      */}
      <div className="bg-[#2B2D31] -mx-6 -mb-6 px-6 py-4 flex items-center justify-between mt-auto">
        <button 
          type="button" 
          onClick={onBack}
          className="text-white hover:underline text-sm font-medium transition-all"
        >
          Back
        </button>
        <button 
          type="submit"
          className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium rounded-[3px] px-6 py-2 transition-colors text-sm"
        >
          Create
        </button>
      </div>

    </form>
  )
}

export default CreateServerForm