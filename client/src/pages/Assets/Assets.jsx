import React, { useState, useEffect } from 'react';
import { assetsAPI } from '../../services/api';
import { PlusCircle, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AssetModal from './AssetModal';

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await assetsAPI.getAll({ search: searchTerm });
      setAssets(response.data);
    } catch (error) {
      toast.error('Failed to fetch assets');
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAssets();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await assetsAPI.delete(id);
        toast.success('Asset deleted successfully');
        fetchAssets();
      } catch (error) {
        toast.error('Failed to delete asset');
      }
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await assetsAPI.update(id, data);
      toast.success('Asset updated successfully');
      setIsModalOpen(false);
      fetchAssets();
    } catch (error) {
      toast.error('Failed to update asset');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Asset Management
        </h2>
        <Link to="/assets/new">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
            <PlusCircle size={18} />
            Add New Asset
          </button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name, type, or status..."
            className="flex-grow px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md"
          >
            <Search size={18} />
            Search
          </button>
        </form>

        {loading ? (
          <div className="text-center py-8">Loading assets...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assets.length > 0 ? (
                  assets.map((asset) => (
                    <tr key={asset._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.baseId?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => { setSelectedAsset(asset); setIsModalOpen(true); }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() => { setSelectedAsset(asset); setIsModalOpen(true); }}
                          className="text-yellow-600 hover:text-yellow-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(asset._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No assets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AssetModal
        asset={selectedAsset}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdate}
        onDelete={async (id) => { await handleDelete(id); setIsModalOpen(false); }}
      />
    </div>
  );
};

export default Assets; 