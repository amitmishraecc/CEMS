import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, updateUser, deleteUser, getEvents, deleteEvent, getRegistrations } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [usersRes, eventsRes, regsRes] = await Promise.all([
        getUsers(),
        getEvents(),
        getRegistrations(),
      ]);

      setUsers(usersRes.data);
      setEvents(eventsRes.data);
      setRegistrations(regsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrganizer = async (userId) => {
    try {
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) {
        alert('User not found');
        return;
      }
      await updateUser(userId, { ...userToUpdate, approved: true });
      setUsers(users.map(u => u.id === userId ? { ...u, approved: true } : u));
      alert('Organizer approved successfully!');
    } catch (error) {
      console.error('Error approving organizer:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to approve organizer: ${errorMessage}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to delete user: ${errorMessage}`);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await deleteEvent(eventId);
      setEvents(events.filter(e => e.id !== eventId));
      alert('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to delete event: ${errorMessage}`);
    }
  };

  const pendingOrganizers = users.filter(u => u.role === 'organizer' && !u.approved);
  const totalUsers = users.length;
  const totalEvents = events.length;
  const totalRegistrations = registrations.length;

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user?.name}!</p>
          </div>

          <div className="dashboard-tabs">
            <button
              className={activeTab === 'overview' ? 'active' : ''}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={activeTab === 'users' ? 'active' : ''}
              onClick={() => setActiveTab('users')}
            >
              Users ({pendingOrganizers.length > 0 && `+${pendingOrganizers.length} pending`})
            </button>
            <button
              className={activeTab === 'events' ? 'active' : ''}
              onClick={() => setActiveTab('events')}
            >
              Events
            </button>
            <button
              className={activeTab === 'registrations' ? 'active' : ''}
              onClick={() => setActiveTab('registrations')}
            >
              Registrations
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="dashboard-section">
              <h2>System Overview</h2>
              <div className="dashboard-stats">
                <div className="stat-card">
                  <h3>{totalUsers}</h3>
                  <p>Total Users</p>
                </div>
                <div className="stat-card">
                  <h3>{totalEvents}</h3>
                  <p>Total Events</p>
                </div>
                <div className="stat-card">
                  <h3>{totalRegistrations}</h3>
                  <p>Total Registrations</p>
                </div>
                <div className="stat-card alert-card">
                  <h3>{pendingOrganizers.length}</h3>
                  <p>Pending Approvals</p>
                </div>
              </div>

              {pendingOrganizers.length > 0 && (
                <div className="pending-approvals-section">
                  <h3>Pending Organizer Approvals</h3>
                  <div className="pending-list">
                    {pendingOrganizers.map(org => (
                      <div key={org.id} className="pending-card">
                        <div>
                          <strong>{org.name}</strong>
                          <p>{org.email}</p>
                        </div>
                        <button
                          onClick={() => handleApproveOrganizer(org.id)}
                          className="btn btn-primary"
                        >
                          Approve
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="dashboard-section">
              <h2>All Users</h2>
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role}`}>{u.role}</span>
                        </td>
                        <td>
                          {u.role === 'organizer' ? (
                            u.approved ? (
                              <span className="status-badge approved">Approved</span>
                            ) : (
                              <span className="status-badge pending">Pending</span>
                            )
                          ) : (
                            <span className="status-badge approved">Active</span>
                          )}
                        </td>
                        <td>
                          {u.role === 'organizer' && !u.approved && (
                            <button
                              onClick={() => handleApproveOrganizer(u.id)}
                              className="btn btn-sm btn-primary"
                            >
                              Approve
                            </button>
                          )}
                          {u.id !== user.id && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="btn btn-sm btn-danger"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2>All Events</h2>
                <Link to="/events/create" className="btn btn-primary">
                  Create Event
                </Link>
              </div>
              <div className="events-list">
                {events.map(event => (
                  <div key={event.id} className="event-card">
                    <div className="card-header">
                      <h3>{event.title}</h3>
                      <span className="event-category">{event.category}</span>
                    </div>
                    <div className="card-body">
                      <p><strong>Organizer:</strong> {event.organizerName}</p>
                      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                      <p>{event.description}</p>
                    </div>
                    <div className="card-actions">
                      <Link to={`/events/${event.id}`} className="btn btn-secondary">
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'registrations' && (
            <div className="dashboard-section">
              <h2>All Registrations</h2>
              <div className="registrations-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Event</th>
                      <th>Registered At</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.slice(0, 50).map(reg => (
                      <tr key={reg.id}>
                        <td>{reg.id}</td>
                        <td>{reg.userName}</td>
                        <td>Event #{reg.eventId}</td>
                        <td>{new Date(reg.registeredAt).toLocaleDateString()}</td>
                        <td>
                          <span className="status-badge">{reg.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;

