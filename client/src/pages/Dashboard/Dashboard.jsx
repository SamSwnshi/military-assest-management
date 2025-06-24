import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { dashboardAPI, basesAPI } from '../../services/api';
import { 
  Package, 
  ShoppingCart, 
  Truck, 
  Users, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Archive
} from 'lucide-react';
import MetricCard from '../../component/Dashboard/MetricCard';
import ChartCard from '../../component/Dashboard/ChartCard';
import RecentActivity from '../../component/Dashboard/RecentActivity';
import NetMovementModal from '../../component/Dashboard/NetMovementModal';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNetMovementModal, setShowNetMovementModal] = useState(false);
  const [bases, setBases] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: [null, null],
    baseId: '',
  });
  const [netMovementData, setNetMovementData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchBases();
  }, []);

  useEffect(() => {
    if (showNetMovementModal) {
      dashboardAPI.getNetMovement().then(res => {
        setNetMovementData(res.data.data);
      }).catch(() => {
        setNetMovementData(null);
      });
    }
  }, [showNetMovementModal]);

  const fetchBases = async () => {
    try {
      const response = await basesAPI.getAll();
      setBases(response.data);
    } catch (error) {
      toast.error('Failed to fetch bases');
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getMetrics(filters);
      console.log('Dashboard Data:', response.data);
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    fetchDashboardData();
  };

  const metricCards = [
    {
      title: 'Total Assets',
      value: metrics?.totalAssets || 0,
      change: metrics?.assetsChange || 0,
      icon: Package,
      color: 'primary',
      href: '/assets'
    },
    {
      title: 'Total Purchases',
      value: metrics?.totalPurchases || 0,
      change: metrics?.purchasesChange || 0,
      icon: ShoppingCart,
      color: 'success',
      href: '/purchases'
    },
    {
      title: 'Active Transfers',
      value: metrics?.activeTransfers || 0,
      change: metrics?.transfersChange || 0,
      icon: Truck,
      color: 'warning',
      href: '/transfers'
    },
    {
      title: 'Assigned Assets',
      value: metrics?.assignedAssets || 0,
      change: metrics?.assignmentsChange || 0,
      icon: Users,
      color: 'info',
      href: '/assignments'
    },
    {
      title: 'Expended Assets',
      value: metrics?.expendedAssets || 0,
      change: 0, // Not implemented yet
      icon: Archive,
      color: 'danger',
      href: '/expenditures'
    }
  ];

  const chartData = {
    assetTypes: [
      { name: 'Vehicles', value: metrics?.assetTypes?.vehicles || 0 },
      { name: 'Weapons', value: metrics?.assetTypes?.weapons || 0 },
      { name: 'Ammunition', value: metrics?.assetTypes?.ammunition || 0 },
      { name: 'Equipment', value: metrics?.assetTypes?.equipment || 0 }
    ],
    monthlyPurchases: metrics?.monthlyPurchases || [],
    assetStatus: [
      { name: 'Available', value: metrics?.assetStatus?.available || 0 },
      { name: 'Assigned', value: metrics?.assetStatus?.assigned || 0 },
      { name: 'Maintenance', value: metrics?.assetStatus?.maintenance || 0 },
      { name: 'Retired', value: metrics?.assetStatus?.retired || 0 }
    ]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h2>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your military assets today.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Net Movement Overview
            </h3>
            <button
              onClick={() => setShowNetMovementModal(true)}
              className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Details
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-500">
                Purchases + Transfers In
              </h4>
              <p className="text-2xl font-bold text-green-600">
                {metrics?.netMovement?.in || 0}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-3">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-500">
                Transfers Out
              </h4>
              <p className="text-2xl font-bold text-red-600">
                {metrics?.netMovement?.out || 0}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-500">
                Net Movement
              </h4>
              <p className="text-2xl font-bold text-blue-600">
                {metrics?.netMovement?.in - metrics?.netMovement?.out || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

  
      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="p-6">
          <RecentActivity />
        </div>
      </div>

      {/* Net Movement Modal */}
      <NetMovementModal
        isOpen={showNetMovementModal}
        onClose={() => setShowNetMovementModal(false)}
        data={netMovementData}
      />
    </div>
  );
};

export default Dashboard; 