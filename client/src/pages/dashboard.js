import React, { useEffect } from 'react';
import { useAuth } from '../contexts/userContext';
import Router from 'next/router';

const Dashboard = () => {
  const { state } = useAuth();
  useEffect(() => {
    if (state.jwt === '') Router.push('/login');
  }, [state]);
  return <div>dashboard here!</div>;
};

export default Dashboard;
