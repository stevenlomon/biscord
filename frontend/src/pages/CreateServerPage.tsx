import { useState } from 'react'
import CreateServerForm from '../components/CreateServerForm';

const CreateServerPage = () => {
  const [onboardingPageShowing, setOnboardingPageShowing] = useState(1); // We could apparently also use a union type OnboardingStep = "INTRO" | "CUSTOMIZE" | "JOIN_A_SERVER"; but let's stick to the simple integers for now

  return (
    <>
      {onboardingPageShowing === 1 ? (
        <div>
          <h2>Create Your Server</h2>
          <p>Your server is where you and your friends hang out. Make yours and start talking.</p>
          <p>We don't have templates. You're creating your own.</p>
          <button onClick={() => setOnboardingPageShowing(2)}>Create My Own</button>
          <p>Want to join another server? That's gonna have to wait, we don't have that yet.</p>
        </div>
      ) : (
      <div>
        <h2>Customize Your Server</h2>
        <p>Give your new server a personality with a name. Icon? We don't have an image server yet.</p>
        <CreateServerForm />
        <button onClick={() => setOnboardingPageShowing(1)}>Back</button>
      </div>
      )}
    </>
  )
}

export default CreateServerPage