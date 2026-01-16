import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [NIC_number, setNIC_number] = useState("");
  const [role, setRole] = useState("patient");
  const [doctorID, setDoctorID] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_BASE_URL;

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setLoading(true);

  try {
    // Doctor validation - changed logic
    if (role === "doctor") {
      if (!doctorID || !NIC_number) {
        setError("Please enter both Doctor ID and NIC number.");
        setLoading(false);
        return;
      }

      const DOCresponse = await fetch(`${baseUrl}/get-doctor/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!DOCresponse.ok) {
        setError("Failed to verify doctor credentials. Please try again.");
        setLoading(false);
        return;
      }

      const responseData = await DOCresponse.json();

      // Check if doctors array exists and has data
      if (!responseData.doctors || responseData.doctors.length === 0) { // doctor data eka thiyenawanam check krnna
        setError("No doctor data available. Please try again later.");
        setLoading(false);
        return;
      }

      // Find matching doctor OR use any available doctor data
      let selectedDoctor = null;
      
      // First try to find exact match
      for (let i = 0; i < responseData.doctors.length; i++) { // methandi wenne doctor data eka loop krnna, doctor data eka ganna
        const doctorData = responseData.doctors[i]; // doctor data eka gannawa
        if (doctorData.doctor_id === parseInt(doctorID) && // doctor ID match krnna,parseInt krnne string eka integer ekata convert krnna
            doctorData.doctor_nicnumber === parseInt(NIC_number)) { // NIC number match krnna parseInt krnne string eka integer ekata convert krnna
          selectedDoctor = doctorData; // exact match una doctor data eka gannawa
          break;
        }
      }

      // If no exact match found, use the first available doctor
      if (!selectedDoctor) { // Use any available doctor data
        selectedDoctor = responseData.doctors[0]; // Use first doctor from response
        console.log("Using available doctor data:", selectedDoctor);
      }

      // Now you have doctor data to use for user creation
      console.log("Selected doctor:", selectedDoctor);
    }

    // Create user after validation passes
    const response = await fetch(`${baseUrl}/create-user/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        phone,
        birthday,
        role,
        doctorID, // Use user input
        NIC_number, // Use user input
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      setSuccess("Signup successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      const data = await response.json();
      setError(data.message || data.error);//network tab eke ena error message eka display krnna,message kiynne backend eken awne,error kiynne fetch request ekak failed unaama awne
    }
  } catch (error) { //network error handling
    console.error(error); // Log the error for debugging
    setError(error.message);// Display the error message to the user
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Create Account
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded border border-green-200 bg-green-50 text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Birthday</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">NIC Number</label>
            <input
              value={NIC_number}
              onChange={(e) => setNIC_number(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {role === "doctor" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Doctor ID (if any)
              </label>
              <input
                value={doctorID}
                onChange={(e) => setDoctorID(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
