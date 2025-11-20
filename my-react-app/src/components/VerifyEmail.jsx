import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  // 1. Hooks ko initialize karein
  const { token } = useParams();      // URL se token nikalne ke liye
  const navigate = useNavigate();     // Redirect karne ke liye

  // 2. State management ke liye variables
  // 'verifying', 'success', 'error' - inmein se koi ek state hogi
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  // 3. useEffect hook - yeh component load hote hi sirf ek baar chalega
  useEffect(() => {
    // Agar URL mein token hi nahi hai, toh foran error dikha do
    if (!token) {
      setVerificationStatus('error');
      setMessage('Invalid verification link. Token not found.');
      return;
    }

    const verifyEmail = async () => {
      try {
        // API call - yahan loading shuru ho chuki hai
        // Note: Aapka port 5000 hai, maine uske mutabiq update kar diya hai
        // Ghalat :tokrn ko theek karke :token kar diya hai
        const response = await axios.get(`http://localhost:5000/api/users/verify-email/${token}`);

        // API call successful hui
        setVerificationStatus('success');
        setMessage(response.data.message || "Email verified successfully!");

        // 2-3 second ruk kar user ko login page par bhej do
        setTimeout(() => {
          navigate('/login');
        }, 3000); // 3 second ka delay

      } catch (err) {
        // API call fail ho gayi
        setVerificationStatus('error');
        const errorMessage = err.response?.data?.message || "Verification failed. The link might be expired or invalid.";
        setMessage(errorMessage);
      }
    };

    verifyEmail();
  }, [token, navigate]); // Dependencies

  // 4. Conditional Rendering - status ke hisab se UI dikhao

  // Case 1: Verification chal rahi hai
  if (verificationStatus === 'verifying') {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
        <p className="mt-4 text-lg text-gray-700">Verifying your email, please wait...</p>
      </div>
    );
  }

  // Case 2: Verification successful ho gayi
  if (verificationStatus === 'success') {
    return (
      <div className="flex justify-center min-h-screen items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className='text-3xl font-bold text-green-600 mb-2'>Success!</h1>
          <p className='text-gray-800'>{message}</p>
          <p className='mt-2 text-sm text-gray-600'>Redirecting you to the login page...</p>
        </div>
      </div>
    );
  }

  // Case 3: Verification mein error aa gaya
  if (verificationStatus === 'error') {
    return (
      <div className="flex justify-center min-h-screen items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className='text-3xl font-bold text-red-600 mb-2'>Verification Failed</h1>
          <p className='text-gray-800'>{message}</p>
          <button 
            onClick={() => navigate('/register')} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Registering Again
          </button>
        </div>
      </div>
    );
  }

  return null; // Just in case
}

export default VerifyEmail;