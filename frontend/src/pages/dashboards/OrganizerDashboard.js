import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEvents, deleteEvent, getRegistrations } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import './Dashboard.css';

const OrganizerDashboard = () => {
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.approved === false) {
      // Show pending approval message
    } else {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      // Filter events by organizer ID (JSON-Server doesn't support nested filtering)
      const organizerEvents = response.data.filter(event => event.organizerId === user.id);
      setEvents(organizerEvents);

      // Fetch registrations for each event
      const regsMap = {};
      try {
        const allRegsResponse = await getRegistrations();
        const allRegs = allRegsResponse.data;
        for (const event of organizerEvents) {
          // Filter registrations by eventId (JSON-Server doesn't support nested filtering)
          regsMap[event.id] = allRegs.filter(reg => reg.eventId === event.id);
        }
      } catch (error) {
        console.error('Error fetching registrations:', error);
      }
      setRegistrations(regsMap);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await deleteEvent(eventId);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
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

  if (user?.approved === false) {
    return (
      <ProtectedRoute requiredRole="organizer">
        <div className="dashboard">
          <div className="container">
            <div className="pending-approval">
              <h2>Account Pending Approval</h2>
              <p>Your organizer account is waiting for admin approval. You'll be able to create and manage events once approved.</p>
              <p>Please contact the admin or wait for approval.</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (loading) {
    return <div className="loading">Loading your events...</div>;
  }

  return (
    <ProtectedRoute requiredRole="organizer">
      <div className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <h1>Organizer Dashboard</h1>
            <p>Welcome, {user?.name}!</p>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>{events.length}</h3>
              <p>My Events</p>
            </div>
            <div className="stat-card">
              <h3>
                {Object.values(registrations).reduce((total, regs) => total + regs.length, 0)}
              </h3>
              <p>Total Registrations</p>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>My Events</h2>
              <Link to="/events/create" className="btn btn-primary">
                Create New Event
              </Link>
            </div>

            {events.length === 0 ? (
              <div className="empty-state">
                <p>You haven't created any events yet.</p>
                <Link to="/events/create" className="btn btn-primary">
                  Create Your First Event
                </Link>
              </div>
            ) : (
              <div className="events-list">
                {events.map(event => (
                  <div key={event.id} className="event-card">
                    <div className="card-header">
                      <div>
                        <h3>{event.title}</h3>
                        <span className="event-category">{event.category}</span>
                      </div>
                      <span className="registrations-count">
                        {registrations[event.id]?.length || 0} / {event.maxCapacity} registered
                      </span>
                    </div>
                    <div className="card-body">
                      <p><strong>Date:</strong> {formatDate(event.date)} at {event.time}</p>
                      <p><strong>Location:</strong> {event.location}</p>
                      <p>{event.description}</p>
                    </div>
                    <div className="card-actions">
                      <Link 
                        to={`/events/${event.id}`} 
                        className="btn btn-secondary"
                      >
                        View Event
                      </Link>
                      <Link 
                        to={`/events/${event.id}/edit`} 
                        className="btn btn-secondary"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                      <Link 
                        to={`/events/${event.id}/registrants`} 
                        className="btn btn-primary"
                      >
                        Manage Registrants ({registrations[event.id]?.length || 0})
                      </Link>
                      <Link 
                        to={`/events/${event.id}/report`} 
                        className="btn btn-secondary"
                      >
                        View Report
                      </Link>
                    </div>
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

export default OrganizerDashboard;

