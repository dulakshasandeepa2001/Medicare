"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { 
  Heart, 
  Activity, 
  Search, 
  ShieldAlert, 
  Calendar, 
  Clock, 
  UserCheck, 
  MapPin, 
  Award, 
  Stethoscope, 
  ChevronRight,
  TrendingUp
} from "lucide-react";

interface Doctor {
  doctor_id: string;
  register_id: string;
  doctor_nicnumber: string;
  doctors_name: string;
  dob: string;
  degrees: string;
  university: string;
  working_hospital: string;
}

export default function Home() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  

  const filteredDoctors = doctors.filter((doc) =>
    doc.doctors_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.degrees.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.working_hospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/75 border-b border-slate-800/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-teal-500/10 p-2 rounded-xl border border-teal-500/20">
              <Stethoscope className="w-6 h-6 text-teal-400 animate-pulse" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
              MediTrack
            </span>
          </div>

          <nav className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 text-sm font-semibold hover:from-teal-400 hover:to-emerald-400 transition-all duration-200 shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:scale-105"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-full py-1.5 px-4 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping"></span>
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">AI-Powered Cloud Healthcare</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-6">
              Modern Doctor-Patient <br />
              <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                Management System
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              MediTrack connects doctors and patients seamlessly with digital treatment receipts, 
              real-time appointment queues, AI medicine suggestions, and outbreak analytics.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link 
                href="/register" 
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-semibold hover:from-teal-400 hover:to-emerald-400 transition-all duration-200 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Register as a Patient</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/login" 
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold hover:bg-slate-800 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Doctor Portal Login</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-10 border-y border-slate-900 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800/50 text-center flex flex-col items-center">
              <UserCheck className="w-8 h-8 text-teal-400 mb-3" />
              <div className="text-3xl font-extrabold text-white mb-1">99.8%</div>
              <div className="text-sm text-slate-400">Doctor Patient Outcome Rate</div>
            </div>
            <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800/50 text-center flex flex-col items-center">
              <Clock className="w-8 h-8 text-emerald-400 mb-3" />
              <div className="text-3xl font-extrabold text-white mb-1">&lt; 15 mins</div>
              <div className="text-sm text-slate-400">Average Appointment Wait Time</div>
            </div>
            <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800/50 text-center flex flex-col items-center">
              <Activity className="w-8 h-8 text-indigo-400 mb-3" />
              <div className="text-3xl font-extrabold text-white mb-1">Real-time</div>
              <div className="text-sm text-slate-400">Outbreak Disease Tracking</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Outbreak Alerts */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <ShieldAlert className="w-6 h-6 text-rose-500" />
              <h2 className="text-lg font-bold text-white">Public Health Alerts</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-rose-500/10 rounded-xl border border-rose-500/25">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 px-2 py-0.5 bg-rose-950 rounded-md">
                    High Alert
                  </span>
                  <span className="text-xs text-slate-400">Colombo District</span>
                </div>
                <h3 className="font-bold text-white text-sm mb-1">Influenza Outbreak</h3>
                <p className="text-xs text-slate-400 mb-3">Spike in pediatric cases with high fever and respiratory distress.</p>
                <div className="text-xs text-rose-300 font-semibold flex items-center space-x-1">
                  <Heart className="w-3 h-3 text-rose-400" />
                  <span>Drink clean water & wear masks in public</span>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 px-2 py-0.5 bg-amber-950 rounded-md">
                    Moderate
                  </span>
                  <span className="text-xs text-slate-400">Galle District</span>
                </div>
                <h3 className="font-bold text-white text-sm mb-1">Dengue Virus Alert</h3>
                <p className="text-xs text-slate-400 mb-3">Increased mosquito counts detected post recent rainfall season.</p>
                <div className="text-xs text-amber-300 font-semibold">
                  <span>Eliminate stagnant water around houses</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <div className="text-xs text-slate-500 flex items-center justify-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
                  <span>Outbreak alerts auto-generated via AI analyzer</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Find Nearby Doctors */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Stethoscope className="w-5.5 h-5.5 text-teal-400" />
                  <span>Find Available Doctors</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Search and view active medical practitioner directories</p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Name, hospital or degree..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/80 focus:ring-1 focus:ring-teal-500/20 transition-all"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400">Loading doctor profiles...</p>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="text-center py-16 bg-slate-950/40 rounded-xl border border-slate-800/40">
                <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">No doctors found matching "{searchQuery}"</p>
                <p className="text-xs text-slate-600 mt-1">Try searching by hospital, name or cardiology/pediatrics specialty</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDoctors.map((doc) => (
                  <div 
                    key={doc.doctor_id} 
                    className="p-5 bg-slate-950/80 hover:bg-slate-900 border border-slate-800/80 hover:border-teal-500/30 rounded-xl transition-all duration-300 group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-white text-base group-hover:text-teal-400 transition-colors">
                          {doc.doctors_name}
                        </h3>
                        <p className="text-xs text-teal-400 font-medium">{doc.degrees}</p>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 px-2 py-0.5 bg-indigo-950 rounded-md">
                        {doc.doctor_id}
                      </span>
                    </div>

                    <div className="space-y-2 mt-4 pt-3 border-t border-slate-900 text-xs text-slate-400">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{doc.working_hospital}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-3.5 h-3.5 text-slate-500" />
                        <span>Graduated from {doc.university}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 flex justify-between items-center text-xs">
                      <Link 
                        href="/login" 
                        className="text-teal-400 hover:text-teal-300 font-semibold flex items-center space-x-1 transition-colors group/link"
                      >
                        <span>Check Availability</span>
                        <ChevronRight className="w-3 h-3 transform group-hover/link:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} MediTrack. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Doctor Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
