import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { assetsAPI, basesAPI, usersAPI, assignmentsAPI } from '../../services/api';

const NewAssignment = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [availableQty, setAvailableQty] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsRes, basesRes, usersRes] = await Promise.all([
          assetsAPI.getAll(),
          basesAPI.getAll(),
          usersAPI.getAll(),
        ]);
        setAssets(assetsRes.data);
        setBases(basesRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        toast.error('Failed to load required data');
      }
    };
    fetchData();
  }, []);

  const handleAssetChange = (e) => {
    const assetId = e.target.value;
    setSelectedAssetId(assetId);
    const asset = assets.find(a => a._id === assetId);
    setAvailableQty(asset ? asset.closingBalance : '');
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const selectedUser = users.find(u => u._id === data.personnelId);
      const personnelName = selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : '';
      await assignmentsAPI.create({
        ...data,
        personnelName,
        personnelId: undefined
      });
      toast.success('Assignment created successfully');
      navigate('/assignments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create assignment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-white font-bold">New Asset Assignment</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Asset</label>
            <select {...register('assetId', { required: 'Asset is required' })} className="mt-1 block w-full" onChange={handleAssetChange}>
              <option value="">Select Asset</option>
              {assets.map(asset => <option key={asset._id} value={asset._id}>{asset.name}</option>)}
            </select>
            {availableQty !== '' && (
              <p className="text-sm text-gray-500">Available: {availableQty}</p>
            )}
            {errors.assetId && <p className="text-red-500 text-sm">{errors.assetId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Assign To (Personnel)</label>
            <select {...register('personnelId', { required: 'Personnel is required' })} className="mt-1 block w-full">
              <option value="">Select Personnel</option>
              {users.map(user => <option key={user._id} value={user._id}>{user.firstName} {user.lastName}</option>)}
            </select>
            {errors.personnelId && <p className="text-red-500 text-sm">{errors.personnelId.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium">Base</label>
            <select {...register('baseId', { required: 'Base is required' })} className="mt-1 block w-full">
              <option value="">Select Base</option>
              {bases.map(base => <option key={base._id} value={base._id}>{base.name}</option>)}
            </select>
            {errors.baseId && <p className="text-red-500 text-sm">{errors.baseId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input type="number" {...register('quantity', { required: 'Quantity is required', min: 1, max: availableQty ? Number(availableQty) : undefined })} className="mt-1 block w-full" />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/assignments')} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md">
              {isLoading ? 'Creating...' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAssignment; 