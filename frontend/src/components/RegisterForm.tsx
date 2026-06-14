import { useState } from "react"
import { useNavigate } from 'react-router-dom';
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

  let navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    // Guard clause: Telling TypeScript that we will not proceed if any value is null
    if (dateOfBirthYear === null || dateOfBirthMonth === null || dateOfBirthDay === null) {
      console.error("Please complete the date of birth field.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3007/create-user", { // Don't forget `http://`
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
          dob: new Date(dateOfBirthYear, dateOfBirthMonth, dateOfBirthDay),
          // Now using short-circuit intervention! "If we have a valid value for displayName from the frontend, use it. Else, use the null fallback". No ternary conditional payload needed! This will now match the `string | null` that bio gets from the backend
          displayName: displayName.trim() || null,
        }),
        credentials: "include", // For session cookies!
      });
      const data = await response.json();

      if (data?.success === "ok") {
        console.log(`User created! data: ${data}`);
        navigate('/login');
      }
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  }

  // Reusable label class to keep the code clean
  const labelClass = "text-xs font-bold text-[#B5BAC1] uppercase tracking-wide mb-2 block";
  const inputClass = "w-full bg-[#1E1F22] text-[#DBDEE1] rounded-[3px] p-[10px] focus:outline-none focus:ring-1 focus:ring-[#00A8FC] transition-shadow";

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Text Input Fields */}
        <div>
          <label className={labelClass}>Email <span className="text-red-500">*</span></label>
          <input className={inputClass} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>Display Name</label>
          {/* If no display name is entered, they will see their username when landing on the Profile page */}
          <input className={inputClass} type="text" value={displayName} onChange={(e) => setdisplayName(e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>Username <span className="text-red-500">*</span></label>
          <input className={inputClass} type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>Password <span className="text-red-500">*</span></label>
          <input className={inputClass} type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {/* Date of Birth Flex Row */}
        <label className={labelClass}>Date of Birth <span className="text-red-500">*</span></label>
        <div className="flex gap-4">
          <select className={`${inputClass} cursor-pointer`} required value={dateOfBirthMonth || ""} onChange={(e) => setdateOfBirthMonth(Number(e.target.value))}>
            <option value="" disabled hidden>Month</option>
            {/* Index adjusted here from `index + 1` to just `index`, now going from 0 to 11 to be in alignment with `new Date()` */}
            {MONTHS.map((month, index) => <option key={month} value={index}>{month}</option>)}
          </select>

          <select className={`${inputClass} cursor-pointer`} required value={dateOfBirthDay || ""} onChange={(e) => setdateOfBirthDay(Number(e.target.value))}>
            <option value="" disabled hidden>Days</option>
            {DAYS.map(day => <option key={day}>{day}</option>)}
          </select>

          <select className={`${inputClass} cursor-pointer`} required value={dateOfBirthYear || ""} onChange={(e) => setdateOfBirthYear(Number(e.target.value))}>
            <option value="" disabled hidden>Year</option>
            {YEARS.map(year => <option key={year}>{year}</option>)}
          </select>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-col gap-4 mt-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input className="shrink-0 mt-1 w-6 h-6 rounded accent-[#5865F2] cursor-pointer" type="checkbox" checked={marketingConsent} onChange={(e) => setmarketingConsent(e.target.checked)} />
            <span className="text-xs text-[#B5BAC1] leading-relaxed group-hover:text-[#DBDEE1] transition-colors">
              (Optional) It's okay to send me very real emails
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input className="shrink-0 mt-1 w-6 h-6 rounded accent-[#5865F2] cursor-pointer" type="checkbox" required checked={agreement} onChange={(e) => setAgreement(e.target.checked)} />
            <span className="text-xs text-[#B5BAC1] leading-relaxed group-hover:text-[#DBDEE1] transition-colors">
              We currently have no Terms of Service or Privacy Policy but please check this box anyway
            </span>
          </label>
        </div>

        {/* Submit Button */}
        {/* Derived state for the `disabled` property */}
        <button className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium rounded-[3px] p-3 mt-4 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed" type="submit" disabled={!agreement}>
          Create Account
        </button>
      </form>
    </div>
  )
}

export default RegisterForm