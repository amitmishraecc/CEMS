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
  const allOrganizers = users.filter(u => u.role === 'organizer');
  const allStudents = users.filter(u => u.role === 'student');
  const totalUsers = users.length;
  const totalEvents = events.length;
  const totalRegistrations = registrations.length;
  
  // Get activities
  const recentEvents = events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
  const recentRegistrations = registrations.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt)).slice(0, 10);
  
  // Get events per organizer
  const eventsPerOrganizer = {};
  events.forEach(event => {
    if (!eventsPerOrganizer[event.organizerId]) {
      eventsPerOrganizer[event.organizerId] = [];
    }
    eventsPerOrganizer[event.organizerId].push(event);
  });
  
  // Get registrations per student
  const registrationsPerStudent = {};
  registrations.forEach(reg => {
    if (!registrationsPerStudent[reg.userId]) {
      registrationsPerStudent[reg.userId] = [];
    }
    registrationsPerStudent[reg.userId].push(reg);
  });

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
              className={activeTab === 'organizers' ? 'active' : ''}
              onClick={() => setActiveTab('organizers')}
            >
              Organizers ({allOrganizers.length})
            </button>
            <button
              className={activeTab === 'students' ? 'active' : ''}
              onClick={() => setActiveTab('students')}
            >
              Students ({allStudents.length})
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
            <button
              className={activeTab === 'activities' ? 'active' : ''}
              onClick={() => setActiveTab('activities')}
            >
              Activities
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

          {activeTab === 'organizers' && (
            <div className="dashboard-section">
              <h2>All Organizers ({allOrganizers.length})</h2>
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Username</th>
                      <th>Status</th>
                      <th>Events Created</th>
                      <th>Total Registrations</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrganizers.map(org => {
                      const orgEvents = eventsPerOrganizer[org.id] || [];
                      const totalRegs = registrations.filter(r => 
                        orgEvents.some(e => e.id === r.eventId)
                      ).length;
                      return (
                        <tr key={org.id}>
                          <td>{org.id}</td>
                          <td>{org.name}</td>
                          <td>{org.email}</td>
                          <td>{org.username}</td>
                          <td>
                            {org.approved ? (
                              <span className="status-badge approved">Approved</span>
                            ) : (
                              <span className="status-badge pending">Pending</span>
                            )}
                          </td>
                          <td>{orgEvents.length}</td>
                          <td>{totalRegs}</td>
                          <td>{new Date(org.createdAt).toLocaleDateString()}</td>
                          <td>
                            {!org.approved && (
                              <button
                                onClick={() => handleApproveOrganizer(org.id)}
                                className="btn btn-sm btn-primary"
                              >
                                Approve
                              </button>
                            )}
                            {org.id !== user.id && (
                              <button
                                onClick={() => handleDeleteUser(org.id)}
                                className="btn btn-sm btn-danger"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="dashboard-section">
              <h2>All Students ({allStudents.length})</h2>
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Username</th>
                      <th>Course</th>
                      <th>Registrations</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allStudents.map(student => {
                      const studentRegs = registrationsPerStudent[student.id] || [];
                      return (
                        <tr key={student.id}>
                          <td>{student.id}</td>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{student.username}</td>
                          <td>{student.course || 'N/A'}</td>
                          <td>
                            {studentRegs.length} ({studentRegs.filter(r => r.status === 'approved').length} approved)
                          </td>
                          <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                          <td>
                            {student.id !== user.id && (
                              <button
                                onClick={() => handleDeleteUser(student.id)}
                                className="btn btn-sm btn-danger"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'registrations' && (
            <div className="dashboard-section">
              <h2>All Registrations ({registrations.length})</h2>
              <div className="registrations-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>Event</th>
                      <th>Registered At</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map(reg => {
                      const event = events.find(e => e.id === reg.eventId);
                      return (
                        <tr key={reg.id}>
                          <td>{reg.id}</td>
                          <td>{reg.userName}</td>
                          <td>{reg.userEmail}</td>
                          <td>{reg.userCourse || 'N/A'}</td>
                          <td>{event ? event.title : `Event #${reg.eventId}`}</td>
                          <td>{new Date(reg.registeredAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge ${reg.status}`}>
                              {reg.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="dashboard-section">
              <h2>Recent Activities</h2>
              
              <div className="activities-grid">
                <div className="activity-section">
                  <h3>Recent Events Created</h3>
                  <div className="activity-list">
                    {recentEvents.length === 0 ? (
                      <p>No events created yet.</p>
                    ) : (
                      recentEvents.map(event => (
                        <div key={event.id} className="activity-item">
                          <div className="activity-icon">📅</div>
                          <div className="activity-content">
                            <strong>{event.organizerName}</strong> created event{' '}
                            <strong>{event.title}</strong>
                            <p className="activity-time">
                              {new Date(event.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="activity-section">
                  <h3>Recent Registrations</h3>
                  <div className="activity-list">
                    {recentRegistrations.length === 0 ? (
                      <p>No registrations yet.</p>
                    ) : (
                      recentRegistrations.map(reg => {
                        const event = events.find(e => e.id === reg.eventId);
                        return (
                          <div key={reg.id} className="activity-item">
                            <div className="activity-icon">👤</div>
                            <div className="activity-content">
                              <strong>{reg.userName}</strong> registered for{' '}
                              <strong>{event ? event.title : `Event #${reg.eventId}`}</strong>
                              <p className="activity-time">
                                {new Date(reg.registeredAt).toLocaleString()} - Status: {reg.status}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="activity-section full-width">
                <h3>System Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-box">
                    <h4>Organizers</h4>
                    <p className="stat-number">{allOrganizers.length}</p>
                    <p className="stat-detail">
                      {allOrganizers.filter(o => o.approved).length} approved,{' '}
                      {pendingOrganizers.length} pending
                    </p>
                  </div>
                  <div className="stat-box">
                    <h4>Students</h4>
                    <p className="stat-number">{allStudents.length}</p>
                    <p className="stat-detail">
                      {new Set(allStudents.map(s => s.course)).size} courses represented
                    </p>
                  </div>
                  <div className="stat-box">
                    <h4>Events</h4>
                    <p className="stat-number">{totalEvents}</p>
                    <p className="stat-detail">
                      {events.filter(e => new Date(e.date) >= new Date()).length} upcoming
                    </p>
                  </div>
                  <div className="stat-box">
                    <h4>Registrations</h4>
                    <p className="stat-number">{totalRegistrations}</p>
                    <p className="stat-detail">
                      {registrations.filter(r => r.status === 'approved').length} approved,{' '}
                      {registrations.filter(r => r.status === 'pending').length} pending
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;

