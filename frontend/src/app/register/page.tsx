"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { Stethoscope, Lock, User, Mail, Phone, Calendar, Landmark, AlertCircle, ArrowLeft } from "lucide-react";

interface Doctor {
  doctor_id: string;
  doctors_name: string;
  working_hospital: string;
}

export default function Register() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [role, setRole] = useState("patient");
  const [nicNumber, setNicNumber] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const data = await apiRequest("/get-doctor/");
        setDoctors(data.doctors || []);
        if (data.doctors && data.doctors.length > 0) {
          setSelectedDoctorId(data.doctors[0].doctor_id);
        }
      } catch (err) {
        console.error("Failed to load doctor database list", err);
      }
    }
    fetchDoctors();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!username || !email || !password || !phone || !birthday || !role || !nicNumber || !selectedDoctorId) {
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
          doctorID: selectedDoctorId,
          created_at: now,
          updated_at: now
        }),
      });

      setSuccess("Account registered successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please check user details.");
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

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400" htmlFor="doctor_id">
                {role === "doctor" ? "Link to Doctor ID Record" : "Assign Primary Doctor"}
              </label>
              <select
                id="doctor_id"
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
              >
                {doctors.length === 0 ? (
                  <option value="">No registry doctor found</option>
                ) : (
                  doctors.map((d) => (
                    <option key={d.doctor_id} value={d.doctor_id}>
                      {d.doctors_name} ({d.doctor_id})
                    </option>
                  ))
                )}
              </select>
            </div>
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
