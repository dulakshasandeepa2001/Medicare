"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Award, 
  Stethoscope, 
  LogOut, 
  User, 
  ShieldAlert, 
  Info,
  CalendarCheck,
  Building2
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

interface Task {
  task_id: number;
  doctor_id: string;
  task_date: string;
  task_title: string;
  task_description: string;
  task_type: string;
  start_time: string;
  end_time: string;
  priority: string;
  is_completed: boolean;
}

export default function PatientDashboard() {
  const router = useRouter();
  const [userSession, setUserSession] = useState<{ username: string; role: string; doctorID: string } | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Availability Checker State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [doctorTasks, setDoctorTasks] = useState<Task[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("meditrack_user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    
    try {
      const parsed = JSON.parse(storedUser);
      setUserSession(parsed);
      
      // Set default date to today for availability check
      const today = new Date();
      const offset = today.getTimezoneOffset();
      const localToday = new Date(today.getTime() - (offset*60*1000));
      setAvailabilityDate(localToday.toISOString().split("T")[0]);
    } catch (e) {
      localStorage.removeItem("meditrack_user");
      router.push("/login");
    }
  }, [router]);

  // Load all doctors
  useEffect(() => {
    async function loadDoctors() {
      try {
        const data = await apiRequest("/get-doctor/");
        setDoctors(data.doctors || []);
      } catch (err) {
        console.error("Failed to load doctor registry:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, []);

  // Fetch doctor's tasks when selected doctor or date changes
  const checkDoctorAvailability = async () => {
    if (!selectedDoctor || !availabilityDate) return;

    setCheckingAvailability(true);
    setAvailabilityError("");
    try {
      const data = await apiRequest("/get-tasks/", {
        method: "POST",
        body: JSON.stringify({
          doctor_id: selectedDoctor.doctor_id,
          task_date: availabilityDate
        })
      });
      setDoctorTasks(data.tasks || []);
    } catch (err: any) {
      setAvailabilityError(err.message || "Could not retrieve doctor's schedule.");
      setDoctorTasks([]);
    } finally {
      setCheckingAvailability(false);
    }
  };

  useEffect(() => {
    checkDoctorAvailability();
  }, [selectedDoctor, availabilityDate]);

  const handleLogout = () => {
    localStorage.removeItem("meditrack_user");
    router.push("/");
  };

  const filteredDoctors = doctors.filter((doc) =>
    doc.doctors_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.degrees.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.working_hospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400">Loading patient portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Header Dashboard Nav */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-teal-500/10 p-2 rounded-xl border border-teal-500/20">
              <Stethoscope className="w-5.5 h-5.5 text-teal-400" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
              MediTrack - Patient Portal
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Welcome, <strong className="text-white">{userSession?.username}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 text-xs font-semibold text-rose-400 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Find & Check Doctor Schedule */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Doctor Finder Search Card */}
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Search className="w-4.5 h-4.5 text-teal-400" />
                  <span>Search Medical Consultants</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Find doctors registered in our clinical network</p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Name, degree, or hospital..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-60 pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            {filteredDoctors.length === 0 ? (
              <div className="text-center py-12 bg-slate-950/40 rounded-2xl border border-slate-800/40">
                <p className="text-xs text-slate-400">No doctors match your query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.doctor_id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-250 flex flex-col justify-between ${
                      selectedDoctor?.doctor_id === doc.doctor_id
                        ? "bg-slate-950 border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                        : "bg-slate-950/50 border-slate-800 hover:border-slate-700/60"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-white text-sm">{doc.doctors_name}</h3>
                        <span className="text-[9px] bg-slate-900 border border-slate-800 text-teal-400 font-bold px-1.5 py-0.5 rounded">
                          {doc.doctor_id}
                        </span>
                      </div>
                      <p className="text-xs text-teal-400 font-semibold">{doc.degrees}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-900/60 space-y-1.5 text-xs text-slate-400">
                      <div className="flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>{doc.working_hospital}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Award className="w-3.5 h-3.5 text-slate-500" />
                        <span>{doc.university}</span>
                      </div>
                    </div>

                    <button
                      className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedDoctor?.doctor_id === doc.doctor_id
                          ? "bg-teal-500 text-slate-950"
                          : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      Check Availability Schedule
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Schedule availability & Outbreaks */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Availability Card Panel */}
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl flex flex-col">
            <h2 className="text-sm font-bold text-slate-350 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <CalendarCheck className="w-4.5 h-4.5 text-teal-400" />
              <span>Availability Checker</span>
            </h2>

            {selectedDoctor ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <div className="text-xs font-bold text-slate-500 uppercase">Consultant Selected</div>
                  <div className="font-extrabold text-white text-base mt-1">{selectedDoctor.doctors_name}</div>
                  <div className="text-xs text-teal-400 mt-0.5">{selectedDoctor.working_hospital}</div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Check Date</label>
                  <input
                    type="date"
                    value={availabilityDate}
                    onChange={(e) => setAvailabilityDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all font-semibold"
                  />
                </div>

                {/* Queue status */}
                <div className="pt-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Doctor Schedule / Engaged Timings</div>
                  
                  {checkingAvailability ? (
                    <div className="py-6 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
                      <div className="w-4.5 h-4.5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Checking queue...</span>
                    </div>
                  ) : availabilityError ? (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
                      {availabilityError}
                    </div>
                  ) : doctorTasks.length === 0 ? (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center space-x-2">
                      <Info className="w-4 h-4 shrink-0" />
                      <span>Doctor is fully available on this date. No busy times scheduled.</span>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {doctorTasks.map((t) => (
                        <div key={t.task_id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                          <div>
                            <div className="font-semibold text-white">{t.task_title}</div>
                            <div className="text-[10px] text-slate-400 capitalize mt-0.5">{t.task_type}</div>
                          </div>
                          <div className="text-slate-400 font-mono text-[10px] flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>{t.start_time.slice(0,5)} - {t.end_time.slice(0,5)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center bg-slate-950/40 rounded-2xl border border-slate-800/40">
                <Info className="w-6 h-6 text-slate-650 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">Select a doctor from the registry list to verify their availability calendar.</p>
              </div>
            )}
          </div>

          {/* Alert Cards */}
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
            <h2 className="text-sm font-bold text-slate-350 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <ShieldAlert className="w-4.5 h-4.5 text-rose-500" />
              <span>Health Advisory Alerts</span>
            </h2>

            <div className="space-y-3.5">
              <div className="p-3.5 bg-rose-500/10 rounded-xl border border-rose-500/20 text-xs">
                <div className="font-bold text-white mb-1">Colombo Influenza Spike</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">High density regions showing flu reports. Avoid crowds where applicable.</p>
              </div>
              <div className="p-3.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs">
                <div className="font-bold text-white mb-1">Dengue Prevention Notice</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">Check water stagnation zones near residence compounds.</p>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-850 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} MediTrack Portal.</span>
          <span>Patient Portal Account Console.</span>
        </div>
      </footer>
    </div>
  );
}
