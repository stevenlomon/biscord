import { useState } from "react"
import { MONTHS, YEARS } from "../utils";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [displayName, setdisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirthMonth, setdateOfBirthMonth] = useState(null); // All DOB states will be represented as integers
  const [dateOfBirthDay, setdateOfBirthDay] = useState(null); 
  const [dateOfBirthYear, setdateOfBirthYear] = useState(null); 
  const [marketingConsent, setmarketingConsent] = useState(false);
  const [agreement, setAgreement] = useState(false);
  
  function handleSubmit() {
    // To be implemented
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Email <span>*</span></label>
        <input type="email" value={email} />

        <label>Display Name</label>
        <input type="text" value={displayName} />

        <label>Username <span>*</span></label>
        <input type="text" value={username} />

        <label>Password <span>*</span></label>
        <input type="text" value={password} />

        <label>Date of Birth <span>*</span></label>
        <select>
          {MONTHS.map(month => <option>{month}</option>)}
        </select>
        <select>
          {YEARS.map(year => <option>{year}</option>)}
        </select>
      </form>
    </div>
  )
}

export default RegisterForm