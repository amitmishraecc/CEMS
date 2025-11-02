import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEvent, getRegistrations, updateRegistration, getUsers } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/common/ProtectedRoute';
import './EventRegistrantsPage.css';

const EventRegistrantsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [eventRes, regsRes] = await Promise.all([
        getEvent(id),
        getRegistrations({ eventId: id }),
      ]);

      const eventData = eventRes.data;
      
      // Check if user owns this event (unless admin)
      if (user.role !== 'admin' && eventData.organizerId !== user.id) {
        navigate('/dashboard/organizer');
        return;
      }

      setEvent(eventData);
      
      // Fetch user details for each registration
      const regsWithDetails = await Promise.all(
        regsRes.data.map(async (reg) => {
          try {
            const userRes = await getUsers();
            const userData = userRes.data.find(u => u.id === reg.userId);
            return { ...reg, user: userData };
          } catch (error) {
            return { ...reg, user: null };
          }
        })
      );
      
      setRegistrations(regsWithDetails);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load registrants');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (registrationId) => {
    try {
      await updateRegistration(registrationId, { status: 'approved' });
      setRegistrations(registrations.map(reg => 
        reg.id === registrationId ? { ...reg, status: 'approved' } : reg
      ));
      setSuccess('Registration approved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error approving registration:', error);
      setError('Failed to approve registration');
    }
  };

  const handleReject = async (registrationId) => {
    try {
      await updateRegistration(registrationId, { status: 'rejected' });
      setRegistrations(registrations.map(reg => 
        reg.id === registrationId ? { ...reg, status: 'rejected' } : reg
      ));
      setSuccess('Registration rejected');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error rejecting registration:', error);
      setError('Failed to reject registration');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingRegs = registrations.filter(r => r.status === 'pending');
  const approvedRegs = registrations.filter(r => r.status === 'approved');
  const rejectedRegs = registrations.filter(r => r.status === 'rejected');

  if (loading) {
    return <div className="loading">Loading registrants...</div>;
  }

  if (!event) {
    return <div className="error">Event not found</div>;
  }

  return (
    <ProtectedRoute requiredRole={user?.role === 'admin' ? null : 'organizer'}>
      <div className="event-registrants-page">
        <div className="container">
          <div className="page-header">
            <button onClick={() => navigate('/dashboard/organizer')} className="btn-back">
              ← Back to Dashboard
            </button>
            <h1>Event Registrants</h1>
            <h2>{event.title}</h2>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="registrants-stats">
            <div className="stat-card">
              <h3>{pendingRegs.length}</h3>
              <p>Pending</p>
            </div>
            <div className="stat-card approved">
              <h3>{approvedRegs.length}</h3>
              <p>Approved</p>
            </div>
            <div className="stat-card rejected">
              <h3>{rejectedRegs.length}</h3>
              <p>Rejected</p>
            </div>
            <div className="stat-card">
              <h3>{registrations.length} / {event.maxCapacity}</h3>
              <p>Total Registrations</p>
            </div>
          </div>

          <div className="registrants-section">
            <div className="section-tabs">
              <button className="tab active">All ({registrations.length})</button>
            </div>

            {registrations.length === 0 ? (
              <div className="empty-state">
                <p>No registrations yet for this event.</p>
              </div>
            ) : (
              <div className="registrants-list">
                {registrations.map(reg => (
                  <div key={reg.id} className={`registrant-card ${reg.status}`}>
                    <div className="card-header">
                      <div>
                        <h3>{reg.userName}</h3>
                        <p className="email">{reg.userEmail}</p>
                        {reg.user && reg.user.course && (
                          <p className="course">Course: {reg.user.course}</p>
                        )}
                      </div>
                      <span className={`status-badge ${reg.status}`}>
                        {reg.status === 'pending' ? 'Pending' : 
                         reg.status === 'approved' ? 'Approved' : 'Rejected'}
                      </span>
                    </div>
                    <div className="card-body">
                      <p><strong>Registered on:</strong> {formatDate(reg.registeredAt)}</p>
                      {reg.user && (
                        <>
                          <p><strong>Username:</strong> {reg.user.username}</p>
                        </>
                      )}
                    </div>
                    {reg.status === 'pending' && (
                      <div className="card-actions">
                        <button
                          onClick={() => handleApprove(reg.id)}
                          className="btn btn-success"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(reg.id)}
                          className="btn btn-danger"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {reg.status === 'approved' && (
                      <div className="card-actions">
                        <button
                          onClick={() => handleReject(reg.id)}
                          className="btn btn-danger"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {reg.status === 'rejected' && (
                      <div className="card-actions">
                        <button
                          onClick={() => handleApprove(reg.id)}
                          className="btn btn-success"
                        >
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="page-actions">
            <Link to={`/events/${id}/report`} className="btn btn-primary">
              View Event Report
            </Link>
            <Link to={`/events/${id}`} className="btn btn-secondary">
              View Event
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EventRegistrantsPage;

