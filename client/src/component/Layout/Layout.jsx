import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from "./Sidebar.jsx"
import Header from './Header';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      

      <div className={`lg:ml-64 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>

        <Header onMenuClick={toggleSidebar} />
        

        <main className="p-6">
          <Outlet />
        </main>
      </div>
      

      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout; 