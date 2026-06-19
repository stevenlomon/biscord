import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { MAX_CHARS_BIO } from "../utils";

const EditProfilePage = () => {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName);
  const [bio, setBio] = useState(currentUser?.bio);
  const BIO_CHARS_LEFT = bio ? MAX_CHARS_BIO - bio.length : MAX_CHARS_BIO
  // const [unsavedChanges, setUnsavedChanges] = useState(false);

  // useEffect(() => {
  //   // Guard Clause: If unsavedChanges is false, return early
  //   if (!unsavedChanges) return

  //   // *If* we have unsaved changes.. and either display name or bio is changed *back* to the saved current User values, set unsavedChanges back to false
  //   if (displayName === currentUser?.displayName && bio === currentUser?.bio) { // Should be AND! Not OR haha
  //     setUnsavedChanges(false);
  //   }

  // }, [displayName, bio]); // Listens for changes in display name and bio

  // Turns out... neither the state nor the useEffect is needed haha! We can calculate and check it immediately using derived state! This also removes the need for `setUnsavedChanges(true);` in the onChange handlers! Massive simplification 
  const hasUnsavedChanges = displayName !== currentUser?.displayName || bio !== currentUser?.bio

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Changes would now be saved!");
    // POST request to be implemented
    // And hasUnsavedChanges will be set back to false automatically once the POST request does its job!
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label><strong>Display Name</strong></label>
          <input
            type="text"
            value={displayName ?? ""} // Nullish Coalescing Operator: If displayName exists, use it, else "". Functionally identical to `displayName ? displayName : ""` but shorter
            placeholder={currentUser?.username}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div>
          <label><strong>Bio</strong></label>
          <p>You can use markdown and links if you'd like.</p>
          <textarea
            value={bio ?? ""}
            onChange={(e) => setBio(e.target.value)}
          />
          {/* TODO: emoji picker, custom tooltip */}
          <p title={`${BIO_CHARS_LEFT} characters remaining`}>{BIO_CHARS_LEFT}</p>
        </div>

        {hasUnsavedChanges && ( // Using `&& ()` instead of `? () : ("")` is way cleaner 
          <div>
            <p>Careful — you have unsaved changes!</p>
            <button
              type="button" // Prevent the form from submitting upon click!
              onClick={() => {
                setBio(currentUser?.bio)
                setDisplayName(currentUser?.displayName)
              }}>
              Reset
            </button>
            <button type="submit">Save Changes</button>
          </div>
        )}
      </form>
    </div>
  )
}

export default EditProfilePage