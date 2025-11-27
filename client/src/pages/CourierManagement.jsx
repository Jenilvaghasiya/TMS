import React, { useState, useEffect } from 'react';
import { courierAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit, FiTrash2, FiX, FiSearch } from 'react-icons/fi';
import { format } from 'date-fns';
import { validateName } from '../utils/validation';
import './TaskManagement.css';

const CourierManagement = () => {
  const [couriers, setCouriers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourier, setEditingCourier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    senderName: '',
    receiverName: '',
    courierType: '',
    trackingNumber: '',
    remarks: ''
  });

  useEffect(() => {
    fetchCouriers();
  }, []);

  const fetchCouriers = async () => {
    try {
      const response = await courierAPI.getAll({ search: searchTerm });
      setCouriers(response.data);
    } catch (error) {
      toast.error('Failed to fetch couriers');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!validateName(formData.senderName)) {
      toast.error('Sender name must be 2-50 characters with letters only');
      return;
    }

    if (!validateName(formData.receiverName)) {
      toast.error('Receiver name must be 2-50 characters with letters only');
      return;
    }

    if (!formData.courierType || formData.courierType.trim().length < 2) {
      toast.error('Courier type is required (minimum 2 characters)');
      return;
    }

    try {
      if (editingCourier) {
        const response = await courierAPI.update(editingCourier.id, formData);
        toast.success('Courier updated successfully');
      } else {
        const response = await courierAPI.create(formData);
        toast.success(`Courier created! Tracking: ${response.data.trackingNumber}`);
      }
      fetchCouriers();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this courier entry?')) {
      try {
        await courierAPI.delete(id);
        toast.success('Courier deleted successfully');
        fetchCouriers();
      } catch (error) {
        toast.error('Failed to delete courier');
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await courierAPI.update(id, {
        status,
        deliveredDate: status === 'Delivered' ? new Date() : null
      });
      toast.success('Status updated successfully');
      fetchCouriers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const openModal = (courier = null) => {
    if (courier) {
      setEditingCourier(courier);
      setFormData({
        senderName: courier.senderName,
        receiverName: courier.receiverName,
        courierType: courier.courierType,
        trackingNumber: courier.trackingNumber,
        remarks: courier.remarks || ''
      });
    } else {
      setEditingCourier(null);
      setFormData({
        senderName: '',
        receiverName: '',
        courierType: '',
        trackingNumber: '',
        remarks: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourier(null);
  };

  return (
    <div className="task-management">
      <div className="page-header">
        <h2>Courier Management</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search couriers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={fetchCouriers}
            />
          </div>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <FiPlus /> Add Courier
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Type</th>
              <th>Tracking #</th>
              <th>Received Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {couriers.map((courier) => (
              <tr key={courier.id}>
                <td>{courier.senderName}</td>
                <td>{courier.receiverName}</td>
                <td>{courier.courierType}</td>
                <td>{courier.trackingNumber}</td>
                <td>{format(new Date(courier.receivedDate), 'MMM dd, yyyy')}</td>
                <td>
                  <select
                    value={courier.status}
                    onChange={(e) => handleStatusUpdate(courier.id, e.target.value)}
                    className={`status-select ${courier.status.toLowerCase()}`}
                  >
                    <option value="Received">Received</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon btn-edit" onClick={() => openModal(courier)}>
                      <FiEdit />
                    </button>
                    <button className="btn-icon btn-delete" onClick={() => handleDelete(courier.id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCourier ? 'Edit Courier' : 'Add Courier Entry'}</h3>
              <button className="close-btn" onClick={closeModal}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Sender Name</label>
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Receiver Name</label>
                <input
                  type="text"
                  value={formData.receiverName}
                  onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Courier Type</label>
                <input
                  type="text"
                  value={formData.courierType}
                  onChange={(e) => setFormData({ ...formData, courierType: e.target.value })}
                  placeholder="e.g., FedEx, DHL, Blue Dart"
                  required
                />
              </div>
              {editingCourier && (
                <div className="form-group">
                  <label>Tracking Number (Auto-generated)</label>
                  <input
                    type="text"
                    value={formData.trackingNumber}
                    disabled
                    style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: '#6b7280' }}>Tracking number is automatically generated and cannot be changed</small>
                </div>
              )}
              {!editingCourier && (
                <div className="info-box" style={{ 
                  padding: '12px', 
                  backgroundColor: '#dbeafe', 
                  borderRadius: '6px', 
                  marginBottom: '15px',
                  fontSize: '14px',
                  color: '#1e40af'
                }}>
                  ℹ️ Tracking number will be automatically generated after creation
                </div>
              )}
              <div className="form-group">
                <label>Remarks</label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCourier ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourierManagement;
