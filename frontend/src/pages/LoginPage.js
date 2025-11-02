// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import './AuthPages.css';

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     if (!formData.username || !formData.password) {
//       setError('Please fill in all fields');
//       setLoading(false);
//       return;
//     }

//     const result = await login(formData.username, formData.password);

//     if (result.success) {
//       // Redirect based on role
//       const role = result.user.role;
//       if (role === 'admin') {
//         navigate('/dashboard/admin');
//       } else if (role === 'organizer') {
//         navigate('/dashboard/organizer');
//       } else {
//         navigate('/dashboard/student');
//       }
//     } else {
//       setError(result.error);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-container">
//         <div className="auth-card">
//           <h1>Login</h1>
//           <p className="auth-subtitle">Sign in to your account</p>

//           {error && <div className="alert alert-error">{error}</div>}

//           <form onSubmit={handleSubmit} className="auth-form">
//             <div className="form-group">
//               <label htmlFor="username">Username or Email</label>
//               <input
//                 type="text"
//                 id="username"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your username or email"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your password"
//               />
//             </div>

//             <button 
//               type="submit" 
//               className="btn btn-primary btn-full"
//               disabled={loading}
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </button>
//           </form>

//           <div className="auth-footer">
//             <p>
//               Don't have an account? <Link to="/register">Register here</Link>
//             </p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;




















import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login(formData.username, formData.password);

    if (result.success) {
      const role = result.user.role;
      if (role === 'admin') navigate('/dashboard/admin');
      else if (role === 'organizer') navigate('/dashboard/organizer');
      else navigate('/dashboard/student');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  // 🔹 Handle Reset Password
  const handleResetSubmit = (e) => {
    e.preventDefault();

    if (!resetEmail) {
      setResetMessage('Please enter your email.');
      return;
    }

    // Simulate sending reset link
    setResetMessage(`A password reset link has been sent to ${resetEmail}`);
    setResetEmail('');
    setTimeout(() => setShowResetPopup(false), 2500); // close popup after 2.5s
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Login</h1>
          <p className="auth-subtitle">Sign in to your account</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username or Email</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username or email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>

            {/* 🔹 Forgot Password Link */}
            <div className="forgot-password">
              <button
                type="button"
                className="link-button"
                onClick={() => setShowResetPopup(true)}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>

      {/* 🔹 Popup Modal */}
      {showResetPopup && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Reset Password</h2>
            <p>Enter your email to receive a password reset link:</p>

            <form onSubmit={handleResetSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary btn-full">
                Send Reset Link
              </button>
            </form>

            {resetMessage && <p className="reset-message">{resetMessage}</p>}

            <button
              onClick={() => setShowResetPopup(false)}
              className="btn btn-secondary btn-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
