import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent, getRegistrations, createRegistration, deleteRegistration } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './EventDetailsPage.css';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStudent, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEvent(id);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Event not found');
      } finally {
        setLoading(false);
      }
    };

    const fetchRegistrations = async () => {
      try {
        const regResponse = await getRegistrations({ eventId: id });
        const allRegs = regResponse.data;
        setRegistrations(allRegs);
        
        // Check if current user is registered
        if (user && isStudent) {
          const userReg = allRegs.find(reg => reg.userId === user.id);
          setRegistration(userReg || null);
        }
      } catch (error) {
        console.error('Error fetching registrations:', error);
      }
    };

    fetchEvent();
    if (user) {
      fetchRegistrations();
    }
  }, [id, user, isStudent]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isStudent) {
      setError('Only students can register for events');
      return;
    }

    try {
      // Check if already registered
      if (registration) {
        setError('You are already registered for this event');
        return;
      }

      // Check capacity
      if (registrations.length >= event.maxCapacity) {
        setError('This event is full');
        return;
      }

      const registrationData = {
        eventId: parseInt(id),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        registeredAt: new Date().toISOString(),
        status: 'confirmed',
      };

      await createRegistration(registrationData);
      setSuccess('Successfully registered for this event!');
      setError('');
      
      // Refresh registrations
      const regResponse = await getRegistrations({ eventId: id });
      setRegistrations(regResponse.data);
      setRegistration(registrationData);
    } catch (error) {
      console.error('Error registering:', error);
      setError('Failed to register. Please try again.');
      setSuccess('');
    }
  };

  const handleCancelRegistration = async () => {
    if (!registration) return;

    try {
      await deleteRegistration(registration.id);
      setSuccess('Registration cancelled successfully');
      setError('');
      setRegistration(null);
      
      // Refresh registrations
      const regResponse = await getRegistrations({ eventId: id });
      setRegistrations(regResponse.data);
    } catch (error) {
      console.error('Error cancelling registration:', error);
      setError('Failed to cancel registration. Please try again.');
      setSuccess('');
    }
  };

  if (loading) {
    return <div className="loading">Loading event details...</div>;
  }

  if (!event) {
    return <div className="error">Event not found</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const remainingSpots = event.maxCapacity - registrations.length;
  const isFull = registrations.length >= event.maxCapacity;

  return (
    <div className="event-details-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Back to Events
        </button>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="event-details">
          <div className="event-image">
            <img 
              src={event.image || 'https://via.placeholder.com/800x400'} 
              alt={event.title} 
            />
          </div>

          <div className="event-info">
            <div className="event-header">
              <span className="event-category">{event.category}</span>
              {event.featured && <span className="event-featured">⭐ Featured</span>}
            </div>

            <h1>{event.title}</h1>

            <div className="event-meta">
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <div>
                  <strong>Date:</strong> {formatDate(event.date)}
                </div>
              </div>
              <div className="meta-item">
                <span className="meta-icon">🕐</span>
                <div>
                  <strong>Time:</strong> {event.time}
                </div>
              </div>
              <div className="meta-item">
                <span className="meta-icon">📍</span>
                <div>
                  <strong>Location:</strong> {event.location}
                </div>
              </div>
              <div className="meta-item">
                <span className="meta-icon">👤</span>
                <div>
                  <strong>Organizer:</strong> {event.organizerName}
                </div>
              </div>
              <div className="meta-item">
                <span className="meta-icon">👥</span>
                <div>
                  <strong>Capacity:</strong> {registrations.length} / {event.maxCapacity} registered
                  {isFull && <span className="full-badge"> (Full)</span>}
                </div>
              </div>
            </div>

            <div className="event-description">
              <h2>Description</h2>
              <p>{event.description}</p>
            </div>

            {isStudent && (
              <div className="event-actions">
                {registration ? (
                  <div className="registration-status">
                    <p className="registered-message">✓ You are registered for this event</p>
                    <button 
                      onClick={handleCancelRegistration} 
                      className="btn btn-danger"
                    >
                      Cancel Registration
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleRegister} 
                    className="btn btn-primary"
                    disabled={isFull}
                  >
                    {isFull ? 'Event Full' : 'Register for Event'}
                  </button>
                )}
              </div>
            )}

            {!isAuthenticated && (
              <div className="event-actions">
                <p>Please log in as a student to register for this event.</p>
                <button 
                  onClick={() => navigate('/login')} 
                  className="btn btn-primary"
                >
                  Login to Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;

