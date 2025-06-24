import React, { useState, useEffect } from 'react';
import { assignmentsAPI } from '../../services/api';
import { PlusCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AssignmentModal from './AssignmentModal';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await assignmentsAPI.getAll({ search: searchTerm });
      setAssignments(response.data);
    } catch (error) {
      toast.error('Failed to fetch assignments');
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAssignments();
  };

  const handleUpdate = async (id, data) => {
    try {
      await assignmentsAPI.update(id, data);
      toast.success('Assignment updated successfully');
      setIsModalOpen(false);
      fetchAssignments();
    } catch (error) {
      toast.error('Failed to update assignment');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await assignmentsAPI.delete(id);
        toast.success('Assignment deleted successfully');
        fetchAssignments();
      } catch (error) {
        toast.error('Failed to delete assignment');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Asset Assignments
        </h2>
        <Link to="/assignments/new">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
            <PlusCircle size={18} />
            New Assignment
          </button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by asset or personnel..."
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
          <div className="text-center py-8">Loading assignments...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.length > 0 ? (
                  assignments.map((assignment) => (
                    <tr key={assignment._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{assignment.assetId?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assignment.personnelName || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assignment.baseId?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assignment.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => { setSelectedAssignment(assignment); setIsModalOpen(true); }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() => { setSelectedAssignment(assignment); setIsModalOpen(true); }}
                          className="text-yellow-600 hover:text-yellow-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(assignment._id)}
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
                      No assignments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <AssignmentModal
        assignment={selectedAssignment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdate}
        onDelete={async (id) => { await handleDelete(id); setIsModalOpen(false); }}
      />
    </div>
  );
};

export default Assignments; 