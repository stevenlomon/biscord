import {useState} from 'react'
import { useNavigate } from 'react-router';

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
    <form onSubmit={handleSubmit}>
      <strong>Username</strong>
      <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
      <strong>Password</strong>
      <input type='text' value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type='submit' />
    </form>
  )
}

export default LoginForm