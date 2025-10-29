import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isStudent, isOrganizer, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          College Events
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/events" className="navbar-link">Events</Link>
          <Link to="/faq" className="navbar-link">FAQ</Link>
          <Link to="/contact" className="navbar-link">Contact</Link>
          
          {isAuthenticated ? (
            <>
              {isStudent && <Link to="/dashboard/student" className="navbar-link">Dashboard</Link>}
              {isOrganizer && <Link to="/dashboard/organizer" className="navbar-link">Dashboard</Link>}
              {isAdmin && <Link to="/dashboard/admin" className="navbar-link">Dashboard</Link>}
              <div className="navbar-user">
                <span className="navbar-username">Hello, {user?.name}</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </div>
            </>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

