import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Truck, 
  Users, 
  FileText, 
  Shield, 
  Settings,
  X,
  LogOut
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      roles: ['admin', 'baseCommander', 'logisticsOfficer']
    },
    {
      name: 'Assets',
      href: '/assets',
      icon: Package,
      roles: ['admin', 'baseCommander']
    },
    {
      name: 'Purchases',
      href: '/purchases',
      icon: ShoppingCart,
      roles: ['admin', 'baseCommander', 'logisticsOfficer']
    },
    {
      name: 'Transfers',
      href: '/transfers',
      icon: Truck,
      roles: ['admin', 'baseCommander', 'logisticsOfficer']
    },
    {
      name: 'Assignments',
      href: '/assignments',
      icon: Users,
      roles: ['admin', 'baseCommander'],
      allowedRoles: ['admin', 'baseCommander']
    },
    {
      name: 'Expenditures',
      href: '/expenditures',
      icon: FileText,
      roles: ['admin', 'baseCommander']
    },
    {
      name: 'Audit Logs',
      href: '/audit-logs',
      icon: Shield,
      roles: ['admin']
    }
  ];

  const handleLogout = () => {
    logout();
  };

  const isAllowed = (allowedRoles) => {
    if (!allowedRoles) return true;
    return user && allowedRoles.includes(user.role);
  };

  const filteredNavigation = navigation.filter(item => 
    isAllowed(item.allowedRoles)
  );

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h1 className="ml-3 text-lg font-semibold text-gray-900">
            Military Asset
          </h1>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role?.replace(/([A-Z])/g, ' $1').trim()}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
              onClick={onClose}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 