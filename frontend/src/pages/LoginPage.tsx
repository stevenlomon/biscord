import LoginForm from "../components/LoginForm"

const LoginPage = () => {
  return (
    <div>
      <h2>Welcome back!</h2>
      <p>We're so excited to see you again!</p>
      <LoginForm />
      <p>Forgot your password? Too bad, we can't do anything about that at the moment</p>
      <p>Looking for Log in with QR Code? You're gonna have to look elsewhere</p>
    </div>
  )
}

export default LoginPage