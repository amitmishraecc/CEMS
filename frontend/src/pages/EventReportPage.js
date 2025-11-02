import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEvent, getRegistrations, getUsers } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/common/ProtectedRoute';
import './EventReportPage.css';

const EventReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      setError('Failed to load event report');
    } finally {
      setLoading(false);
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

  const approvedRegs = registrations.filter(r => r.status === 'approved');
  const pendingRegs = registrations.filter(r => r.status === 'pending');
  const rejectedRegs = registrations.filter(r => r.status === 'rejected');

  // Group by course
  const registrationsByCourse = {};
  approvedRegs.forEach(reg => {
    const course = reg.user?.course || 'Unknown';
    if (!registrationsByCourse[course]) {
      registrationsByCourse[course] = [];
    }
    registrationsByCourse[course].push(reg);
  });

  if (loading) {
    return <div className="loading">Loading event report...</div>;
  }

  if (!event) {
    return <div className="error">Event not found</div>;
  }

  return (
    <ProtectedRoute requiredRole={user?.role === 'admin' ? null : 'organizer'}>
      <div className="event-report-page">
        <div className="container">
          <div className="page-header">
            <button onClick={() => navigate('/dashboard/organizer')} className="btn-back">
              ← Back to Dashboard
            </button>
            <h1>Event Report</h1>
            <h2>{event.title}</h2>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="report-summary">
            <div className="summary-card">
              <h3>Event Summary</h3>
              <div className="summary-grid">
                <div>
                  <strong>Event:</strong> {event.title}
                </div>
                <div>
                  <strong>Date:</strong> {formatDate(event.date + 'T' + event.time)}
                </div>
                <div>
                  <strong>Location:</strong> {event.location}
                </div>
                <div>
                  <strong>Category:</strong> {event.category}
                </div>
                <div>
                  <strong>Course:</strong> {event.course || 'All Courses'}
                </div>
                <div>
                  <strong>Capacity:</strong> {event.maxCapacity}
                </div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>{approvedRegs.length}</h3>
                <p>Approved Participants</p>
              </div>
              <div className="stat-card">
                <h3>{pendingRegs.length}</h3>
                <p>Pending Approvals</p>
              </div>
              <div className="stat-card">
                <h3>{rejectedRegs.length}</h3>
                <p>Rejected Registrations</p>
              </div>
              <div className="stat-card">
                <h3>{approvedRegs.length} / {event.maxCapacity}</h3>
                <p>Capacity Filled</p>
              </div>
              <div className="stat-card">
                <h3>{Math.round((approvedRegs.length / event.maxCapacity) * 100)}%</h3>
                <p>Capacity Usage</p>
              </div>
              <div className="stat-card">
                <h3>{Object.keys(registrationsByCourse).length}</h3>
                <p>Courses Represented</p>
              </div>
            </div>
          </div>

          <div className="report-section">
            <h3>Approved Participants Details</h3>
            {approvedRegs.length === 0 ? (
              <div className="empty-state">
                <p>No approved participants yet.</p>
              </div>
            ) : (
              <>
                <div className="participants-table-container">
                  <table className="participants-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Course</th>
                        <th>Registered At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedRegs.map(reg => (
                        <tr key={reg.id}>
                          <td>{reg.userName}</td>
                          <td>{reg.userEmail}</td>
                          <td>{reg.user?.username || 'N/A'}</td>
                          <td>{reg.user?.course || 'N/A'}</td>
                          <td>{formatDate(reg.registeredAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="course-breakdown">
                  <h4>Participants by Course</h4>
                  <div className="course-cards">
                    {Object.entries(registrationsByCourse).map(([course, regs]) => (
                      <div key={course} className="course-card">
                        <h5>{course}</h5>
                        <p className="count">{regs.length} participant{regs.length !== 1 ? 's' : ''}</p>
                        <ul>
                          {regs.map(reg => (
                            <li key={reg.id}>{reg.userName} ({reg.userEmail})</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="page-actions">
            <Link to={`/events/${id}/registrants`} className="btn btn-primary">
              Manage Registrants
            </Link>
            <Link to={`/events/${id}`} className="btn btn-secondary">
              View Event
            </Link>
            <button 
              onClick={() => window.print()} 
              className="btn btn-secondary"
            >
              Print Report
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EventReportPage;

