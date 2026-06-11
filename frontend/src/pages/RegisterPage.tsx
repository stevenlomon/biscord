import RegisterForm from "../components/RegisterForm"
import { Link } from "react-router-dom"

const RegisterPage = () => {
  return (
    <div className="bg-[#313338] rounded-[5px] shadow-2xl p-8 flex flex-col w-full max-w-[480px]">

      <h2 className="text-2xl font-bold text-[#F2F3F5] mb-6 text-center">
        Create an account
        </h2>

      <RegisterForm />

      <div className="mt-4 text-sm">
        <span className="text-[#B5BAC1]">Already have an account? </span>
        <Link to={'/login'} className="text-[#00A8FC] hover:underline font-medium">
          Log in
        </Link>
      </div>

    </div>
  )
}

export default RegisterPage;