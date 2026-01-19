import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Stethoscope, 
  FileText, 
  Bell, 
  Settings, 
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  Menu,
  UserRound,
  X,
  Plus
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Task from './task'; // Fixed import path - removed './Dashboard/'// task component import karala thiyenne methanin 

const baseUrl = process.env.REACT_APP_BASE_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  
  // New state for Task component
  const [showTaskView, setShowTaskView] = useState(false);
  const [taskViewDate, setTaskViewDate] = useState(null);

  // Day popup state
  const [showDayPopup, setShowDayPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [clickedDate, setClickedDate] = useState(null);
  

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };
  

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  const handleDayClick = (day, event) => {
    if (day) {
      const newDate = new Date(selectedDate);
      newDate.setDate(day);
      setClickedDate(newDate);
      
      const rect = event.currentTarget.getBoundingClientRect();
      setPopupPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX
      });
      
      setShowDayPopup(true);
    }
  };

  // Handler to view tasks - Opens Task component
  const handleViewTasks = () => {
    setTaskViewDate(clickedDate);
    setShowDayPopup(false);
    setShowTaskView(true);
  };

  // Handler to create task - Opens Task component with create modal
  const handleCreateTaskForDate = () => {
    setTaskViewDate(clickedDate);
    setShowDayPopup(false);
    setShowTaskView(true);
  };

  // Handler when task is created/updated
  const handleTaskUpdate = () => {
    fetchTasks(); // Refresh dashboard tasks
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const fetchTasks = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const doctorID = userData?.doctor_id || userData?.user_id;
      const formattedDate = selectedDate.toISOString().split('T')[0];

      const response = await fetch(
        `${baseUrl}/get-tasks/?doctor_id=${doctorID}&task_date=${formattedDate}`
      );
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleLogout = () => {
    navigate('../');
  };




  const patientConditionData = [
    { name: 'Stable', value: 21, color: '#10B981' },
    { name: 'Fair', value: 5, color: '#F59E0B' },
    { name: 'Serious', value: 2, color: '#EF4444' },
    { name: 'Critical', value: 2, color: '#DC2626' }
  ];

  const appointments = [
    { time: '09:00', patient: 'Martin Colleen', type: 'Consultation', id: '#MD00003854033' },
    { time: '09:30', patient: 'Kate-Mary Tennebe', type: 'Follow-up', id: '#MD00003854034' },
    { time: '10:00', patient: 'Amanda Kimber', type: 'Surgery Prep', id: '#MD00003854035', isActive: true },
    { time: '10:30', patient: 'Robert Mirro', type: 'Check-up', id: '#MD00003854036' },
    { time: '11:00', patient: 'Chester Bennington', type: 'Consultation', id: '#MD00003854037' },
    { time: '11:30', patient: 'Alice Bourdon', type: 'Follow-up', id: '#MD00003854038' }
  ];

  const importantUpdates = [
    {
      type: 'Changes in treatments',
      title: 'New managing chronic inflammation with psoriasis',
      description: 'Medical News Today has published an article about a new method of chronic inflammation with psoriasis.',
      date: '23.10.2023',
      icon: '📋'
    },
    {
      type: 'Clinic',
      title: 'Updated database',
      description: 'It will be on October 24-25, this may lead to a slight slowdown in the program.',
      date: '23.10.2023',
      icon: '🏥'
    }
  ];

  const generateCalendar = () => {
    const date = new Date(selectedDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() && 
           selectedDate.getMonth() === today.getMonth() && 
           selectedDate.getFullYear() === today.getFullYear();
  };

  const isSelectedDay = (day) => {
    if (!day) return false;
    return day === selectedDate.getDate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-3 sm:p-6 lg:p-8">
      {/* Task Component Modal  eka call karal thiyenne methan */}
      {showTaskView && (
        <Task 
          selectedDate={taskViewDate}
          onClose={() => setShowTaskView(false)}
          onTaskCreated={handleTaskUpdate}
        />
      )}

      {/* Day Click Popup - Small Tab  ,// meke  thama date ekak click karam thanin popup ekak open wenne task create krann kiyla */}
      {showDayPopup && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDayPopup(false)} //
          />
          
          <div 
            className="fixed z-50 bg-white rounded-lg shadow-2xl p-4 w-64"
            style={{   //popup eka position eka set karanne meken
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800">
                {clickedDate?.toLocaleDateString('en-US', {  // clickedDate eka display karanne meken
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h4>
              <button 
                onClick={() => setShowDayPopup(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
             
             

              <button
                onClick={handleViewTasks}
                className="w-full flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">View Tasks</span>
                 
              </button>
            </div>
          </div>
        </>
      )}

      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-6 lg:mb-10 gap-2">
          <div className="flex items-center space-x-2 lg:space-x-4">
            <button 
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 lg:w-8 lg:h-8 text-blue-600" />
              </div>
              <h1 className="text-lg lg:text-3xl font-bold text-white hidden sm:block">Medicare</h1>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input 
              type="text" 
              placeholder="Search patient, medication..."
              className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40 w-64 lg:w-96 text-sm"
            />
          </div>

          <div className="flex items-center space-x-4 lg:space-x-4">
            <Search className="w-6 h-6 text-white cursor-pointer hover:text-white/80 transition-colors md:hidden" />
            <UserRound className="w-6 h-6 text-white cursor-pointer hover:text-white/80 transition-colors" />
            <Bell className="w-6 h-6 text-white cursor-pointer hover:text-white/80 transition-colors" />
            <button onClick={handleLogout} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white hover:bg-white/20 transition-colors text-sm font-medium">
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          )}

          {/* Left Sidebar */}
          <div className={`
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0 lg:block lg:col-span-3 
            fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
            w-80 lg:w-auto h-full lg:h-auto
            bg-gradient-to-b from-blue-600 to-blue-800 lg:bg-transparent
            transition-transform duration-300 ease-in-out
            p-6 lg:p-0 space-y-6
          `}>
            <nav className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <ul className="space-y-3">
                <li><button className="w-full flex items-center space-x-4 text-white hover:bg-white/10 rounded-lg p-3 text-left font-medium"><Calendar className="w-6 h-6" /><span className="text-base">Dashboard</span></button></li>
                <li><button className="w-full flex items-center space-x-4 text-white/70 hover:bg-white/10 rounded-lg p-3 text-left"><Calendar className="w-6 h-6" /><span className="text-base">Calendar</span></button></li>
                <li><button className="w-full flex items-center space-x-4 text-white/70 hover:bg-white/10 rounded-lg p-3 text-left"><Users className="w-6 h-6" /><span className="text-base">Patients</span></button></li>
                <li><button className="w-full flex items-center space-x-4 text-white/70 hover:bg-white/10 rounded-lg p-3 text-left"><Stethoscope className="w-6 h-6" /><span className="text-base">Medicine</span></button></li>
                <li><button className="w-full flex items-center space-x-4 text-white/70 hover:bg-white/10 rounded-lg p-3 text-left"><FileText className="w-6 h-6" /><span className="text-base">Diagnosis</span></button></li>
              </ul>
            </nav>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Bell className="w-6 h-6 text-white" />
                <h3 className="text-white font-semibold text-lg">Notification</h3>
              </div>
              <div className="text-white/80">
                <p className="text-base">Mon, October 23, 2023</p>
                <p className="mt-2 text-base">10:48:08</p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3"></div>
              <h4 className="text-white font-semibold text-lg">Dr. Alex Robin</h4>
              <p className="text-white/70">Cardiologist</p>
            </div>
           
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="w-6 h-6 text-white" />
                <h3 className="text-white font-semibold text-lg">Setting</h3>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8">
            {/* Calendar Section */}
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-3 sm:space-y-0">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800">{monthNames[selectedDate.getMonth()]}</h2>
                  <div className="flex items-center space-x-4 lg:space-x-6 text-sm lg:text-base text-gray-600 mt-2">
                    <span>0 work day</span>
                    <span>0 vacation</span>
                    <span>Request</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handlePreviousMonth}
                    className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                  </button>
                  <span className="text-xl lg:text-2xl font-semibold">{selectedDate.getFullYear()}</span>
                  <button 
                    onClick={handleNextMonth}
                    className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-3">
                {dayNames.map(day => (
                  <div key={day} className="p-3 lg:p-4 text-center text-sm lg:text-base font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {generateCalendar().map((day, index) => (
                  <div 
                    key={index} 
                    onClick={(e) => handleDayClick(day, e)}
                    className={`
                      p-3 lg:p-4 text-center text-sm lg:text-base rounded-lg transition-all
                      ${day ? 'cursor-pointer hover:bg-gray-100' : 'cursor-default'}
                      ${isToday(day) ? 'bg-blue-500 text-white font-semibold hover:bg-blue-600' : ''}
                      ${!isToday(day) && isSelectedDay(day) ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
                      ${!isToday(day) && !isSelectedDay(day) && day ? 'text-gray-700' : ''}
                      ${!day ? 'text-gray-300' : ''}
                    `}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Timeline */}
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800">
                  Today's Timeline
                </h2>
                <button
                  onClick={() => {
                    setTaskViewDate(selectedDate);
                    setShowTaskView(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  <span>Manage Tasks</span>
                </button>
              </div>

              <div className="space-y-5 lg:space-y-6">
                {tasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No tasks for this date</p>
                ) : (
                  tasks.map((task, index) => (
                    <div key={index} className="flex items-center space-x-4 lg:space-x-6">
                      <div className="text-sm lg:text-base text-gray-600 w-20 lg:w-24 flex-shrink-0 font-medium">
                        {task.start_time.slice(0, 5)}-{task.end_time.slice(0, 5)}
                      </div>
                      <div className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full 
                        ${task.priority === 'urgent' ? 'bg-red-500' : 
                          task.priority === 'high' ? 'bg-orange-500' : 
                          task.priority === 'medium' ? 'bg-blue-500' : 'bg-green-500'} 
                        flex-shrink-0`}>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-base lg:text-lg truncate">
                          {task.task_title}
                        </h4>
                        <p className="text-sm lg:text-base text-gray-600 truncate">
                          {task.location || task.task_description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Appointments */}
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-3 sm:space-y-0">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800">Appointments</h2>
                <div className="flex items-center space-x-3">
                  <button className="p-2 lg:p-3 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                  </button>
                  <span className="text-sm lg:text-base text-gray-600 font-medium">
                    {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}
                  </span>
                  <button className="p-2 lg:p-3 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 lg:space-y-4 max-h-80 lg:max-h-96 overflow-y-auto">
                {appointments.map((appointment, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 lg:p-5 rounded-lg transition-colors ${appointment.isActive ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center space-x-4 lg:space-x-6 min-w-0 flex-1">
                      <div className="text-sm lg:text-base text-gray-600 w-12 lg:w-16 flex-shrink-0 font-medium">{appointment.time}</div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-800 text-base lg:text-lg truncate">{appointment.patient}</h4>
                        <p className="text-sm lg:text-base text-gray-600 truncate">{appointment.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <span className="text-sm lg:text-base text-gray-600 hidden sm:inline font-medium">{appointment.type}</span>
                      {appointment.isActive && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6 lg:space-y-8">
            {/* Doctor's Workload */}
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-800 text-lg lg:text-xl">Doctor's workload</h3>
                <span className="text-sm lg:text-base text-gray-500">Hours overtime</span>
              </div>
              
              <div className="flex items-center space-x-4 lg:space-x-6 mb-5">
                <div className="relative w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0">
                  <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl lg:text-3xl font-bold text-blue-600">73%</span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-3xl lg:text-4xl font-bold text-gray-800">70 h</div>
                  <div className="text-sm lg:text-base text-gray-500 flex items-center mt-1">
                    <span className="truncate">230 h / 160 h</span>
                    <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 inline text-green-500 ml-2" />
                    <span className="ml-1 font-medium">15%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Users className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500" />
                    <span className="text-2xl lg:text-3xl font-bold text-gray-800">450</span>
                  </div>
                  <div className="text-xs lg:text-sm text-gray-500 leading-tight">total patients this month</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-green-500" />
                    <span className="text-2xl lg:text-3xl font-bold text-gray-800">62</span>
                  </div>
                  <div className="text-xs lg:text-sm text-gray-500 leading-tight">active cases</div>
                </div>
              </div>
            </div>

            {/* Patients by Condition */}
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-5 text-lg lg:text-xl">Patients by condition</h3>
              
              <div className="flex items-center justify-center mb-5">
                <div className="relative w-32 h-32 lg:w-40 lg:h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={patientConditionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {patientConditionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl lg:text-3xl font-bold text-gray-800">30</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 lg:space-y-4">
                {patientConditionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm lg:text-base">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full flex-shrink-0`} style={{backgroundColor: item.color}}></div>
                      <span className="text-gray-700 truncate font-medium">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800 flex-shrink-0 ml-3 text-lg">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Updates */}
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-800 text-lg lg:text-xl">Important updates</h3>
                <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400" />
              </div>

              <div className="space-y-4 lg:space-y-6 max-h-80 lg:max-h-96 overflow-y-auto">
                {importantUpdates.map((update, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4 lg:pl-6 py-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <span className="text-lg lg:text-xl">{update.icon}</span>
                        <span className="text-xs lg:text-sm text-gray-500 truncate font-medium">{update.type}</span>
                      </div>
                      <span className="text-xs lg:text-sm text-gray-400 flex-shrink-0 ml-3">{update.date}</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm lg:text-base mb-2 line-clamp-2">{update.title}</h4>
                    <p className="text-xs lg:text-sm text-gray-600 leading-relaxed line-clamp-3">{update.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;