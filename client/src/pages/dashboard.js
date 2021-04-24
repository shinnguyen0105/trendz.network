import React, { useEffect } from 'react';
import { useAuth } from '../contexts/userContext';
import Router from 'next/router';

import InfluencerDashboard from '../components/Containers/Dashboards/InfluencerDashboard';
import CustomerDashboard from '../components/Containers/Dashboards/CustomerDashboard';
import EmployeeDashboard from '../components/Containers/Dashboards/EmployeeDashboard';
import AdminDashboard from '../components/Containers/Dashboards/AdminDashboard';
import NewAccount from '../components/Containers/newaccount';

const Dashboard = () => {
  const { state } = useAuth();
  useEffect(() => {
    if (state.jwt === '') Router.push('/login');
  }, [state]);
  console.log(state.user);
  return (
    <div className='wrapper'>
      {state.user.role.name === 'Influencer' ? <InfluencerDashboard /> : null}
      {state.user.role.name === 'Customer' ? <CustomerDashboard /> : null}
      {state.user.role.name === 'Employee' ? <EmployeeDashboard /> : null}
      {state.user.role.name === 'Admin' ? <AdminDashboard /> : null}
      {state.user.role.name === 'Authenticated' ? <NewAccount /> : null}
    </div>
  );
};

export default Dashboard;
