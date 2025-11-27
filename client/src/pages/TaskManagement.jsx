import React, { useState, useEffect } from 'react';
import { taskAPI, userAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit, FiTrash2, FiX, FiEye, FiPaperclip } from 'react-icons/fi';
import { format } from 'date-fns';
import './TaskManagement.css';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignedTo: []
  });

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getAll();
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await userAPI.getEmployees();
      setEmployees(response.data);
    } catch (error) {
      toast.error('Failed to fetch employees');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskAPI.update(editingTask.id, formData);
        toast.success('Task updated successfully');
      } else {
        await taskAPI.create(formData);
        toast.success('Task created successfully');
      }
      fetchTasks();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.delete(id);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd'),
        assignedTo: task.assignedUsers?.map(u => u.id) || []
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        assignedTo: []
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const openDetailsModal = async (taskId) => {
    try {
      const response = await taskAPI.getById(taskId);
      setSelectedTask(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      toast.error('Failed to fetch task details');
    }
  };

  return (
    <div className="task-management">
      <div className="page-header">
        <h2>Task Management</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FiPlus /> Create Task
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
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
                  {task.assignedUsers?.map(u => u.fullName).join(', ') || 'Unassigned'}
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon btn-view" onClick={() => openDetailsModal(task.id)} title="View Details & Updates">
                      <FiEye />
                    </button>
                    <button className="btn-icon btn-edit" onClick={() => openModal(task)} title="Edit Task">
                      <FiEdit />
                    </button>
                    <button className="btn-icon btn-delete" onClick={() => handleDelete(task.id)} title="Delete Task">
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
              <h3>{editingTask ? 'Edit Task' : 'Create Task'}</h3>
              <button className="close-btn" onClick={closeModal}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select
                  multiple
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({
                    ...formData,
                    assignedTo: Array.from(e.target.selectedOptions, option => parseInt(option.value))
                  })}
                  className="multi-select"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                  ))}
                </select>
                <small>Hold Ctrl/Cmd to select multiple</small>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Update' : 'Create'}
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
                <h4>Assigned To</h4>
                <p>{selectedTask.assignedUsers?.map(u => u.fullName).join(', ') || 'Unassigned'}</p>
              </div>
              
              <div className="detail-section">
                <h4>Employee Updates & Comments</h4>
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
                              Hours Worked: {update.hoursWorked}
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
                  <p>No updates yet from employees</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
