import {useState} from 'react'

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {
    // To be implemented
  };

  return (
    <form onSubmit={handleSubmit}>
      <strong>Username</strong>
      <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
      <strong>Password</strong>
      <input type='text' value={password} onChange={(e) => setPassword(e.target.value)} />
    </form>
  )
}

export default LoginForm