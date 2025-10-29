import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../utils/api';
import './HomePage.css';

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        const allEvents = response.data;
        
        // Filter featured events
        const featured = allEvents.filter(event => event.featured).slice(0, 3);
        
        // Get upcoming events (events with date >= today)
        const today = new Date().toISOString().split('T')[0];
        const upcoming = allEvents
          .filter(event => event.date >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 6);
        
        setFeaturedEvents(featured);
        setUpcomingEvents(upcoming);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to College Events</h1>
          <p>Discover, register, and participate in exciting college events</p>
          <div className="hero-buttons">
            <Link to="/events" className="btn btn-primary">Browse Events</Link>
            <Link to="/register" className="btn btn-secondary">Get Started</Link>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="introduction">
        <div className="container">
          <h2>About Our Event Program</h2>
          <p>
            Our college is committed to providing a vibrant campus life through diverse events
            that cater to academic, cultural, social, and recreational interests. Whether you're
            interested in technology conferences, cultural festivals, sports competitions, or
            career fairs, we have something for everyone.
          </p>
          <p>
            Join thousands of students, organizers, and college staff in creating memorable experiences
            and building a strong community. Register for events, connect with peers, and make the
            most of your college journey.
          </p>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="featured-events">
          <div className="container">
            <h2>Featured Events</h2>
            <div className="events-grid">
              {featuredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="upcoming-events">
          <div className="container">
            <div className="section-header">
              <h2>Upcoming Events</h2>
              <Link to="/events" className="view-all">View All Events →</Link>
            </div>
            <div className="events-grid">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}
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
      <img src={event.image || 'https://via.placeholder.com/400x200'} alt={event.title} />
      <div className="event-card-content">
        <span className="event-category">{event.category}</span>
        <h3>{event.title}</h3>
        <p className="event-date">
          📅 {formatDate(event.date)} at {event.time}
        </p>
        <p className="event-location">📍 {event.location}</p>
        <p className="event-description">{event.description}</p>
        <Link to={`/events/${event.id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

