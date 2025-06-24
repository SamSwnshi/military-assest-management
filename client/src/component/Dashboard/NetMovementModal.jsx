import React from 'react';
import { X, TrendingUp, TrendingDown, DollarSign, Calendar, Package } from 'lucide-react';

const NetMovementModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const movementData = data || {
    summary: {
      totalIn: 0,
      totalOut: 0,
      netMovement: 0,
      period: 'This Month'
    },
    purchases: [],
    transfersIn: [],
    transfersOut: [],
    breakdown: {
      byAssetType: [],
      byBase: [],
      byMonth: []
    }
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
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Net Movement Details
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
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      Total In
                    </p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {movementData.summary.totalIn}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <TrendingDown className="w-8 h-8 text-red-600 dark:text-red-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      Total Out
                    </p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                      {movementData.summary.totalOut}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Net Movement
                    </p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {movementData.summary.netMovement}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Period Info */}
            <div className="mb-6">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                Period: {movementData.summary.period}
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="space-y-6">
              {/* Recent Purchases */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                  Recent Purchases
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  {movementData.purchases.length > 0 ? (
                    <div className="space-y-3">
                      {movementData.purchases.slice(0, 5).map((purchase, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg">
                          <div className="flex items-center">
                            <Package className="w-4 h-4 text-green-600 dark:text-green-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {purchase.assetName}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {purchase.base} • {purchase.date}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                            +{purchase.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No recent purchases
                    </p>
                  )}
                </div>
              </div>

              {/* Recent Transfers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Transfers In */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                    Recent Transfers In
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    {movementData.transfersIn.length > 0 ? (
                      <div className="space-y-3">
                        {movementData.transfersIn.slice(0, 3).map((transfer, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {transfer.assetName}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                From: {transfer.fromBase} • {transfer.date}
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                              +{transfer.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        No transfers in
                      </p>
                    )}
                  </div>
                </div>

                {/* Transfers Out */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                    Recent Transfers Out
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    {movementData.transfersOut.length > 0 ? (
                      <div className="space-y-3">
                        {movementData.transfersOut.slice(0, 3).map((transfer, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {transfer.assetName}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                To: {transfer.toBase} • {transfer.date}
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                              -{transfer.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        No transfers out
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Breakdown by Asset Type */}
              {movementData.breakdown.byAssetType.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                    Movement by Asset Type
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="space-y-3">
                      {movementData.breakdown.byAssetType.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.type}
                          </span>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-green-600 dark:text-green-400">
                              +{item.in}
                            </span>
                            <span className="text-sm text-red-600 dark:text-red-400">
                              -{item.out}
                            </span>
                            <span className={`text-sm font-semibold ${
                              item.net >= 0 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {item.net >= 0 ? '+' : ''}{item.net}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
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