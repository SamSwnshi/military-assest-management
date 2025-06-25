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
    // Only fetch net movement data if user has a baseId
    if (user && user.baseId) {
      fetchNetMovementData();
    } else {
      // Set default values for users without a base
      setNetMovementData({
        purchases: 0,
        transfersIn: 0,
        transfersOut: 0,
        netMovement: 0
      });
    }
  }, [user]);

  useEffect(() => {
    if (showNetMovementModal) {
      if (user && user.baseId) {
        fetchNetMovementData();
      } else {
        // Set default values for users without a base
        setNetMovementData({
          purchases: 0,
          transfersIn: 0,
          transfersOut: 0,
          netMovement: 0
        });
      }
    }
  }, [showNetMovementModal, user]);

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

  const fetchNetMovementData = async () => {
    try {
      const response = await dashboardAPI.getNetMovement();
      setNetMovementData(response.data.data);
    } catch (error) {
      console.error('Error fetching net movement data:', error);
      console.error('Error response:', error.response?.data);
      
      // Set default values if there's an error
      setNetMovementData({
        purchases: 0,
        transfersIn: 0,
        transfersOut: 0,
        netMovement: 0
      });
      
      // Only show error toast for unexpected errors, not for missing baseId
      if (error.response?.status !== 400) {
        toast.error('Failed to load net movement data');
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    fetchDashboardData();
  };

  // Calculate net movement from the simplified data
  const calculateNetMovement = () => {
    if (!netMovementData) return 0;
    return netMovementData.purchases + netMovementData.transfersIn - netMovementData.transfersOut;
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
            
          </div>
        </div>
        <div className="p-6">
          {!user?.baseId ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">No base assigned to your account</p>
              <p className="text-sm text-gray-400">Net movement data is only available for users assigned to a base</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-500">
                  Transfers In
                </h4>
                <p className="text-2xl font-bold text-blue-600">
                  {netMovementData?.transfersIn || 0}
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
                  {netMovementData?.transfersOut || 0}
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-500">
                  Net Movement
                </h4>
                <p className={`text-2xl font-bold ${
                  calculateNetMovement() >= 0 ? 'text-purple-600' : 'text-red-600'
                }`}>
                  {calculateNetMovement() >= 0 ? '+' : ''}{calculateNetMovement()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard; 