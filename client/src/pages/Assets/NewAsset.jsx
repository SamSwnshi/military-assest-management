import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { assetsAPI, basesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const NewAsset = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();
  const [bases, setBases] = useState([]);

  useEffect(() => {
    // Auto-generate assetId
    setValue('assetId', `A${Date.now()}`);
    // Fetch bases
    const fetchBases = async () => {
      try {
        const res = await basesAPI.getAll();
        setBases(res.data);
      } catch (err) {
        toast.error('Failed to load bases');
      }
    };
    fetchBases();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      await assetsAPI.create(data);
      toast.success('Asset created successfully!');
      navigate('/assets');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create asset');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Asset</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Asset ID</label>
          <input {...register('assetId', { required: 'Asset ID is required' })} className="w-full border px-3 py-2 rounded" readOnly />
          {errors.assetId && <p className="text-red-500 text-sm">{errors.assetId.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Name</label>
          <input {...register('name', { required: 'Name is required' })} className="w-full border px-3 py-2 rounded" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Type</label>
          <select {...register('type', { required: 'Type is required' })} className="w-full border px-3 py-2 rounded">
            <option value="">Select type</option>
            <option value="vehicle">Vehicle</option>
            <option value="weapon">Weapon</option>
            <option value="ammunition">Ammunition</option>
            <option value="equipment">Equipment</option>
            <option value="communication">Communication</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Quantity</label>
          <input type="number" {...register('quantity', { required: 'Quantity is required', min: 1 })} className="w-full border px-3 py-2 rounded" />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Base</label>
          <select {...register('baseId', { required: 'Base is required' })} className="w-full border px-3 py-2 rounded">
            <option value="">Select base</option>
            {bases.map(base => (
              <option key={base._id} value={base._id}>{base.name}</option>
            ))}
          </select>
          {errors.baseId && <p className="text-red-500 text-sm">{errors.baseId.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Unit Price</label>
          <input
            type="number"
            step="0.01"
            {...register('unitPrice', { required: 'Unit price is required', min: 0 })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.unitPrice && <p className="text-red-500 text-sm">{errors.unitPrice.message}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Add Asset</button>
      </form>
    </div>
  );
};

export default NewAsset; 