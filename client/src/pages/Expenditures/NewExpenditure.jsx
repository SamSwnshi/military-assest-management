import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { assetsAPI, expendituresAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext.jsx';

const NewExpenditure = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const selectedAsset = assets.find(a => a._id === selectedAssetId);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await assetsAPI.getAll();
        setAssets(response.data);
      } catch (error) {
        toast.error('Failed to load assets');
      }
    };
    fetchAssets();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!data.assetId) {
        toast.error('Please select an asset');
        return;
      }
      if (!data.quantity || data.quantity <= 0) {
        toast.error('Please enter a valid quantity');
        return;
      }
      if (!data.reason) {
        toast.error('Please provide a reason');
        return;
      }
      if (!user || !user._id) {
        toast.error('User authentication error');
        return;
      }

      const expenditureData = { 
        ...data, 
        quantity: parseInt(data.quantity, 10),
        expendedBy: user._id 
      };
      console.log('Submitting expenditure data:', expenditureData);
      console.log('User data:', user);
      
      await expendituresAPI.create(expenditureData);
      toast.success('Expenditure recorded successfully');
      navigate('/expenditures');
    } catch (error) {
      console.error('Expenditure creation error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to record expenditure');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-white font-bold">New Expenditure</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Asset</label>
            <select {...register('assetId', { required: 'Asset is required' })} className="mt-1 block w-full" onChange={e => setSelectedAssetId(e.target.value)}>
              <option value="">Select Asset</option>
              {assets.map(asset => <option key={asset._id} value={asset._id}>{asset.name}</option>)}
            </select>
            {selectedAsset && (
              <p className="text-sm text-gray-500">Available: {selectedAsset.closingBalance}</p>
            )}
            {errors.assetId && <p className="text-red-500 text-sm">{errors.assetId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input type="number" {...register('quantity', {
              required: 'Quantity is required',
              min: 1,
              validate: value => !selectedAsset || value <= selectedAsset.closingBalance || `Cannot exceed available quantity (${selectedAsset?.closingBalance})`
            })} className="mt-1 block w-full" />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Reason</label>
            <textarea {...register('reason', { required: 'Reason is required' })} className="mt-1 block w-full" />
            {errors.reason && <p className="text-red-500 text-sm">{errors.reason.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea {...register('notes')} className="mt-1 block w-full" />
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/expenditures')} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md">
              {isLoading ? 'Recording...' : 'Record Expenditure'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewExpenditure; 