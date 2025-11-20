
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Hamara custom hook

const AdminRoute = () => {
  const { user } = useAuth(); // Context se user object lein

  // Check karein ki user hai aur uska role 'admin' hai
  if (user && user.role === 'admin') {
    return <Outlet />; // Agar admin hai, to child component (Dashboard) ko render karein
  }

  // Agar user nahi hai ya admin nahi hai, to use login page par bhej dein
  // Agar user logged-in hai lekin admin nahi hai, to aap use homepage ya 'unauthorized' page par bhi bhej sakte hain.
  // Abhi ke liye, hum use login par bhej rahe hain.
  return <Navigate to="/login" replace />;
};

export default AdminRoute;