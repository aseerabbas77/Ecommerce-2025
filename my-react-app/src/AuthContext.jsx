import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Token state jaise pehle tha, waisa hi rakhein
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("accessToken");
    } catch (err) {
      console.error("Error reading token from localStorage:", err);
      return null;
    }
  });

  // 2. NAYA: User details (role ke liye) ke liye state banayein
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("userDetails");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("Error reading user details from localStorage:", err);
      return null;
    }
  });

  // 3. Login function ko update karein
  const login = (newToken, userDetails) => {
    try {
      // Token ko save karein
      localStorage.setItem("accessToken", newToken);
      setToken(newToken);
      
      // User details ko alag se save karein
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
      setUser(userDetails);
    } catch (err) {
      console.error("Error saving auth data:", err);
    }
  };

  // 4. Logout function ko update karein
  const logout = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userDetails"); // User details bhi remove karein
      setToken(null);
      setUser(null); // User state ko bhi clear karein
    } catch (err) {
      console.error("Error clearing auth data:", err);
    }
  };

  // 5. Context ki value mein user bhi provide karein
  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook aasaani ke liye
export const useAuth = () => {
  return useContext(AuthContext);
};