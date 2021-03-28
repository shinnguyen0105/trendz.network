import React, { useEffect } from 'react';
import { useAuth } from '../contexts/userContext';
import Router from 'next/router';

import InfluencerDashboard from '../components/Containers/Dashboards/InfluencerDashboard';
import CustomerDashboard from '../components/Containers/Dashboards/CustomerDashboard';
import EmployeeDashboard from '../components/Containers/Dashboards/EmployeeDashboard';
import AdminDashboard from '../components/Containers/Dashboards/AdminDashboard';

// import Customer from '../components/Dashboards/Customer';
// import Employee from '../components/Dashboards/Employee';
// import Admin from '../components/Dashboards/Admin';

const Dashboard = () => {
  const { state } = useAuth();
  useEffect(() => {
    if (state.jwt === '') Router.push('/login');
  }, [state]);
  return (
    <>
      {state.user.role.name === 'Influencer' ? <InfluencerDashboard /> : null}
      {state.user.role.name === 'Customer' ? <CustomerDashboard /> : null}
      {state.user.role.name === 'Employee' ? <EmployeeDashboard /> : null}
      {state.user.role.name === 'Admin' ? <AdminDashboard /> : null}
    </>
  );
};

export default Dashboard;
