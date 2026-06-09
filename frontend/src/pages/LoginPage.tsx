import LoginForm from "../components/LoginForm"

const LoginPage = () => {
  return (
    <div className="bg-[#313338] rounded-[5px] shadow-2xl p-8 flex flex-col md:flex-row gap-8 w-full max-w-[784px]">

      {/* Left Column: Form */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#F2F3F5] mb-2">Welcome back!</h2>
          <p className="text-[#B5BAC1]">We're so excited to see you again!</p>
        </div>

        <LoginForm />

        <div className="mt-4 text-sm">
          <span className="text-[#B5BAC1]">Need an account? </span>
          <a href="#" className="text-[#00A8FC] hover:underline font-medium">Register</a>
        </div>
      </div>

      {/* Right Column: Scuffed QR Code */}
      <div className="hidden md:flex w-[240px] flex-col items-center justify-center border-l border-[#3F4147] pl-8">
        <div className="w-44 h-44 bg-white rounded-md flex items-center justify-center mb-6 p-2 border-4 border-dashed border-red-500">
          <span className="text-black font-bold text-center">
            VERY REAL QR CODE<br />
            <span className="text-xs font-normal">(pretend this is a QR code)</span>
          </span>
        </div>
        <h3 className="text-xl font-bold text-[#F2F3F5] mb-2">Log in with QR Code</h3>
        <p className="text-[#B5BAC1] text-sm text-center mb-4">
          Looking for Log in with QR Code? You're gonna have to look elsewhere.
        </p>
      </div>

    </div>
  )
}

export default LoginPage;