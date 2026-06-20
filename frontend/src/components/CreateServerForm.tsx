import { useState } from "react"
import { useAuth } from "../contexts/AuthContext";

const CreateServerForm = () => {
  const { currentUser } = useAuth();
  const [serverName, setServerName] = useState(currentUser?.displayName ? `${currentUser.displayName}'s server` : `${currentUser?.username}'s server`);

  function handleSubmit() {
    // To be implemented
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>Server Name <span>*</span></label>
      <input type="text" value={serverName} onChange={(e) => setServerName(e.target.value)} />
      <p>Community Guidelines? I don't know what that is</p>
      <button type="submit">Create</button>
    </form>
  )
}

export default CreateServerForm