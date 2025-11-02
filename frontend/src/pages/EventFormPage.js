import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEvent, createEvent, updateEvent } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/common/ProtectedRoute';
import './EventFormPage.css';

const EventFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Technology',
    maxCapacity: 100,
    featured: false,
    image: 'https://via.placeholder.com/400x200',
    course: '',
  });

  useEffect(() => {
    if (isEditing) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await getEvent(id);
      const event = response.data;
      
      // Check if user owns this event (unless admin)
      if (user.role !== 'admin' && event.organizerId !== user.id) {
        navigate('/dashboard/organizer');
        return;
      }

      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        category: event.category,
        maxCapacity: event.maxCapacity,
        featured: event.featured || false,
        image: event.image || 'https://via.placeholder.com/400x200',
        course: event.course || '',
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Event not found');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Validation
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location) {
      setError('Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    if (new Date(formData.date) < new Date().toISOString().split('T')[0]) {
      setError('Event date cannot be in the past');
      setSubmitting(false);
      return;
    }

    try {
      const eventData = {
        ...formData,
        maxCapacity: parseInt(formData.maxCapacity),
        organizerId: user.id,
        organizerName: user.name,
        createdAt: isEditing ? undefined : new Date().toISOString(),
      };

      if (isEditing) {
        await updateEvent(id, eventData);
      } else {
        await createEvent(eventData);
      }

      navigate('/dashboard/organizer');
    } catch (error) {
      console.error('Error saving event:', error);
      setError('Failed to save event. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading event...</div>;
  }

  return (
    <ProtectedRoute requiredRole={user?.role === 'admin' ? null : 'organizer'}>
      <div className="event-form-page">
        <div className="container">
          <h1>{isEditing ? 'Edit Event' : 'Create New Event'}</h1>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="event-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Event Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter event title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="Technology">Technology</option>
                  <option value="Sports">Sports</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Career">Career</option>
                  <option value="Academic">Academic</option>
                  <option value="Social">Social</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Enter event description"
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Time *</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Enter event location"
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxCapacity">Maximum Capacity *</label>
                <input
                  type="number"
                  id="maxCapacity"
                  name="maxCapacity"
                  value={formData.maxCapacity}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="course">Target Course *</label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              >
                <option value="">Select target course</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Business Administration">Business Administration</option>
                <option value="Medicine">Medicine</option>
                <option value="Law">Law</option>
                <option value="Arts">Arts</option>
                <option value="Science">Science</option>
                <option value="Commerce">Commerce</option>
              </select>
              <small className="form-hint">
                Only students enrolled in this course can register for this event.
              </small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="image">Image URL</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  Featured Event
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/dashboard/organizer')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EventFormPage;

