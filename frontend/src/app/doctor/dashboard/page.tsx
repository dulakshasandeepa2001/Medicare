"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { 
  Calendar, 
  Clock, 
  Trash2, 
  Plus, 
  LogOut, 
  User, 
  Building, 
  Award, 
  Sparkles, 
  Activity,
  Mic,
  MicOff,
  Pill,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  FileText,
  HeartPulse,
  Share2,
  ShieldAlert,
  Send,
  Check,
  ChevronRight,
  ClipboardList
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

interface PatientConsultation {
  id: string;
  name: string;
  patientId: string;
  age: number;
  gender: string;
  lastVisit: string;
  allergies: string[];
  bloodGroup: string;
  transcript: string;
  diagnoses: {
    title: string;
    match: number;
    description: string;
    tags: string[];
    matchType: "high" | "medium" | "low";
  }[];
  prescriptions: {
    name: string;
    date: string;
    dosage: string;
    indication: string;
  }[];
}

const DEFAULT_PATIENT: PatientConsultation = {
  id: "p-1",
  name: "Kasun Fernando",
  patientId: "#MED-8842",
  age: 42,
  gender: "Male",
  lastVisit: "12 Jan 2026",
  allergies: ["Penicillin", "NSAIDs"],
  bloodGroup: "O+",
  transcript: "...patient complains of persistent dry cough for 4 days, mild chest tightness, and fever spikes in the evening. Mentions past wheezing episodes during rainy seasons and breathlessness on exertion...",
  diagnoses: [
    {
      title: "Acute Bronchitis",
      match: 78,
      description: "Symptoms aligned: persistent dry cough, chest discomfort, and evening fever spikes.",
      tags: ["History: Salbutamol Inhaler (2025)", "Recommends: Chest X-ray", "Viral / Bacterial"],
      matchType: "high"
    },
    {
      title: "Allergic Asthma Exacerbation",
      match: 62,
      description: "Correlates with past wheezing history and current dry cough trigger during seasonal change.",
      tags: ["History: Montelukast 10mg", "Recommends: Peak Flow Test"],
      matchType: "medium"
    },
    {
      title: "Upper Respiratory Tract Infection (URTI)",
      match: 45,
      description: "Possible viral etiology based on short duration (4 days) and mild temperature elevation.",
      tags: ["Symptomatic Care"],
      matchType: "low"
    }
  ],
  prescriptions: [
    {
      name: "Amoxicillin 500mg",
      date: "Jan 2026",
      dosage: "1 capsule tds × 5 days",
      indication: "Sinusitis"
    },
    {
      name: "Salbutamol 100mcg Inhaler",
      date: "Aug 2025",
      dosage: "2 puffs PRN",
      indication: "Bronchospasm"
    },
    {
      name: "Paracetamol 500mg",
      date: "Aug 2025",
      dosage: "2 tabs 6hrly PRN",
      indication: "Viral Fever"
    }
  ]
};

export default function DoctorDashboard() {
  const router = useRouter();
  const [userSession, setUserSession] = useState<{ username: string; role: string; doctorID: string } | null>(null);
  const [doctorInfo, setDoctorInfo] = useState<Doctor | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState("");
  
  // AI Voice Consultation State
  const [isListening, setIsListening] = useState(true);
  const [currentPatient, setCurrentPatient] = useState<PatientConsultation>(DEFAULT_PATIENT);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>("Acute Bronchitis");
  const [confirmedPrescriptions, setConfirmedPrescriptions] = useState<string[]>([]);
  
  // Create Task Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskType, setTaskType] = useState("consultation");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [priority, setPriority] = useState("medium");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Initialize page, fetch session details
  useEffect(() => {
    const storedUser = localStorage.getItem("meditrack_user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.role !== "doctor") {
        router.push("/patient/dashboard");
        return;
      }
      setUserSession(parsed);
      
      // Set default date to today in local timezone (YYYY-MM-DD)
      const today = new Date();
      const offset = today.getTimezoneOffset();
      const localToday = new Date(today.getTime() - (offset * 60 * 1000));
      setSelectedDate(localToday.toISOString().split("T")[0]);
    } catch (e) {
      localStorage.removeItem("meditrack_user");
      router.push("/login");
    }
  }, [router]);

  // Fetch Doctor detailed profile
  useEffect(() => {
    if (!userSession) return;
    
    async function loadDoctorProfile() {
      try {
        const data = await apiRequest("/get-doctor/");
        const matchedDoctor = data.doctors?.find(
          (d: Doctor) => d.doctor_id === userSession?.doctorID
        );
        if (matchedDoctor) {
          setDoctorInfo(matchedDoctor);
        } else {
          setDoctorInfo({
            doctor_id: userSession?.doctorID || "DOC-DEV",
            doctors_name: userSession?.username || "Doctor",
            working_hospital: "MediTrack General Clinic",
            degrees: "MBBS, MD",
            university: "Colombo Medical Faculty",
            register_id: "REG-DEFAULT",
            dob: "1980-01-01",
            doctor_nicnumber: "198000000000"
          });
        }
      } catch (err) {
        console.error("Failed to load doctor profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctorProfile();
  }, [userSession]);

  // Fetch tasks when doctor profile is loaded or date changes
  const fetchDoctorTasks = async () => {
    if (!userSession || !selectedDate) return;

    const docId = userSession.doctorID || doctorInfo?.doctor_id || userSession.username || "DOC-DEV";
    if (!docId) return;
    
    setTasksLoading(true);
    setError("");
    try {
      const data = await apiRequest("/get-tasks/", {
        method: "POST",
        body: JSON.stringify({
          doctor_id: docId,
          task_date: selectedDate
        })
      });
      setTasks(data.tasks || []);
    } catch (err: any) {
      setError(err.message || "Failed to load tasks list");
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    if (userSession && selectedDate) {
      fetchDoctorTasks();
    }
  }, [userSession, doctorInfo, selectedDate]);

  const handleLogout = () => {
    localStorage.removeItem("meditrack_user");
    router.push("/");
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    if (!taskTitle || !startTime || !endTime) {
      setFormError("Task title, start time and end time are required.");
      setFormLoading(false);
      return;
    }

    const docId = userSession?.doctorID || doctorInfo?.doctor_id || userSession?.username || "DOC-DEV";

    try {
      await apiRequest("/create-task/", {
        method: "POST",
        body: JSON.stringify({
          doctor_id: docId,
          task_date: selectedDate,
          task_title: taskTitle,
          task_description: taskDescription,
          task_type: taskType,
          start_time: startTime,
          end_time: endTime,
          priority: priority
        })
      });

      // Clear Form & Close Modal
      setTaskTitle("");
      setTaskDescription("");
      setTaskType("consultation");
      setStartTime("09:00");
      setEndTime("10:00");
      setPriority("medium");
      setShowAddModal(false);
      
      // Refresh Tasks
      fetchDoctorTasks();
    } catch (err: any) {
      setFormError(err.message || "Failed to save schedule task.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this scheduled task?")) return;
    
    try {
      await apiRequest(`/delete-task/${taskId}/`, {
        method: "DELETE"
      });
      fetchDoctorTasks();
    } catch (err: any) {
      alert(err.message || "Failed to delete task.");
    }
  };

  const getPriorityStyle = (p: string) => {
    switch (p.toLowerCase()) {
      case "urgent":
        return "bg-rose-500/15 text-rose-400 border border-rose-500/30";
      case "high":
        return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
      case "medium":
        return "bg-teal-500/15 text-teal-400 border border-teal-500/30";
      default:
        return "bg-slate-800 text-slate-400 border border-slate-700/50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400">Loading doctor session portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-teal-500 to-indigo-500 text-slate-950 p-2.5 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.25)]">
            <Stethoscope className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-teal-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                MediTrack
              </h1>
              <span className="text-[10px] bg-teal-500/10 text-teal-300 font-bold px-2 py-0.5 rounded-full border border-teal-500/20 uppercase tracking-wide">
                AI Consultation
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Doctor Diagnostic & Clinical Operations Portal</p>
          </div>
        </div>
        
        {/* Live Consultation Badge & Doctor Profile */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsListening(!isListening)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              isListening 
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]" 
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            {isListening ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live AI Listening Active</span>
              </>
            ) : (
              <>
                <MicOff className="w-3.5 h-3.5 text-slate-400" />
                <span>AI Listening Paused</span>
              </>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-3 border-l border-slate-800 pl-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
              DR
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">{doctorInfo?.doctors_name || userSession?.username || "Dr. Perera"}</div>
              <div className="text-[10px] text-slate-500">{doctorInfo?.working_hospital || "MediTrack Clinic"}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Layout: 2 Columns (Main AI Clinical on Left, Small Schedule on Right) */}
      <main className="flex-grow max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* ========================================================================= */}
        {/* LEFT & CENTER COLUMN (MAIN CLINICAL WORKSPACE - 8 / 12 Cols)             */}
        {/* ========================================================================= */}
        <div className="xl:col-span-8 space-y-6">

          {/* 1. Patient Summary & Real-Time Consultation Card */}
          <section className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Patient Details Header */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700/60 flex items-center justify-center text-teal-400 shadow-md">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white tracking-tight">{currentPatient.name}</h2>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-300 font-semibold px-2 py-0.5 rounded-md border border-indigo-500/20">
                      {currentPatient.patientId}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-400 font-medium mt-1">
                    <span><strong>Age:</strong> {currentPatient.age} Yrs</span>
                    <span className="text-slate-600">•</span>
                    <span><strong>Gender:</strong> {currentPatient.gender}</span>
                    <span className="text-slate-600">•</span>
                    <span><strong>Last Visit:</strong> {currentPatient.lastVisit}</span>
                  </div>
                </div>
              </div>

              {/* Patient Badges (Allergies & Blood Group) */}
              <div className="flex flex-wrap items-center gap-2">
                {currentPatient.allergies.map((allergy, i) => (
                  <span key={i} className="text-xs bg-rose-500/10 text-rose-300 border border-rose-500/30 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    Allergy: {allergy}
                  </span>
                ))}
                <span className="text-xs bg-slate-800/90 text-teal-300 border border-slate-700 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-teal-400" />
                  Blood: {currentPatient.bloodGroup}
                </span>
              </div>
            </div>

            {/* Real-Time Voice Transcription Area */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  <Mic className="w-3.5 h-3.5 text-rose-400" />
                  Real-time Consultation Voice Transcript
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    Listening & Analyzing Symptoms...
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-300 italic leading-relaxed relative group">
                <p className="font-serif">
                  "{currentPatient.transcript}"
                </p>
                <div className="mt-2 pt-2 border-t border-slate-900 flex justify-between items-center text-[11px] text-slate-500 not-italic">
                  <span>AI Semantic Parsing active • 3 key clinical markers identified</span>
                  <span className="text-teal-400/80 font-mono">Confidence: 94.2%</span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Diagnostic Possibilities & Drug History Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Inner: AI Diagnostic Suggestions (7 / 12 Cols) */}
            <section className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-teal-400" />
                    AI Possible Diagnoses
                  </h3>
                  <p className="text-xs text-slate-400">Matched from live transcript + past medical history</p>
                </div>
                <span className="text-xs bg-teal-500/10 text-teal-300 border border-teal-500/30 font-semibold px-2.5 py-0.5 rounded-full">
                  {currentPatient.diagnoses.length} Matches
                </span>
              </div>

              {/* Diagnoses List */}
              <div className="space-y-3">
                {currentPatient.diagnoses.map((diag, index) => {
                  const isSelected = selectedDiagnosis === diag.title;
                  return (
                    <div 
                      key={index}
                      onClick={() => setSelectedDiagnosis(diag.title)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        diag.matchType === "high"
                          ? isSelected
                            ? "bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                            : "bg-emerald-950/20 border-emerald-500/30 hover:bg-emerald-950/30"
                          : isSelected
                            ? "bg-slate-800/80 border-indigo-500/60 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                            : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{diag.title}</h4>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          diag.match >= 70 
                            ? "bg-emerald-500 text-slate-950" 
                            : diag.match >= 50 
                              ? "bg-indigo-500 text-white" 
                              : "bg-amber-500 text-slate-950"
                        }`}>
                          {diag.match}% Match
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mb-2.5 leading-relaxed">
                        {diag.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 text-[11px]">
                        {diag.tags.map((tag, tIdx) => (
                          <span 
                            key={tIdx} 
                            className={`px-2 py-0.5 rounded-md font-medium border ${
                              diag.matchType === "high"
                                ? "bg-emerald-900/30 border-emerald-500/20 text-emerald-300"
                                : "bg-slate-900 border-slate-700/60 text-slate-300"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Diagnostic Action Bar */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  Selected: <strong className="text-teal-300">{selectedDiagnosis || "None"}</strong>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => alert(`Confirmed diagnosis for ${currentPatient.name}: ${selectedDiagnosis}`)}
                    className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:from-teal-400 hover:to-emerald-400 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Diagnosis</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Right Inner: Patient Prescription History & Clinical Notes (5 / 12 Cols) */}
            <section className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Pill className="w-4.5 h-4.5 text-purple-400" />
                      Past Prescriptions
                    </h3>
                    <p className="text-xs text-slate-400">Previous treatments & dosages</p>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">Records (3)</span>
                </div>

                {/* Prescription List */}
                <ul className="space-y-2.5 mt-3 text-xs">
                  {currentPatient.prescriptions.map((drug, idx) => (
                    <li 
                      key={idx} 
                      className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 hover:border-purple-500/30 transition-all"
                    >
                      <div className="flex justify-between font-bold text-slate-200">
                        <span className="text-purple-300">{drug.name}</span>
                        <span className="text-slate-500 font-normal text-[11px]">{drug.date}</span>
                      </div>
                      <p className="text-slate-400 mt-1 text-[11px]">
                        {drug.dosage} • <span className="text-slate-300 font-medium">{drug.indication}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Clinical Notes Area */}
              <div className="pt-4 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  Quick Consultation Notes
                </label>
                <textarea
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Type prescription notes, follow-up tests..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={() => {
                      if (!doctorNotes.trim()) return;
                      alert("Notes saved for " + currentPatient.name);
                      setDoctorNotes("");
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Send className="w-3 h-3 text-teal-400" />
                    <span>Save Note</span>
                  </button>
                </div>
              </div>
            </section>

          </div>

        </div>


        {/* ========================================================================= */}
        {/* RIGHT SIDEBAR (COMPACT TASK SCHEDULE & CALENDAR WIDGET - 4 / 12 Cols)     */}
        {/* ========================================================================= */}
        <div className="xl:col-span-4 space-y-6">

          {/* Schedule & Calendar Box */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
            
            {/* Header & Date Selector */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span>Doctor Schedule</span>
                </h3>
                <p className="text-[11px] text-slate-400">Date: {selectedDate}</p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 text-xs font-bold rounded-xl hover:from-teal-400 hover:to-emerald-400 flex items-center gap-1 shadow-[0_0_10px_rgba(20,184,166,0.15)] hover:scale-105 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Task</span>
              </button>
            </div>

            {/* Date Picker Input */}
            <div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-semibold transition-all cursor-pointer"
              />
            </div>

            {/* Tasks Summary Stats Bar */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="text-base font-extrabold text-teal-400">{tasks.length}</div>
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Today's Tasks</div>
              </div>
              <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="text-base font-extrabold text-indigo-400">98%</div>
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Queue Efficiency</div>
              </div>
            </div>

            {/* Tasks List Queue (Compact) */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-400" />
                  Scheduled Timeline
                </span>
                <span className="text-[11px] text-slate-500">{tasks.length} Item(s)</span>
              </div>

              {tasksLoading ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-2">
                  <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-400">Loading schedule...</p>
                </div>
              ) : error ? (
                <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-center text-xs text-rose-400">
                  {error}
                </div>
              ) : tasks.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/30 p-4">
                  <ClipboardList className="w-7 h-7 text-slate-600 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-400 font-medium">No tasks scheduled</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">Click "Add Task" to program schedule</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {tasks.map((task) => (
                    <div
                      key={task.task_id}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all flex items-start justify-between gap-2"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${getPriorityStyle(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="text-[9px] bg-indigo-950/60 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.2 rounded font-semibold uppercase">
                            {task.task_type}
                          </span>
                        </div>

                        <h4 className="font-bold text-white text-xs leading-tight">
                          {task.task_title}
                        </h4>

                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{task.start_time.slice(0, 5)} - {task.end_time.slice(0, 5)}</span>
                        </div>

                        {task.task_description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            {task.task_description}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteTask(task.task_id)}
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/30 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-all cursor-pointer shrink-0"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Practice Guidelines */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Clinical Alerts</h4>
              <div className="flex items-start gap-2 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>Verify patient penicilin hypersensitivity prior to antibiotic dispatch.</span>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Add Task Modal Wrapper */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Add Schedule Task</span>
            </h2>
            
            {formError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-xs text-rose-400">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Task Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Follow-up: Kasun Fernando"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Task Type</label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all cursor-pointer"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="surgery">Surgery</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="administrative">Administrative</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Description (Optional)</label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Additional patient reference detail..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-800 bg-slate-950 hover:bg-slate-900 text-xs font-bold rounded-xl text-slate-300 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-[0_0_10px_rgba(20,184,166,0.15)] flex items-center space-x-1.5 cursor-pointer"
                >
                  {formLoading ? (
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span>Add to Schedule</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900/60 border-t border-slate-800 py-4 mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} MediTrack Clinical AI Assistant.</span>
          <span>Doctor Consultation & Task Schedule Console.</span>
        </div>
      </footer>
    </div>
  );
}
