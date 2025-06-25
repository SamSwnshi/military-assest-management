import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { assetsAPI, basesAPI, transfersAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const NewTransfer = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const selectedAssetId = watch('assetId');
  const [selectedAsset, setSelectedAsset] = useState(null);

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

  // When asset changes, set the fromBaseId to the asset's baseId
  useEffect(() => {
    if (selectedAssetId) {
      const asset = assets.find(a => a._id === selectedAssetId);
      setSelectedAsset(asset);
      if (asset && asset.baseId) {
        setValue('fromBaseId', asset.baseId._id || asset.baseId); // baseId may be populated or just an id
      } else {
        setValue('fromBaseId', '');
      }
    } else {
      setSelectedAsset(null);
      setValue('fromBaseId', '');
    }
  }, [selectedAssetId, assets, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await transfersAPI.create({ ...data, transferredBy: user?.id || user?._id });
      toast.success('Transfer created successfully');
      navigate('/transfers');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create transfer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-white font-bold">New Asset Transfer</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Asset</label>
            <select {...register('assetId', { required: 'Asset is required' })} className="mt-1 block w-full">
              <option value="">Select Asset</option>
              {assets.map(asset => <option key={asset._id} value={asset._id}>{asset.name}</option>)}
            </select>
            {errors.assetId && <p className="text-red-500 text-sm">{errors.assetId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">From Base</label>
            <input type="hidden" {...register('fromBaseId', { required: 'Source base is required' })} />
            <select className="mt-1 block w-full" value={selectedAsset && selectedAsset.baseId ? (selectedAsset.baseId._id || selectedAsset.baseId) : ''} disabled>
              <option value="">Select Source Base</option>
              {selectedAsset && selectedAsset.baseId && (() => {
                const baseIdValue = selectedAsset.baseId._id || selectedAsset.baseId;
                const baseObj = bases.find(b => b._id === baseIdValue);
                return baseObj ? (
                  <option value={baseObj._id}>{baseObj.name}</option>
                ) : (
                  <option value={baseIdValue}>{baseIdValue}</option>
                );
              })()}
            </select>
            {errors.fromBaseId && <p className="text-red-500 text-sm">{errors.fromBaseId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">To Base</label>
            <select {...register('toBaseId', { required: 'Destination base is required' })} className="mt-1 block w-full">
              <option value="">Select Destination Base</option>
              {bases
                .filter(base => !selectedAsset || (selectedAsset.baseId && (base._id !== (selectedAsset.baseId._id || selectedAsset.baseId))))
                .map(base => <option key={base._id} value={base._id}>{base.name}</option>)}
            </select>
            {errors.toBaseId && <p className="text-red-500 text-sm">{errors.toBaseId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input type="number" {...register('quantity', { required: 'Quantity is required', min: 1 })} className="mt-1 block w-full" />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea {...register('notes')} className="mt-1 block w-full" />
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/transfers')} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md">
              {isLoading ? 'Creating...' : 'Create Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTransfer; 