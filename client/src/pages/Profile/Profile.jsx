import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { User, Edit, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await updateProfile(data);
    if (result.success) {
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } else {
      toast.error(result.error || 'Failed to update profile');
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    reset({
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
    });
    setIsEditing(false);
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <User className="w-12 h-12 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{user.role}</p>
            </div>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              <Edit size={18} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
              >
                <Save size={18} />
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
              <input
                {...register('firstName', { required: 'First name is required' })}
                disabled={!isEditing}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
              <input
                {...register('lastName', { required: 'Last name is required' })}
                disabled={!isEditing}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })}
                disabled={!isEditing}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <input
                value={user.username}
                disabled
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Base</label>
              <input
                value={user.baseId?.name || 'N/A'}
                disabled
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-gray-100"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile; 