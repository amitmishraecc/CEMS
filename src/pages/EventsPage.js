import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../utils/api';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: '',
    date: '',
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        const allEvents = response.data;
        // Sort events by date (upcoming first)
        const sorted = allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sorted);
        setFilteredEvents(sorted);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = [...events];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        event =>
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(event => 
        event.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Date filter
    if (filters.date) {
      filtered = filtered.filter(event => event.date === filters.date);
    }

    setFilteredEvents(filtered);
  }, [filters, events]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      location: '',
      date: '',
    });
  };

  const categories = [...new Set(events.map(event => event.category))];
  const locations = [...new Set(events.map(event => event.location))];

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="events-page">
      <div className="container">
        <h1>All Events</h1>

        {/* Filters */}
        <div className="filters">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="filter-select"
            >
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="filter-input"
            />
          </div>

          <button onClick={clearFilters} className="btn-clear">
            Clear Filters
          </button>
        </div>

        {/* Events Grid */}
        <div className="events-info">
          <p>Found {filteredEvents.length} event(s)</p>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <p>No events found matching your criteria.</p>
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="event-card">
      <img 
        src={event.image || 'https://via.placeholder.com/400x200'} 
        alt={event.title} 
      />
      <div className="event-card-content">
        <span className="event-category">{event.category}</span>
        {event.featured && <span className="event-featured">⭐ Featured</span>}
        <h3>{event.title}</h3>
        <p className="event-date">
          📅 {formatDate(event.date)} at {event.time}
        </p>
        <p className="event-location">📍 {event.location}</p>
        <p className="event-description">{event.description}</p>
        <p className="event-organizer">👤 {event.organizerName}</p>
        <Link to={`/events/${event.id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventsPage;

