import { useState } from 'react'
import CreateServerForm from '../components/CreateServerForm';

const CreateServerPage = () => {
  const [onboardingPageShowing, setOnboardingPageShowing] = useState(1); // We could apparently also use a union type OnboardingStep = "INTRO" | "CUSTOMIZE" | "JOIN_A_SERVER"; but let's stick to the simple integers for now

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="bg-[#313338] rounded-md shadow-2xl w-full max-w-[440px] overflow-hidden flex flex-col relative">

        {/* Scuffed Close Button */}
        <button className="absolute top-4 right-4 text-[#B5BAC1] hover:text-[#DBDEE1] transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>

        {onboardingPageShowing === 1 ? (
          <div className="flex flex-col h-full">
            {/* Step 1: Main Content */}
            <div className="p-6 flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold text-[#F2F3F5] mb-2 mt-4">Create Your Server</h2>
              <p className="text-[#B5BAC1] text-sm mb-6 leading-relaxed px-4">
                Your server is where you and your friends hang out. Make yours and start talking.
              </p>

              <button
                onClick={() => setOnboardingPageShowing(2)}
                className="w-full flex items-center justify-between p-4 mb-4 bg-[#2B2D31] hover:bg-[#3F4147] border border-[#1E1F22] rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✏️</span> {/* Scuffed pencil icon */}
                  <span className="font-bold text-[#F2F3F5]">Create My Own</span>
                </div>
                <span className="text-[#B5BAC1] group-hover:text-[#F2F3F5] text-xl">›</span>
              </button>

              <p className="text-xs text-[#B5BAC1] mb-2">
                We don't have templates. You're creating your own.
              </p>
            </div>

            {/* Step 1: Footer */}
            <div className="bg-[#2B2D31] p-6 flex flex-col items-center text-center mt-auto">
              <h3 className="text-[#F2F3F5] text-xl font-bold mb-4">Have an invite already?</h3>
              <p className="text-[#B5BAC1] text-sm mb-6 leading-relaxed px-4">
                Too bad cuz we don't have a way for you to join it.
              </p>
              <button className="w-full bg-[#4E5058] hover:bg-[#6D6F78] text-white py-2 rounded-[3px] transition-colors text-sm font-medium">
                <span className="font-bold text-[#F2F3F5]">Join a Server (if I could)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Step 2: Main Content */}
            <div className="p-6 flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold text-[#F2F3F5] mb-2 mt-4">Customize Your Server</h2>
              <p className="text-[#B5BAC1] text-sm mb-6 leading-relaxed">
                Give your new server a personality with a name. <br/>Icon? We don't have an image server yet.
              </p>

              {/* Scuffed Upload Circle */}
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#4E5058] flex flex-col items-center justify-center mb-6 relative">
                <span className="text-[10px] font-bold text-[#B5BAC1]">UPLOAD</span>
                <div className="absolute top-0 right-0 bg-[#5865F2] text-white rounded-full w-6 h-6 flex items-center justify-center text-lg leading-none shadow-md">
                  +
                </div>
              </div>

              {/* Passing the back function down as a prop! */}
              <CreateServerForm onBack={() => setOnboardingPageShowing(1)} />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default CreateServerPage