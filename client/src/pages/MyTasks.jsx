import React, { useState, useEffect } from 'react';
import { taskAPI, taskUpdateAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiMessageSquare, FiX, FiPaperclip, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';
import './TaskManagement.css';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updateData, setUpdateData] = useState({
    comment: '',
    status: 'Pending',
    hoursWorked: 0
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      const response = await taskAPI.getMyTasks();
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  };

  const openUpdateModal = (task) => {
    setSelectedTask(task);
    setUpdateData({
      comment: '',
      status: task.status,
      hoursWorked: 0
    });
    setShowUpdateModal(true);
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!updateData.comment || updateData.comment.trim().length < 5) {
      toast.error('Comment must be at least 5 characters long');
      return;
    }

    if (updateData.hoursWorked < 0 || updateData.hoursWorked > 24) {
      toast.error('Hours worked must be between 0 and 24');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('taskId', selectedTask.id);
      formData.append('comment', updateData.comment.trim());
      formData.append('status', updateData.status);
      formData.append('hoursWorked', updateData.hoursWorked);
      
      selectedFiles.forEach(file => {
        formData.append('attachments', file);
      });

      await taskUpdateAPI.add(formData);
      toast.success('Task updated successfully');
      fetchMyTasks();
      setShowUpdateModal(false);
      setSelectedFiles([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  const openDetailsModal = (task) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  return (
    <div className="task-management">
      <div className="page-header">
        <h2>My Tasks</h2>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description?.substring(0, 50)}...</td>
                <td>
                  <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${task.status.toLowerCase()}`}>
                    {task.status}
                  </span>
                </td>
                <td>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</td>
                <td>
                  <button
                    className="btn-icon btn-view"
                    onClick={() => openDetailsModal(task)}
                    title="View Details"
                  >
                    <FiEye />
                  </button>
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => openUpdateModal(task)}
                    title="Add Update"
                  >
                    <FiMessageSquare />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showUpdateModal && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Task: {selectedTask?.title}</h3>
              <button className="close-btn" onClick={() => setShowUpdateModal(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmitUpdate}>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="In-Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Work Log / Comment (minimum 5 characters)</label>
                <textarea
                  value={updateData.comment}
                  onChange={(e) => setUpdateData({ ...updateData, comment: e.target.value })}
                  rows="4"
                  placeholder="Describe what you worked on... (minimum 5 characters)"
                  required
                  minLength={5}
                />
                {updateData.comment && updateData.comment.length < 5 && (
                  <small style={{ color: '#ef4444', fontSize: '12px' }}>
                    {5 - updateData.comment.length} more character{5 - updateData.comment.length !== 1 ? 's' : ''} required
                  </small>
                )}
              </div>
              <div className="form-group">
                <label>Hours Worked</label>
                <input
                  type="number"
                  step="0.5"
                  value={updateData.hoursWorked}
                  onChange={(e) => setUpdateData({ ...updateData, hoursWorked: parseFloat(e.target.value) })}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>
                  <FiPaperclip /> Attach Files (Optional)
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                />
                {selectedFiles.length > 0 && (
                  <div style={{ marginTop: '10px', fontSize: '14px' }}>
                    Selected: {selectedFiles.map(f => f.name).join(', ')}
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailsModal && selectedTask && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Task Details: {selectedTask.title}</h3>
              <button className="close-btn" onClick={() => setShowDetailsModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="task-details">
              <div className="detail-section">
                <h4>Description</h4>
                <p>{selectedTask.description}</p>
              </div>
              <div className="detail-row">
                <div className="detail-item">
                  <strong>Priority:</strong>
                  <span className={`priority-badge ${selectedTask.priority.toLowerCase()}`}>
                    {selectedTask.priority}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Status:</strong>
                  <span className={`status-badge ${selectedTask.status.toLowerCase()}`}>
                    {selectedTask.status}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Due Date:</strong>
                  <span>{format(new Date(selectedTask.dueDate), 'MMM dd, yyyy')}</span>
                </div>
              </div>
              
              <div className="detail-section">
                <h4>Updates History</h4>
                {selectedTask.updates && selectedTask.updates.length > 0 ? (
                  <div className="updates-list">
                    {selectedTask.updates.map((update) => (
                      <div key={update.id} className="update-item">
                        <div className="update-header">
                          <strong>{update.user?.fullName}</strong>
                          <span className="update-date">
                            {format(new Date(update.createdAt), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </div>
                        <div className="update-status">
                          Status: <span className={`status-badge ${update.status.toLowerCase()}`}>
                            {update.status}
                          </span>
                          {update.hoursWorked > 0 && (
                            <span style={{ marginLeft: '10px' }}>
                              Hours: {update.hoursWorked}
                            </span>
                          )}
                        </div>
                        <p className="update-comment">{update.comment}</p>
                        {update.attachments && Array.isArray(update.attachments) && update.attachments.length > 0 && (
                          <div className="update-attachments">
                            <FiPaperclip /> Attachments:
                            {update.attachments.map((file, idx) => (
                              <a
                                key={idx}
                                href={`https://tms-bj16.onrender.com/${file.path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="attachment-link"
                              >
                                {file.originalName}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No updates yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
