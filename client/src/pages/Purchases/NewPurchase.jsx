import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { assetsAPI, basesAPI, purchasesAPI } from '../../services/api';

const NewPurchase = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [unitPrice, setUnitPrice] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsRes, basesRes] = await Promise.all([
          assetsAPI.getAll(),
          basesAPI.getAll(),
        ]);
        setAssets(assetsRes.data);
        setBases(basesRes.data);
      } catch (error) {
        toast.error('Failed to load required data');
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await purchasesAPI.create(data);
      toast.success('Purchase created successfully');
      navigate('/purchases');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create purchase');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssetChange = (e) => {
    const assetId = e.target.value;
    setSelectedAssetId(assetId);
    const asset = assets.find(a => a._id === assetId);
    const price = asset ? asset.unitPrice : '';
    setUnitPrice(price);
    setValue('unitPrice', price);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">New Purchase Order</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Asset</label>
            <select {...register('assetId', { required: 'Asset is required' })} className="mt-1 block w-full" onChange={handleAssetChange}>
              <option value="">Select Asset</option>
              {assets.map(asset => <option key={asset._id} value={asset._id}>{asset.name}</option>)}
            </select>
            {errors.assetId && <p className="text-red-500 text-sm">{errors.assetId.message}</p>}
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
            <input type="number" {...register('quantity', { required: 'Quantity is required', min: 1 })} className="mt-1 block w-full" />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Unit Price</label>
            <input type="number" step="0.01" {...register('unitPrice', { required: 'Unit price is required', min: 0 })} className="mt-1 block w-full" value={unitPrice} />
            {errors.unitPrice && <p className="text-red-500 text-sm">{errors.unitPrice.message}</p>}
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/purchases')} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md">
              {isLoading ? 'Creating...' : 'Create Purchase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPurchase; 