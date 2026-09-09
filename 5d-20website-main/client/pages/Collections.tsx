import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Collections: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to enhanced collections page
    navigate("/enhanced-collections", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Enhanced Collections...</p>
      </div>
    </div>
  );
};

export default Collections;
