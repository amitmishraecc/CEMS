## EMS API (JSON-Server)

Minimal JSON-Server for the College Event Management System, ready for Render deployment.

### Endpoints
- GET /users
- GET /events
- GET /registrations
- Full CRUD for each resource

### Run locally
```bash
npm install
npm start
# http://localhost:3001
```

### Deploy on Render
- Create a new Web Service and connect this repo
- Build Command: `npm install`
- Start Command: `npm start`
- Render injects `PORT`; this server binds to it automatically

After deploy, set in your frontend (Vercel) env vars:
- `REACT_APP_API_BASE_URL` = `https://<your-render-service>.onrender.com`

Notes: JSON-Server enables CORS by default. It's file-based and not production-grade for auth.


