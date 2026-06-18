import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"

const EditProfilePage = () => {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName);
  const [bio, setBio] = useState(currentUser?.bio);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    // Guard Clause: If unsavedChanges is false, return early
    if (!unsavedChanges) return

    // *If* we have unsaved changes.. and either display name or bio is changed *back* to the saved current User values, set unsavedChanges back to false
    if (displayName === currentUser?.displayName && bio === currentUser?.bio) { // Should be AND! Not OR haha
      setUnsavedChanges(false);
    }

  }, [displayName, bio]); // Listens for changes in display name and bio

  return (
    <div>
      <form>
        <div>
          <label><strong>Display Name</strong></label>
          <input
            type="text"
            value={displayName ? displayName : ""}
            placeholder={currentUser?.username}
            onChange={
              (e) => {
                setDisplayName(e.target.value)
                setUnsavedChanges(true);
              }
            }
          />
        </div>

        <div>
          <label><strong>Bio</strong></label>
          <p>You can use markdown and links if you'd like.</p>
          <textarea
            value={bio ? bio : ""}
            onChange={
              (e) => {
                setBio(e.target.value)
                setUnsavedChanges(true)
              }
            }>
          </textarea>
          {/* TODO: 190 character remaining counter, emoji picker */}
        </div>

        {/* TODO: Careful — you have unsaved changes! (Reset) (Save Changes) */}
      </form>
      {unsavedChanges ? "Careful — you have unsaved changes!" : "There are no unsaved changes"}
    </div>
  )
}

export default EditProfilePage