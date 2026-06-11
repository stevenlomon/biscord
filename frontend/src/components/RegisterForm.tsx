import { useState } from "react"
import { MONTHS, DAYS, YEARS } from "../utils";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [displayName, setdisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirthMonth, setdateOfBirthMonth] = useState<number | null>(null); // All DOB states will be represented as integers
  const [dateOfBirthDay, setdateOfBirthDay] = useState<number | null>(null); 
  const [dateOfBirthYear, setdateOfBirthYear] = useState<number | null>(null); 
  const [marketingConsent, setmarketingConsent] = useState(false);
  const [agreement, setAgreement] = useState(false);
  
  function handleSubmit() {
    // To be implemented
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Email <span>*</span></label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Display Name</label>
        <input type="text" value={displayName} onChange={(e) => setdisplayName(e.target.value)} />

        <label>Username <span>*</span></label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Password <span>*</span></label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <label>Date of Birth <span>*</span></label>
        <select value={dateOfBirthMonth || ""} onChange={(e) => setdateOfBirthMonth(Number(e.target.value))}>
          <option value="" disabled>Month</option>
          {MONTHS.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
        </select>

        <select value={dateOfBirthDay || ""} onChange={(e) => setdateOfBirthDay(Number(e.target.value))}>
          <option value="" disabled>Days</option>
          {DAYS.map(day => <option key={day}>{day}</option>)}
        </select>

        <select value={dateOfBirthYear || ""} onChange={(e) => setdateOfBirthYear(Number(e.target.value))}>
          <option value="" disabled>Year</option>
          {YEARS.map(year => <option key={year}>{year}</option>)}
        </select>

        <input type="checkbox" checked={marketingConsent} onChange={(e) => setmarketingConsent(e.target.checked)} />
        <span>(Optional) It's okay to send me very real emails</span>

        <input type="checkbox" checked={agreement} onChange={(e) => setAgreement(e.target.checked)} />
        <span>We currently have no Terms of Service or Privacy Policy but please check this box anyway</span>

        {/* Derived state for the `disabled` property */}
        <button type="submit" disabled={!agreement}>Create Account</button>
      </form>
    </div>
  )
}

export default RegisterForm