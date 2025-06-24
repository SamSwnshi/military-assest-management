import React, { useState, useEffect } from 'react';
import { transfersAPI } from '../../services/api';
import { PlusCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import TransferModal from './TransferModal.jsx';

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const response = await transfersAPI.getAll({ search: searchTerm });
      setTransfers(response.data);
    } catch (error) {
      toast.error('Failed to fetch transfers');
      console.error('Error fetching transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTransfers();
  };

  const handleOpenModal = (transfer) => {
    setSelectedTransfer(transfer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransfer(null);
  };

  const handleUpdate = async (id, data) => {
    try {
      await transfersAPI.update(id, data);
      toast.success('Transfer updated successfully');
      handleCloseModal();
      fetchTransfers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update transfer');
    }
  };

  const handleDelete = async (id) => {
    try {
      await transfersAPI.delete(id);
      toast.success('Transfer deleted successfully');
      handleCloseModal();
      fetchTransfers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete transfer');
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      await transfersAPI.update(id, { status: 'completed' });
      toast.success('Transfer marked as completed');
      fetchTransfers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark as completed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Asset Transfers
        </h2>
        <Link to="/transfers/new">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
            <PlusCircle size={18} />
            New Transfer
          </button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by asset or base..."
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
          <div className="text-center py-8">Loading transfers...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From Base</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Base</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transfers.length > 0 ? (
                  transfers.map((transfer) => (
                    <tr key={transfer._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transfer.assetId?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transfer.fromBaseId?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transfer.toBaseId?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transfer.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleOpenModal(transfer)} className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                        <button onClick={() => handleOpenModal(transfer)} className="text-green-600 hover:text-green-900 mr-2">Edit</button>
                        <button onClick={() => handleOpenModal(transfer)} className="text-red-600 hover:text-red-900 mr-2">Delete</button>
                        {transfer.status !== 'completed' && (
                          <button onClick={() => handleMarkCompleted(transfer._id)} className="text-purple-600 hover:text-purple-900">Mark as Completed</button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No transfers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <TransferModal
          transfer={selectedTransfer}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Transfers; 