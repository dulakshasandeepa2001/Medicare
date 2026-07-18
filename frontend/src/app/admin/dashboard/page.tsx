"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  Award,
  GraduationCap,
  ArrowLeft,
  AlertCircle,
  LogOut,
} from "lucide-react";

interface ApiError {
  message: string;
  response?: { status: number };
}

interface PendingDoctor  {
  id: number;
  username: string;
  email: string;
  phone: string;
  NIC_number: string;
  doctorID: string;
  degrees: string;
  university: string;
  working_hospital: string;
  birthday: string;
  created_at: string;
  message: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [pendingDoctors, setPendingDoctors] = useState<PendingDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // ── Load pending doctors on page load ──
  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  async function fetchPendingDoctors() {
  try {
    setLoading(true);
    const data = await apiRequest("/pending-doctors/");
    setPendingDoctors(data.pending_doctors || []);
  } catch (err: unknown) {
    const error = err as ApiError;
    setError(error.message || "Failed to load pending approvals");
  } finally {
    setLoading(false);
  }
}

  // ── Approve a doctor ──
  async function handleApprove(id: number) {
    try {
      setActionLoading(id);
      setError("");
      setMessage("");
      await apiRequest(`/approve-doctor/${id}/`, { method: "POST" });
      setPendingDoctors((prev) => prev.filter((d) => d.id !== id));
      setMessage("Doctor approved successfully! They can now login.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.message || "Approval failed");
    } finally {
      setActionLoading(null);
    }
  }

  // ── Reject a doctor ──
async function handleReject(id: number) {
  try {
    setActionLoading(id);
    setError("");
    setMessage("");
    await apiRequest(`/reject-doctor/${id}/`, { method: "POST" });
    setPendingDoctors((prev) => prev.filter((d) => d.id !== id));
    setMessage("Doctor rejected.");
    setTimeout(() => setMessage(""), 3000);
  } catch (err: unknown) {
    const error = err as ApiError;
    setError(error.message || "Rejection failed");
  } finally {
    setActionLoading(null);
  }
}

  // ── Logout ──
  function handleLogout() {
    localStorage.removeItem("meditrack_user");
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Background Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* ── HEADER ── */}
      <header className="relative z-10 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="inline-flex bg-teal-500/10 p-2 rounded-xl border border-teal-500/20">
              <ShieldAlert className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
              <p className="text-xs text-slate-400">Doctor Approval Management</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white hover:border-slate-600 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{pendingDoctors.length}</p>
                <p className="text-xs text-slate-400">Pending Approvals</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">—</p>
                <p className="text-xs text-slate-400">Approved Today</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center space-x-3">
              <div className="bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                <XCircle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">—</p>
                <p className="text-xs text-slate-400">Rejected Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-xs text-emerald-400 flex items-start space-x-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs text-rose-400 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Pending Doctors Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Pending Doctor Registrations</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review and approve or reject doctor signup requests
              </p>
            </div>
            <button
              onClick={fetchPendingDoctors}
              className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : pendingDoctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <CheckCircle className="w-12 h-12 text-slate-700 mb-4" />
              <p className="text-sm font-medium">No pending approvals</p>
              <p className="text-xs mt-1">All doctor registrations have been processed</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Doctor Info
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Qualifications
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Hospital
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {pendingDoctors.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Doctor Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-teal-500/10 p-2 rounded-xl border border-teal-500/20">
                            <User className="w-4 h-4 text-teal-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {doc.username}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: {doc.doctorID} • NIC: {doc.NIC_number}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                            <Mail className="w-3 h-3" />
                            <span>{doc.email}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                            <Phone className="w-3 h-3" />
                            <span>{doc.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                            <Calendar className="w-3 h-3" />
                            <span>{doc.birthday}</span>
                          </div>
                        </div>
                      </td>

                      {/* Qualifications */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                            <GraduationCap className="w-3 h-3" />
                            <span>{doc.degrees || "N/A"}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                            <Award className="w-3 h-3" />
                            <span>{doc.university || "N/A"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Hospital */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                          <Building className="w-3 h-3" />
                          <span>{doc.working_hospital || "N/A"}</span>
                        </div>
                      </td>

                      {/* Submitted Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(doc.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleApprove(doc.id)}
                            disabled={actionLoading === doc.id}
                            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all disabled:opacity-50"
                          >
                            {actionLoading === doc.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <CheckCircle className="w-3.5 h-3.5" />
                            )}
                            <span>Approve</span>
                          </button>

                          <button
                            onClick={() => handleReject(doc.id)}
                            disabled={actionLoading === doc.id}
                            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 transition-all disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}