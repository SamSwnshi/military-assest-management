import React, { useState, useEffect } from 'react';
import { expendituresAPI } from '../../services/api';
import { PlusCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ExpenditureModal from './ExpenditureModal.jsx';

const Expenditures = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpenditure, setSelectedExpenditure] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchExpenditures();
  }, []);

  const fetchExpenditures = async () => {
    try {
      setLoading(true);
      const response = await expendituresAPI.getAll({ search: searchTerm });
      setExpenditures(response.data);
    } catch (error) {
      toast.error('Failed to fetch expenditures');
      console.error('Error fetching expenditures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExpenditures();
  };

  const handleOpenModal = (expenditure) => {
    setSelectedExpenditure(expenditure);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExpenditure(null);
  };

  const handleUpdate = async (id, data) => {
    try {
      await expendituresAPI.update(id, data);
      toast.success('Expenditure updated successfully');
      handleCloseModal();
      fetchExpenditures();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update expenditure');
    }
  };

  const handleDelete = async (id) => {
    try {
      await expendituresAPI.delete(id);
      toast.success('Expenditure deleted successfully');
      handleCloseModal();
      fetchExpenditures();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete expenditure');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Expenditures
        </h2>
        <Link to="/expenditures/new">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
            <PlusCircle size={18} />
            New Expenditure
          </button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by asset or reason..."
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
          <div className="text-center py-8">Loading expenditures...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expended By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenditures.length > 0 ? (
                  expenditures.map((expenditure) => (
                    <tr key={expenditure._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expenditure.assetId?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expenditure.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expenditure.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expenditure.expendedBy?.username || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(expenditure.expenditureDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleOpenModal(expenditure)} className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                        <button onClick={() => handleOpenModal(expenditure)} className="text-green-600 hover:text-green-900 mr-2">Edit</button>
                        <button onClick={() => handleOpenModal(expenditure)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No expenditures found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ExpenditureModal
          expenditure={selectedExpenditure}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Expenditures; 