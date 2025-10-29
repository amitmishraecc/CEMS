import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRegistrations, deleteRegistration } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await getRegistrations();
      // Filter registrations by userId (JSON-Server doesn't support nested filtering)
      const userRegs = response.data.filter(reg => reg.userId === user.id);
      
      // Fetch event details for each registration
      const regsWithEvents = await Promise.all(
        userRegs.map(async (reg) => {
          try {
            const eventResponse = await fetch(`http://localhost:3001/events/${reg.eventId}`);
            const eventData = await eventResponse.json();
            return { ...reg, event: eventData };
          } catch (error) {
            console.error(`Error fetching event ${reg.eventId}:`, error);
            return { ...reg, event: null };
          }
        })
      );
      
      setRegistrations(regsWithEvents);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (registrationId) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) {
      return;
    }

    try {
      await deleteRegistration(registrationId);
      setRegistrations(registrations.filter(reg => reg.id !== registrationId));
    } catch (error) {
      console.error('Error cancelling registration:', error);
      alert('Failed to cancel registration. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return <div className="loading">Loading your registrations...</div>;
  }

  return (
    <ProtectedRoute requiredRole="student">
      <div className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <h1>Student Dashboard</h1>
            <p>Welcome, {user?.name}!</p>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>{registrations.length}</h3>
              <p>Registered Events</p>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>My Event Registrations</h2>
              <Link to="/events" className="btn btn-primary">
                Browse More Events
              </Link>
            </div>

            {registrations.length === 0 ? (
              <div className="empty-state">
                <p>You haven't registered for any events yet.</p>
                <Link to="/events" className="btn btn-primary">
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="registrations-list">
                {registrations.map(registration => (
                  <div key={registration.id} className="registration-card">
                    {registration.event ? (
                      <>
                        <div className="card-header">
                          <h3>{registration.event.title}</h3>
                          <span className="status-badge">{registration.status}</span>
                        </div>
                        <div className="card-body">
                          <p><strong>Category:</strong> {registration.event.category}</p>
                          <p><strong>Date:</strong> {formatDate(registration.event.date)} at {registration.event.time}</p>
                          <p><strong>Location:</strong> {registration.event.location}</p>
                          <p><strong>Registered on:</strong> {formatDate(registration.registeredAt)}</p>
                        </div>
                        <div className="card-actions">
                          <Link 
                            to={`/events/${registration.event.id}`} 
                            className="btn btn-secondary"
                          >
                            View Event
                          </Link>
                          <button
                            onClick={() => handleCancelRegistration(registration.id)}
                            className="btn btn-danger"
                          >
                            Cancel Registration
                          </button>
                        </div>
                      </>
                    ) : (
                      <p>Event information unavailable</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StudentDashboard;

