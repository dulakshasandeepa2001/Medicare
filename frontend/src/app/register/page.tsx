"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { Stethoscope, Lock, User, Mail, Phone, Calendar, Landmark, AlertCircle, ArrowLeft, GraduationCap,University } from "lucide-react";
import { text } from "stream/consumers";
import { AnyRecord } from "dns";

interface PendingDoctor {
  id: number;
  username: string;
  email: string;
  phone: string;
  NIC_number: string;  // ← was NICID
  doctorID: string;
  degrees: string;
  university: string;
  working_hospital: string;
  birthday: string;
  created_at: string;
}

export default function Register() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<PendingDoctor[]>([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [role, setRole] = useState("patient");
  const [nicNumber, setNicNumber] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [degrees, setDegrees] = useState("");
  const [university, setUniversity] = useState<string[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [workingHospital, setWorkingHospital] = useState("");

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const response = await fetch(
          "http://universities.hipolabs.com/search?country=Sri Lanka"
        );
        
        const data = await response.json();
        
        const universityNames = data.map(
           (item:{name:string}) => item.name
        );
        setUniversity(universityNames);
      } catch (error) {
        console.error(error);
      }
    };
    loadUniversities();
  },[]);

  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!username || !email || !password || !phone || !birthday || !role || !nicNumber ) {
      setError("All fields, including NIC and Doctor assignment, are required.");
      setLoading(false);
      return;
    }

    try {
      const now = new Date().toISOString();
      await apiRequest("/create-user/", {
        method: "POST",
        body: JSON.stringify({
          username,
          email,
          password,
          phone,
          birthday,
          role,
          NIC_number: nicNumber,
          degrees,
          university: selectedUniversity,
          created_at: now,
          updated_at: now,  
        }),
      });

      if (role === "doctor") {
        setSuccess("Registration submitted for admin approval! You'll be notified.");
      } else {
        setSuccess("Account created! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: unknown) {
      // Prefer narrowing the error to Error instead of using `any` to satisfy eslint
      if (err instanceof Error) {
        setError(err.message || "Failed to create account. Please check user details.");
      } else {
        setError("Failed to create account. Please check user details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center py-12 px-4 relative font-sans">
      {/* Background Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Back to Home Link */}
      <div className="mb-6 w-full max-w-lg">
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-white flex items-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to homepage</span>
        </Link>
      </div>

      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-sm">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-teal-500/10 p-3 rounded-2xl border border-teal-500/20 mb-4">
            <Stethoscope className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-2xl font-black text-white">Create Account</h1>
          <p className="text-xs text-slate-400 mt-1">
            Register your profile on the Medicare System
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs text-rose-400 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-xs text-emerald-400 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Row 1: Username & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Password & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400" htmlFor="phone">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0771234567"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Birthday & NIC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400" htmlFor="birthday">
                Birthday
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  id="birthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400" htmlFor="nic">
                NIC Number
              </label>
              <div className="relative">
                <Landmark className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  id="nic"
                  type="text"
                  value={nicNumber}
                  onChange={(e) => setNicNumber(e.target.value)}
                  placeholder="199912345678"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Role Selection & Doctor List Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400" htmlFor="role">
                Portal Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
              >
                <option value="patient">Patient Portal</option>
                <option value="doctor">Doctor Portal</option>
              </select>
            </div>

            {role === "doctor" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="GraduationCap">
                    Degrees
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={degrees}
                      onChange={(e) => setDegrees(e.target.value)}
                      placeholder="MBBS, MD"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    className="text-xs font-semibold text-slate-400"
                    htmlFor="university"
                  >
                    University
                  </label>

                  <select
                    id="university"
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  >

                    <option value="">
                      Select University
                    </option>

                    {university.map((university) => (
                      <option
                        key={university}
                        value={university}
                        className="bg-slate-950 text-slate-200"
                      >
                        {university}
                      </option>
                    ))}


                  </select>
                  {selectedUniversity === "other" && (
                  <div className="space-y-1">
                    <label
                      className="text-xs font-semibold text-slate-400"
                      htmlFor="otherUniversity"
                    >
                      Other University
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        value={workingHospital}
                        onChange={(e) => setWorkingHospital(e.target.value)}
                        placeholder="Enter your university"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label
                    className="text-xs font-semibold text-slate-400"
                    htmlFor="workingHospital"
                  >
                    Working Hospital
                  </label>
                  <div className="relative">
                    <Stethoscope className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      id="workingHospital"
                      type="text"
                      value={workingHospital}
                      onChange={(e) => setWorkingHospital(e.target.value)}
                      placeholder="General Hospital"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                    />
                  </div>
                </div>
                </div>
              </>
            )}

            
              
          
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold hover:from-teal-400 hover:to-emerald-400 transition-all shadow-[0_0_15px_rgba(20,184,166,0.2)] disabled:opacity-50 disabled:scale-100 hover:scale-[1.02] flex items-center justify-center space-x-2 cursor-pointer mt-6"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 pt-6 border-t border-slate-800/60 text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-teal-400 hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
