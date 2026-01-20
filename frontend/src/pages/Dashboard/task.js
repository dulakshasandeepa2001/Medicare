import React, { useState, useEffect } from "react";
import { X, Plus, Calendar, Clock, MapPin, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // ✅ FIXED: Correct path with '../..'

const baseUrl = process.env.REACT_APP_BASE_URL;

const Task = ({
  // ✅ REMOVED 'async'
  selectedDate,
  openCreateModal = false,
  onClose,
  onTaskCreated,
}) => {
  // ✅ Use the imported useAuth hook from AuthContext
  const { user, getDoctorId, isAuthenticated } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(openCreateModal);
  const [taskForm, setTaskForm] = useState({
    task_title: "",
    task_description: "",
    task_type: "other",
    start_time: "",
    end_time: "",
    location: "",
    priority: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Log user data
  useEffect(() => {
    if (user) {
      console.log("📋 Current User Data:", {
        username: user.username,
        role: user.role,
        doctorID: user.doctorID,
      });
    }
  }, [user]);

  // ✅ Fetch tasks when component mounts or selectedDate changes
  useEffect(() => {
    if (selectedDate && isAuthenticated) {
      fetchTasks();
    }
  }, [selectedDate, isAuthenticated]);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const doctorID = getDoctorId();

      if (!doctorID) {
        console.error("❌ Doctor ID not found");
        setError("Doctor ID not found. Please login again.");
        setLoading(false);
        return;
      }

      console.log("🔍 Fetching tasks for doctor:", doctorID);

      const formattedDate = selectedDate.toISOString().split("T")[0];
      const url = `${baseUrl}/get-tasks/`; // ✅ No query parameters

      console.log("📡 Request URL:", url);
      console.log("📦 Request Body:", {
        doctor_id: doctorID,
        task_date: formattedDate,
      });

      const response = await fetch(url, {
        method: "POST", // ✅ Changed from GET to POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // ✅ Send data in body as JSON
          doctor_id: doctorID,
          task_date: formattedDate,
        }),
      });

      console.log("📥 Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Tasks data:", data);

        if (data.success || data.tasks) {
          setTasks(data.tasks || []);
          console.log("✅ Tasks loaded:", (data.tasks || []).length);
        } else {
          setError(data.error || "Failed to fetch tasks");
        }
      } else {
        const errorData = await response.json();
        console.error("❌ Error response:", errorData);
        setError(
          errorData.error || `Failed to fetch tasks (${response.status})`,
        );
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const doctorId = getDoctorId();

      if (!doctorId) {
        alert("❌ Doctor ID not found. Please login again.");
        setLoading(false);
        return;
      }

      const taskData = {
        doctor_id: doctorId,
        task_date: selectedDate.toISOString().split("T")[0],
        ...taskForm,
      };

      console.log("📝 Creating task:", taskData);

      const response = await fetch(`${baseUrl}/create-task/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        alert("✅ Task created successfully!");
        setShowTaskModal(false);
        await fetchTasks();

        setTaskForm({
          task_title: "",
          task_description: "",
          task_type: "other",
          start_time: "",
          end_time: "",
          location: "",
          priority: "medium",
        });

        if (onTaskCreated) {
          onTaskCreated();
        }
      } else {
        const error = await response.json();
        alert(`❌ ${error.error || "Failed to create task"}`);
      }
    } catch (error) {
      console.error("❌ Failed to create task:", error);
      alert("❌ Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      console.log("🗑️ Deleting task:", taskId);

      const response = await fetch(`${baseUrl}/delete-task/${taskId}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("✅ Task deleted successfully!");
        await fetchTasks();
        if (onTaskCreated) {
          onTaskCreated();
        }
      } else {
        alert("❌ Failed to delete task");
      }
    } catch (error) {
      console.error("❌ Failed to delete task:", error);
      alert("❌ Failed to delete task");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-blue-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canCreateTask = (() => {
    if (!selectedDate) return false;

    const today = new Date();
    const selected = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
    );
    const baseToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const diffInDays = (selected - baseToday) / (1000 * 60 * 60 * 24);
    return diffInDays === 0 || diffInDays === 1;
  })();

  // ✅ REMOVED the DOCresponse fetch code (lines 227-244)
  // That code was outside the component return and causing errors!

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      {/* Task Creation Modal */}
      {showTaskModal && canCreateTask && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">
                Add New Task
              </h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={taskForm.task_title}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, task_title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Patient Consultation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={taskForm.task_description}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      task_description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Task details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Type
                </label>
                <select
                  value={taskForm.task_type}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, task_type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="consultation">Consultation</option>
                  <option value="surgery">Surgery</option>
                  <option value="meeting">Meeting</option>
                  <option value="rounds">Rounds</option>
                  <option value="appointment">Appointment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={taskForm.start_time}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, start_time: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={taskForm.end_time}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, end_time: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={taskForm.location}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, location: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Chamber 301"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={taskForm.priority}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, priority: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Task View */}
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with Add Task Button */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Tasks for{" "}
              {selectedDate?.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"} scheduled
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {canCreateTask && (
              <button
                onClick={() => setShowTaskModal(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Task</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-red-600 text-lg mb-2">{error}</p>
              <button
                onClick={fetchTasks}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                No tasks scheduled for this date
              </p>

              {canCreateTask && (
                <>
                  <p className="text-gray-400 text-sm mb-6">
                    Click "Add Task" to create your first task
                  </p>
                  <button
                    onClick={() => setShowTaskModal(true)}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Task</span>
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-4">
  {tasks.map((task, index) => (
    <div
      key={task.task_id || index}  // ✅ FIXED
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div
            className={`w-1 h-full ${getPriorityColor(task.priority)} rounded-full`}
          ></div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {task.task_title}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}
              >
                {task.priority}
              </span>
            </div>

            {task.task_description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {task.task_description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>
                  {task.start_time?.slice(0, 5)} - {task.end_time?.slice(0, 5)}
                </span>
              </div>

              {task.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{task.location}</span>
                </div>
              )}

              {task.task_type && (
                <div className="flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span className="capitalize">{task.task_type}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => handleDeleteTask(task.task_id)}  // ✅ FIXED
          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete task"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  ))}
</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Task;
