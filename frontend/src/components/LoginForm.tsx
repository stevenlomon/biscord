import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordInputType, setPasswordInputType] = useState('password');
  const [error, setError] = useState<string | null>(null); // `error` is either a string ready to be printed to the screen, or `null` if everything is fine
  const {currentUser, setCurrentUser} = useAuth(); // currentUser is currently only used in a console log but it's a useful one haha!

  let navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    // To be implemented
    e.preventDefault();

    // Make the POST login request in order to check the response from the server
    try {
      const response = await fetch("http://localhost:3007/login", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password
        }),
        credentials: "include", // For session cookies!
      });
      console.log("Raw Response Status:", response.status);

      const data = await response.json();
      console.log("Parsed JSON Data from Server:", data);

      // The response will either have "sucess": "ok" or "sucess": "not ok"
      if (data?.success === "ok") {
        // Clear input upon succesful log in!
        setUsername("");
        setPassword("");
        console.log(`User logged in! data: ${data}`);
        
        // Here we set the current user. "Do we need a second fetch request?" No! Delegate the task of extracting everything that our AuthContext Interface expects to the server!! Meaning: modify the `/login` endpoint response!
        setCurrentUser({
          // All of our user data is now under the key `data` so yes, we get `data.data` haha
          id: data.data.id,
          createdAt: data.data.createdAt,
          username: data.data.username,
          displayName: data.data.displayName,
          bio: data.data.bio,
          profilePicURL: data.data.profilePicURL,
          onlineStatusId: data.data.onlineStatusId,
          onlineStatusUntil: data.data.onlineStatusUntil
        });
        // console.log(`Current user set! data: ${currentUser}`); // This won't work due to how React's internal clock works haha

        navigate('/profile');
      } else if (data?.success === "not ok") { // Let's just check it explicitly since we know the binary outcomes
        // Here we need to re-render the page and display "Wrong username or password. Try again" 
        // Is it best practice to wipe or not wipe upon a failed login attempt?
        // setUsername("");
        // setPassword("");
        // The real login page does *not* wipe these so let's model that
        // Hmmmm. I'm reasoning that in this scenario here I get the choice to either use this else if or "lump it in" with the catch all. Let's use this else if
        console.error("Wrong username or password. Please try again.");
        setError("Wrong username or password. Please try again."); // With our type defintion above, we can just set the string immediately! No object needed!
      }
    } catch (err) {
      console.error(`Network error: ${err}`);

      // Safely check if the unknown `err` is a standard Error object
      if (err instanceof Error) {
        setError(err.message); // If it is, extract the message
      } else { 
        setError("An unexpected network error occurred."); // If it isn't, set it as a default fallback string
      }
    };
  };

  // This will fire every time currentUser physically changes in React's memory
  useEffect(() => {
    if (!currentUser) return;

    console.log("From LoginForm.tsx: React has successfully updated the currentUser state to:", currentUser);
  }, [currentUser]);

  function togglePasswordVisibility() {
    passwordInputType === 'password' ? setPasswordInputType('text') : setPasswordInputType('password');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Username Field */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-[#B5BAC1] uppercase tracking-wide">
          Username <span className="text-red-500">*</span>
        </label>
        <input 
          type='text' 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          className="bg-[#1E1F22] text-[#DBDEE1] rounded-[3px] p-[10px] focus:outline-none focus:ring-1 focus:ring-[#00A8FC] transition-shadow"
          required
        />
      </div>

      {/* Password Field */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-[#B5BAC1] uppercase tracking-wide">
          Password <span className="text-red-500">*</span>
        </label>
        
        {/* Relative Wrapper for the icon magic */}
        <div className="relative">
          <input 
            type={passwordInputType} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            // Added w-full and pr-10 (padding-right) so text doesn't hide behind the SVG
            className="w-full bg-[#1E1F22] text-[#DBDEE1] rounded-[3px] p-[10px] pr-10 focus:outline-none focus:ring-1 focus:ring-[#00A8FC] transition-shadow"
            required
          />
          <button 
            type="button" // Prevents this button from submitting the login form!
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#B5BAC1] hover:text-[#DBDEE1] transition-colors"
            title={passwordInputType === 'password' ? "Show password" : "Hide password"}
          >
            {passwordInputType === 'password' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
            )}
          </button>
        </div>

        <a href="#" className="text-[#00A8FC] text-xs hover:underline mt-1 font-medium">
          Forgot your password? Too bad, we can't do anything about that at the moment
        </a>
      </div>

      {/* Submit Button */}
      <button 
        type='submit'
        className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium rounded-[3px] p-3 mt-2 transition-colors w-full"
      >
        Log In
      </button>
    </form>
  )
}

export default LoginForm