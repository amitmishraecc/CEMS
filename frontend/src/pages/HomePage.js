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
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">Welcome to</span>
            <span className="title-main">LIET College Events</span>
          </h1>
          <p className="hero-subtitle">Discover, register, and participate in exciting college events that shape your campus experience</p>
          <div className="hero-buttons">
            <Link to="/events" className="btn btn-primary btn-hero">
              <span>Browse Events</span>
              <span className="btn-icon">→</span>
            </Link>
            <Link to="/register" className="btn btn-secondary btn-hero">
              <span>Get Started</span>
            </Link>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">🎉</div>
              <div className="stat-number">{upcomingEvents.length}+</div>
              <div className="stat-label">Upcoming Events</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-number">{featuredEvents.length}</div>
              <div className="stat-label">Featured Events</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">👥</div>
              <div className="stat-number">1000+</div>
              <div className="stat-label">Active Participants</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🏆</div>
              <div className="stat-number">50+</div>
              <div className="stat-label">Event Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="introduction">
        <div className="container">
          <div className="intro-content">
            <h2 className="section-title">
              <span className="title-accent">About</span> Our Event Program
            </h2>
            <div className="intro-text">
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
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🎓</div>
                <h3>Academic Excellence</h3>
                <p>Conferences, workshops, and seminars to enhance your learning</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎭</div>
                <h3>Cultural Events</h3>
                <p>Celebrate diversity through festivals and cultural programs</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <h3>Tech Innovation</h3>
                <p>Hackathons, tech talks, and innovation challenges</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🤝</div>
                <h3>Networking</h3>
                <p>Connect with peers, mentors, and industry professionals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="featured-events">
          <div className="container">
            <div className="section-header-centered">
              <span className="section-badge">Featured</span>
              <h2 className="section-title">
                <span className="title-accent">Featured</span> Events
              </h2>
              <p className="section-subtitle">Don't miss out on these exciting events</p>
            </div>
            <div className="events-grid">
              {featuredEvents.map(event => (
                <EventCard key={event.id} event={event} featured={true} />
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
              <div>
                <span className="section-badge">Upcoming</span>
                <h2 className="section-title">
                  <span className="title-accent">Upcoming</span> Events
                </h2>
                <p className="section-subtitle">See what's coming next</p>
              </div>
              <Link to="/events" className="view-all">
                <span>View All Events</span>
                <span className="arrow-icon">→</span>
              </Link>
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

const EventCard = ({ event, featured = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`event-card ${featured ? 'featured' : ''}`}>
      <div className="event-card-image-wrapper">
        <img src={event.image || 'https://via.placeholder.com/400x200'} alt={event.title} />
        {featured && <span className="featured-badge">⭐ Featured</span>}
        <div className="event-card-overlay"></div>
      </div>
      <div className="event-card-content">
        <span className="event-category">{event.category}</span>
        <h3>{event.title}</h3>
        <div className="event-meta">
          <p className="event-date">
            <span className="meta-icon">📅</span>
            {formatDate(event.date)} at {event.time}
          </p>
          <p className="event-location">
            <span className="meta-icon">📍</span>
            {event.location}
          </p>
        </div>
        <p className="event-description">{event.description}</p>
        <Link to={`/events/${event.id}`} className="btn btn-primary btn-card">
          <span>View Details</span>
          <span className="btn-icon">→</span>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

