import React from 'react';
import { X, TrendingUp, TrendingDown, DollarSign, Package, Truck } from 'lucide-react';

const NetMovementModal = ({ isOpen, onClose, data, user }) => {
  if (!isOpen) return null;

  const movementData = data || {
    purchases: 0,
    transfersIn: 0,
    transfersOut: 0,
    netMovement: 0
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Net Movement Calculation
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {!user?.baseId ? (
              <div className="text-center py-8">
                <div className="mb-4">
                  <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Base Assigned
                </h4>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Net movement data is only available for users assigned to a base.
                </p>
                <p className="text-sm text-gray-400">
                  Please contact your administrator to assign you to a base.
                </p>
              </div>
            ) : (
              <>
                {/* Formula Display */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Net Movement Formula:
                  </h4>
                  <p className="text-lg font-mono text-gray-900 dark:text-white">
                    Net Movement = Purchases + Transfers In - Transfers Out
                  </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Package className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                      <div>
                        <p className="text-xs font-medium text-green-600 dark:text-green-400">
                          Purchases
                        </p>
                        <p className="text-xl font-bold text-green-700 dark:text-green-300">
                          {movementData.purchases}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                      <div>
                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                          Transfers In
                        </p>
                        <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                          {movementData.transfersIn}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <div className="flex items-center">
                      <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400 mr-2" />
                      <div>
                        <p className="text-xs font-medium text-red-600 dark:text-red-400">
                          Transfers Out
                        </p>
                        <p className="text-xl font-bold text-red-700 dark:text-red-300">
                          {movementData.transfersOut}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
                      <div>
                        <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                          Net Movement
                        </p>
                        <p className={`text-xl font-bold ${
                          movementData.netMovement >= 0 
                            ? 'text-purple-700 dark:text-purple-300' 
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          {movementData.netMovement >= 0 ? '+' : ''}{movementData.netMovement}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Calculation Breakdown:
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Purchases:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">+{movementData.purchases}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Transfers In:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">+{movementData.transfersIn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Transfers Out:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">-{movementData.transfersOut}</span>
                    </div>
                    <hr className="border-gray-300 dark:border-gray-600" />
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-900 dark:text-white">Net Movement:</span>
                      <span className={`${
                        movementData.netMovement >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {movementData.netMovement >= 0 ? '+' : ''}{movementData.netMovement}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetMovementModal; 