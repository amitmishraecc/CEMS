# Project Structure

```
ems/
├── public/
│   └── index.html                 # HTML template
├── src/
│   ├── components/                # Reusable React components
│   │   └── common/
│   │       ├── Navbar.js          # Navigation header component
│   │       ├── Navbar.css
│   │       ├── Footer.js          # Footer component
│   │       ├── Footer.css
│   │       └── ProtectedRoute.js  # Route protection wrapper
│   ├── context/
│   │   └── AuthContext.js         # Authentication context and state management
│   ├── pages/                     # Page components
│   │   ├── HomePage.js            # Homepage with hero, featured, upcoming events
│   │   ├── HomePage.css
│   │   ├── EventsPage.js          # Events listing with filters/search
│   │   ├── EventsPage.css
│   │   ├── EventDetailsPage.js    # Individual event details and registration
│   │   ├── EventDetailsPage.css
│   │   ├── EventFormPage.js       # Create/Edit event form
│   │   ├── EventFormPage.css
│   │   ├── FAQPage.js             # Frequently asked questions
│   │   ├── FAQPage.css
│   │   ├── ContactPage.js          # Contact form and information
│   │   ├── ContactPage.css
│   │   ├── LoginPage.js           # User login page
│   │   ├── RegisterPage.js        # User registration page
│   │   └── AuthPages.css           # Shared styles for auth pages
│   │   └── dashboards/
│   │       ├── StudentDashboard.js    # Student dashboard
│   │       ├── OrganizerDashboard.js # Organizer dashboard
│   │       ├── AdminDashboard.js      # Admin dashboard
│   │       └── Dashboard.css          # Shared dashboard styles
│   ├── utils/
│   │   └── api.js                 # API utility functions (axios)
│   ├── App.js                     # Main app component with routing
│   ├── App.css                    # App-level styles
│   ├── index.js                   # React entry point
│   └── index.css                  # Global styles
├── db.json                        # JSON-Server database file
├── package.json                   # Dependencies and scripts
├── .gitignore                     # Git ignore rules
├── README.md                      # Project documentation
├── PROJECT_STRUCTURE.md           # This file
├── TEST_CASES.md                  # Test case documentation
└── LIMITATIONS.md                 # JSON-Server limitations
```

## Key Files Explained

### Configuration
- **package.json**: Contains all dependencies (React, React Router, Axios, JSON-Server) and npm scripts
- **db.json**: JSON-Server database with sample data for users, events, and registrations

### Core Application
- **src/App.js**: Main app component with React Router setup and all route definitions
- **src/index.js**: React application entry point

### Authentication
- **src/context/AuthContext.js**: Provides authentication state and functions (login, register, logout) to entire app
- **src/pages/LoginPage.js**: Login form
- **src/pages/RegisterPage.js**: Registration form with role selection

### Pages
- **src/pages/HomePage.js**: Landing page with hero section, introduction, featured events, and upcoming events
- **src/pages/EventsPage.js**: Event listing page with search and filters (category, location, date)
- **src/pages/EventDetailsPage.js**: Individual event details with registration functionality
- **src/pages/FAQPage.js**: Accordion-style FAQ page
- **src/pages/ContactPage.js**: Contact form and college contact information

### Dashboards
- **src/pages/dashboards/StudentDashboard.js**: 
  - View registered events
  - Cancel registrations
  - Browse more events

- **src/pages/dashboards/OrganizerDashboard.js**:
  - View created events
  - Create/edit/delete events
  - View registrants for events
  - Pending approval message for unapproved organizers

- **src/pages/dashboards/AdminDashboard.js**:
  - System overview with statistics
  - Manage all users (approve organizers, delete users)
  - Manage all events
  - View all registrations

### Components
- **src/components/common/Navbar.js**: Responsive navigation with role-based menu items
- **src/components/common/Footer.js**: Footer with links and contact information
- **src/components/common/ProtectedRoute.js**: HOC for protecting routes based on authentication/role

### Utilities
- **src/utils/api.js**: Centralized API calls using Axios, includes functions for users, events, and registrations

## Routing Structure

```
/                           → HomePage
/events                     → EventsPage (list all events)
/events/:id                 → EventDetailsPage
/events/create              → EventFormPage (create)
/events/:id/edit            → EventFormPage (edit)
/faq                        → FAQPage
/contact                    → ContactPage
/login                      → LoginPage
/register                   → RegisterPage
/dashboard/student          → StudentDashboard (protected)
/dashboard/organizer        → OrganizerDashboard (protected)
/dashboard/admin            → AdminDashboard (protected)
```

## Data Models

### User
```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "student|organizer|admin",
  "name": "string",
  "approved": boolean,
  "createdAt": "ISO date string"
}
```

### Event
```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "location": "string",
  "category": "string",
  "organizerId": number,
  "organizerName": "string",
  "featured": boolean,
  "image": "URL string",
  "maxCapacity": number,
  "createdAt": "ISO date string"
}
```

### Registration
```json
{
  "id": 1,
  "eventId": number,
  "userId": number,
  "userName": "string",
  "userEmail": "string",
  "registeredAt": "ISO date string",
  "status": "confirmed"
}
```

## API Endpoints (JSON-Server)

All endpoints are served at `http://localhost:3001`:

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Events
- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `POST /events` - Create event
- `PATCH /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### Registrations
- `GET /registrations` - Get all registrations
- `GET /registrations/:id` - Get registration by ID
- `POST /registrations` - Create registration
- `DELETE /registrations/:id` - Delete registration

## Styling Approach

- CSS modules per component/page
- Responsive design with mobile-first approach
- Consistent color scheme:
  - Primary: #3498db (blue)
  - Success: #27ae60 (green)
  - Warning: #f39c12 (orange)
  - Danger: #e74c3c (red)
  - Dark: #2c3e50 (dark blue-gray)

## State Management

- **React Context API**: Used for authentication state (`AuthContext`)
- **Local State**: React hooks (useState, useEffect) for component-level state
- **No Redux**: Kept simple as requested for minimal state management

## Role-Based Access

- **Student**: Browse events, register for events, view registrations
- **Organizer**: Create/edit own events, view registrants (requires approval)
- **Admin**: Full access - manage users, events, registrations, approve organizers

