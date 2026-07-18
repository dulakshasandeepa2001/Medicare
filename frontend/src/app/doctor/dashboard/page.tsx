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
  ShieldAlert,
  Activity,
  CheckCircle,
  FileSpreadsheet
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

export default function DoctorDashboard() {
  const router = useRouter();
  const [userSession, setUserSession] = useState<{ username: string; role: string; doctorID: string } | null>(null);
  const [doctorInfo, setDoctorInfo] = useState<Doctor | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState("");
  
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
      const localToday = new Date(today.getTime() - (offset*60*1000));
      setSelectedDate(localToday.toISOString().split("T")[0]);
    } catch (e) {
      localStorage.removeItem("meditrack_user");
      router.push("/login");
    }
  }, [router]);

  // Fetch Doctor detailed profile from the list of doctors
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
          // Fallback matching doctors if no exact matches found (e.g. Doctor is not registered in base table)
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
    
    setTasksLoading(true);
    setError("");
    try {
      const data = await apiRequest("/get-tasks/", {
        method: "POST",
        body: JSON.stringify({
          doctor_id: userSession.doctorID,
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
    fetchDoctorTasks();
  }, [userSession, selectedDate]);

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

    try {
      await apiRequest("/create-task/", {
        method: "POST",
        body: JSON.stringify({
          doctor_id: userSession?.doctorID || "DOC-DEV",
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
      // Refresh tasks
      fetchDoctorTasks();
    } catch (err: any) {
      alert(err.message || "Failed to delete task.");
    }
  };

  // Helper styles for Priority badges
  const getPriorityStyle = (p: string) => {
    switch (p.toLowerCase()) {
      case "urgent":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "high":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "medium":
        return "bg-teal-500/10 text-teal-400 border border-teal-500/20";
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Header Dashboard Nav */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-teal-500/10 p-2 rounded-xl border border-teal-500/20">
              <Sparkles className="w-5 h-5 text-teal-400" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
              MediTrack - Doctor Portal
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Logged in as <strong className="text-white">{userSession?.username}</strong>
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

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Doctor Info Card */}
        {doctorInfo && (
          <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-teal-500 to-emerald-500 p-4 rounded-2xl text-slate-950">
                <User className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-extrabold text-white">{doctorInfo.doctors_name}</h1>
                  <span className="text-[10px] bg-teal-950 text-teal-400 font-bold px-2 py-0.5 rounded border border-teal-500/10">
                    ID: {doctorInfo.doctor_id}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5 text-slate-500" />
                    <span>{doctorInfo.degrees}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    <span>{doctorInfo.working_hospital}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex items-center space-x-6 w-full md:w-auto">
              <div className="text-center px-4">
                <div className="text-lg font-bold text-teal-400">{tasks.length}</div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Tasks Today</div>
              </div>
              <div className="h-8 w-px bg-slate-800"></div>
              <div className="text-center px-4">
                <div className="text-lg font-bold text-indigo-400">98.5%</div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Attendance</div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Date & Scheduler Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-lg">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <Calendar className="w-4.5 h-4.5 text-teal-400" />
                <span>Select Calendar Date</span>
              </h2>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/10 transition-all font-semibold"
              />

              <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Guidelines</h3>
                <div className="flex items-start space-x-2.5 text-xs text-slate-400">
                  <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>Ensure consultation records match patient IDs accurately.</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-slate-400">
                  <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>Review drug allergy alerts during prescription setup.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Columns: Tasks List Manager */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-lg min-h-[400px] flex flex-col">
              
              {/* Toolbar */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-teal-400" />
                    <span>Doctor Schedule Queue</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Managing schedule details for {selectedDate}
                  </p>
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 text-xs font-bold rounded-xl hover:from-teal-400 hover:to-emerald-400 flex items-center space-x-1 shadow-[0_0_10px_rgba(20,184,166,0.15)] hover:scale-105 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>

              {/* Tasks List */}
              {tasksLoading ? (
                <div className="flex-grow flex flex-col justify-center items-center py-16 space-y-3">
                  <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-400">Fetching scheduled tasks...</p>
                </div>
              ) : error ? (
                <div className="flex-grow flex flex-col justify-center items-center py-16 text-center">
                  <ShieldAlert className="w-8 h-8 text-rose-500 mb-2" />
                  <p className="text-sm text-slate-400 font-medium">Failed to retrieve tasks</p>
                  <p className="text-xs text-slate-600 mt-1">{error}</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="flex-grow flex flex-col justify-center items-center py-16 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
                  <FileSpreadsheet className="w-10 h-10 text-slate-650 mb-3" />
                  <p className="text-sm text-slate-400 font-semibold">No tasks scheduled for this day</p>
                  <p className="text-xs text-slate-500 mt-1">Click "Add Task" above to program consultations, surgery or breaks</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div 
                      key={task.task_id} 
                      className="p-5 bg-slate-950 border border-slate-800/80 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-700/60 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2.5 flex-wrap gap-y-1.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${getPriorityStyle(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="text-[10px] bg-indigo-950/60 text-indigo-400 border border-indigo-500/10 px-2 py-0.5 rounded font-semibold uppercase">
                            {task.task_type}
                          </span>
                          <div className="text-xs text-slate-500 flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{task.start_time.slice(0,5)} - {task.end_time.slice(0,5)}</span>
                          </div>
                        </div>

                        <h3 className="font-extrabold text-white text-base">
                          {task.task_title}
                        </h3>
                        
                        {task.task_description && (
                          <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                            {task.task_description}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteTask(task.task_id)}
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/35 hover:bg-rose-500/5 text-slate-400 hover:text-rose-400 transition-all cursor-pointer self-end sm:self-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>

      </main>

      {/* Add Task Modal Wrapper */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <h2 className="text-lg font-bold text-white mb-4">Add Schedule Task</h2>
            
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
                  placeholder="e.g. Cardiological Consultation"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Task Type</label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Description (Optional)</label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Additional patient reference detail..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-all resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
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
      <footer className="bg-slate-900 border-t border-slate-850 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} MediTrack Portal.</span>
          <span>Doctor Management Operations Console.</span>
        </div>
      </footer>
    </div>
  );
}
