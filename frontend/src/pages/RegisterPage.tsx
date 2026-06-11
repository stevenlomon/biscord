import RegisterForm from "../components/RegisterForm"
import { Link } from "react-router-dom"

const RegisterPage = () => {
  return (
    <div>
      <h2>Create an account</h2>
      <RegisterForm />
      <span>Already have an account? </span>
      <Link to={'/login'}>Log in</Link>
    </div>
  )
}

export default RegisterPage