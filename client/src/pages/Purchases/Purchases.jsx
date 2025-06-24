import React, { useState, useEffect } from 'react';
import { purchasesAPI } from '../../services/api';
import { PlusCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PurchaseModal from './PurchaseModal.jsx';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await purchasesAPI.getAll({ search: searchTerm });
      setPurchases(response.data);
    } catch (error) {
      toast.error('Failed to fetch purchases');
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPurchases();
  };

  const handleOpenModal = (purchase) => {
    setSelectedPurchase(purchase);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPurchase(null);
  };

  const handleUpdate = async (id, data) => {
    try {
      await purchasesAPI.update(id, data);
      toast.success('Purchase updated successfully');
      handleCloseModal();
      fetchPurchases();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update purchase');
    }
  };

  const handleDelete = async (id) => {
    try {
      await purchasesAPI.delete(id);
      toast.success('Purchase deleted successfully');
      handleCloseModal();
      fetchPurchases();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete purchase');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Purchase Orders
        </h2>
        <Link to="/purchases/new">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
            <PlusCircle size={18} />
            New Purchase Order
          </button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by asset or supplier..."
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
          <div className="text-center py-8">Loading purchases...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchases.length > 0 ? (
                  purchases.map((purchase) => (
                    <tr key={purchase._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{purchase.assetId?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${
                          typeof purchase.totalCost === 'number' && purchase.totalCost > 0
                            ? purchase.totalCost.toFixed(2)
                            : (purchase.quantity && purchase.unitPrice
                                ? (purchase.quantity * purchase.unitPrice).toFixed(2)
                                : '0.00')
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.supplier}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleOpenModal(purchase)} className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                        <button onClick={() => handleOpenModal(purchase)} className="text-green-600 hover:text-green-900 mr-2">Edit</button>
                        <button onClick={() => handleOpenModal(purchase)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No purchases found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <PurchaseModal
          purchase={selectedPurchase}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Purchases; 