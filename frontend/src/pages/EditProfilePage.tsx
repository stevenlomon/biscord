import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

const EditProfilePage = () => {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName);
  const [bio, setBio] = useState(currentUser?.bio);

  return (
    <div>
      <form>
        <div>
          <label><strong>Display Name</strong></label>
          <input type="text" value={displayName ? displayName : ""} placeholder={currentUser?.username} onChange={(e) => setDisplayName(e.target.value)} />
        </div>

        <div>
          <label><strong>Bio</strong></label>
          <p>You can use markdown and links if you'd like.</p>
          <textarea value={bio ? bio : ""} onChange={(e) => setBio(e.target.value)}></textarea>
          {/* TODO: 190 character remaining counter, emoji picker */}
        </div>
        
        {/* TODO: Careful — you have unsaved changes! (Reset) (Save Changes) */}
      </form>
    </div>
  )
}

export default EditProfilePage