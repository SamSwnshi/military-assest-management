import React from 'react';
import { useForm } from 'react-hook-form';

const TransferModal = ({ transfer, isOpen, onClose, onUpdate, onDelete }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: transfer
  });

  React.useEffect(() => {
    reset(transfer);
  }, [transfer, reset]);

  if (!isOpen || !transfer) return null;

  const handleUpdate = async (data) => {
    await onUpdate(transfer._id, data);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this transfer?')) {
      await onDelete(transfer._id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">✕</button>
        <h2 className="text-xl font-bold mb-4">Transfer Details</h2>
        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-3">
          <div>
            <label className="block mb-1">Quantity</label>
            <input type="number" {...register('quantity', { required: 'Quantity is required', min: 1 })} className="w-full border px-3 py-2 rounded" />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
          </div>
          <div>
            <label className="block mb-1">Notes</label>
            <textarea {...register('notes')} className="w-full border px-3 py-2 rounded" />
          </div>
          <div className="flex justify-between mt-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
            <button type="button" onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferModal; 