import React, { useEffect } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import SuccessPage from '../pages/Dashboard/SuccessPage';

export default function DashboardLayout() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const canceled = searchParams.get('canceled') === 'true';
  const navigate = useNavigate();
  
  useEffect(() => {
    if (canceled) {
      // If payment was canceled, redirect to pricing page with canceled parameter
      navigate('/pricing?canceled=true', { replace: true });
    }
  }, [canceled, navigate]);
  
  // If payment was successful, show success page
  if (success) {
    return <SuccessPage />;
  }
  
  return (
    <div className="flex min-h-screen bg-[#FDFFEE]">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}