import {useState} from 'react'
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    // To be implemented
    e.preventDefault();
    setUsername("");
    setPassword("");

    console.log("Logged in! Navigating to Profile page...");
    navigate('/profile');
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
        <input 
          type='password' 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="bg-[#1E1F22] text-[#DBDEE1] rounded-[3px] p-[10px] focus:outline-none focus:ring-1 focus:ring-[#00A8FC] transition-shadow"
          required
        />
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