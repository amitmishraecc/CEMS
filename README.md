# College Event Management System

A comprehensive event management system for colleges built with React and JSON-Server.

# Deployment Link 
https://cems-neon.vercel.app/


## Features

- **Multi-role Authentication**: Student, Organizer, and Admin roles
- **Event Management**: Create, edit, view, and register for events
- **Role-based Dashboards**: Customized views for each user type
- **Search & Filters**: Filter events by date, category, and location
- **Responsive Design**: Mobile-friendly interface

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the JSON-Server (runs on port 3001):
```bash
npm run server
```

3. In a new terminal, start the React app (runs on port 3000):
```bash
npm run dev
```

Or run both simultaneously:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Default Login Credentials

### Admin
- Username: `admin`
- Password: `admin123`

### Organizer
- Username: `organizer1`
- Password: `org123`

### Student
- Username: `student1`
- Password: `student123`

## Project Structure

```
ems/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── events/
│   │   └── auth/
│   ├── pages/
│   ├── context/
│   ├── utils/
│   ├── App.js
│   └── index.js
├── db.json
├── package.json
└── README.md
```

## API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Events
- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `POST /events` - Create new event
- `PATCH /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### Registrations
- `GET /registrations` - Get all registrations
- `GET /registrations/:id` - Get registration by ID
- `POST /registrations` - Create new registration
- `DELETE /registrations/:id` - Cancel registration

## Known Limitations

See `LIMITATIONS.md` for detailed information about JSON-Server limitations.

## Test Cases

See `TEST_CASES.md` for test case documentation.

"# EMS" 
