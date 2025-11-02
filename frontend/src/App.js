import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import OrganizerDashboard from './pages/dashboards/OrganizerDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import EventFormPage from './pages/EventFormPage';
import EventRegistrantsPage from './pages/EventRegistrantsPage';
import EventReportPage from './pages/EventReportPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />
              <Route path="/events/create" element={<EventFormPage />} />
              <Route path="/events/:id/edit" element={<EventFormPage />} />
              <Route path="/events/:id/registrants" element={<EventRegistrantsPage />} />
              <Route path="/events/:id/report" element={<EventReportPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route path="/dashboard/organizer" element={<OrganizerDashboard />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

