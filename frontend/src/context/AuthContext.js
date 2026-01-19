import React, { createContext, useState, useContext, useEffect } from "react";

// Create AuthContext
const AuthContext = createContext(); //createContext: මුළු app එකටම share කරන්න පුළුවන් data storage එකක් හදනවාuseState: User data store කරන්න (මතකයේ තබාගන්න)useContext: App එකේ ඕනම තැනකින් user data access කරන්නuseEffect: App load වෙනකොට auto run වෙන code

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); //User data store කරනවා (logged in නම් data, නැත්නම් null)

  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("medicare_user"); //localStorage check කරනවා
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser); // තියෙනවා නම් parse කරලා load කරනවා
        setUser(userData);
        console.log("✅ User loaded from localStorage:", userData);
      } catch (error) {
        console.error("❌ Error parsing stored user:", error);
        localStorage.removeItem("medicare_user");
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (username, password) => {
  try {
    // Make API request to backend
    const response = await fetch(`${baseUrl}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    // ✅ Parse the JSON response
    const result = await response.json();

    // ✅ Check if login was successful
    if (response.ok && result.message === "Login successful") {
      const userData = {
        username: result.username,
        role: result.role,
        doctorID: result.doctorID
      };
      
      // Save user data
      setUser(userData);
      localStorage.setItem("medicare_user", JSON.stringify(userData));
      
      console.log("✅ Login successful:", userData);
      console.log("👨‍⚕️ Doctor ID:", userData.doctorID);
      
      return { success: true, user: userData };
    } else {
      // Login failed
      const errorMsg = result.error || "Invalid username or password";
      console.error("❌ Login failed:", errorMsg);
      return { success: false, error: errorMsg };
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    return { 
      success: false, 
      error: "An error occurred. Please try again later." 
    };
  }
};
  // Logout function
  const logout = async () => {
    try {
      await fetch(`${baseUrl}/logout/`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("medicare_user");
      console.log("✅ User logged out");
    }
  };

  // Check if user is doctor
  const isDoctor = () => {
    return user && user.role === "doctor" && user.doctorID;
  };

  // Get doctor ID
  const getDoctorId = () => {
    return user?.doctorID || null;
  };

  // Check if authenticated
  const isAuthenticated = !!user;

  const value = {
    user,
    login,
    logout,
    isDoctor,
    getDoctorId,
    loading,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
