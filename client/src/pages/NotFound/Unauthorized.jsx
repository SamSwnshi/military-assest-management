import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <ShieldAlert className="mx-auto h-24 w-24 text-red-500" />
        <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">Access Denied</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          You do not have permission to view this page.
        </p>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 