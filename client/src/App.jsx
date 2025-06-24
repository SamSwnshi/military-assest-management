import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './component/Layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Assets from './pages/Assets/Assets';
import Purchases from './pages/Purchases/Purchases';
import Transfers from './pages/Transfers/Transfers';
import Assignments from './pages/Assignments/Assignments.jsx';
import Expenditures from './pages/Expenditures/Expenditures';
import AuditLogs from './pages/AuditLogs/AuditLogs';
import Profile from './pages/Profile/Profile.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import NewPurchase from './pages/Purchases/NewPurchase.jsx';
import NewTransfer from './pages/Transfers/NewTransfer.jsx';
import NewAssignment from './pages/Assignments/NewAssignment.jsx';
import NewExpenditure from './pages/Expenditures/NewExpenditure.jsx';
import ProtectedRoute from './contexts/ProtectedRoute.jsx';
import Unauthorized from './pages/NotFound/Unauthorized.jsx';
import NewAsset from './pages/Assets/NewAsset';
import "./App.css"

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
          } 
        />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="dashboard" element={<ProtectedRoute allowedRoles={['admin', 'baseCommander', 'logisticsOfficer']}>
            <Dashboard />
          </ProtectedRoute>} />
          
          <Route path="assets" element={<Assets />} />
          
          <Route path="assets/new" element={<NewAsset />} />
          
          <Route path="purchases" element={<Purchases />} />
          
          <Route path="purchases/new" element={<NewPurchase />} />
          
          <Route path="transfers" element={<Transfers />} />
          
          <Route path="transfers/new" element={<NewTransfer />} />
          
          <Route path="assignments" element={<ProtectedRoute allowedRoles={['admin', 'baseCommander']}>
            <Assignments />
          </ProtectedRoute>} />
          
          <Route path="assignments/new" element={<ProtectedRoute allowedRoles={['admin', 'baseCommander']}>
            <NewAssignment />
          </ProtectedRoute>} />
          
          <Route path="expenditures" element={<Expenditures />} />
          
          <Route path="expenditures/new" element={<NewExpenditure />} />
          
          <Route 
            path="audit-logs" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AuditLogs />
              </ProtectedRoute>
            } 
          />
          
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App; 