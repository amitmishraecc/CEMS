# Known Limitations of JSON-Server Implementation

This document outlines the limitations of using JSON-Server as the backend for the College Event Management System, compared to a full custom Node.js/Express backend.

## 1. Authentication & Security

### No Real Authentication
- **Issue:** JSON-Server doesn't handle authentication. Passwords are stored in plain text.
- **Impact:** 
  - No password hashing (passwords visible in db.json)
  - No JWT tokens or session management
  - No secure authentication mechanism
  - Anyone with access to db.json can see all passwords

### No Authorization Middleware
- **Issue:** Cannot implement server-side role-based access control
- **Impact:**
  - Authorization checks are only done client-side
  - Vulnerable to API manipulation via browser DevTools
  - Users could potentially access/modify data they shouldn't

**Solution for Production:** Implement a real backend with:
- Password hashing (bcrypt)
- JWT tokens or sessions
- Server-side middleware for role checks
- API route protection

---

## 2. Database Limitations

### File-Based Storage
- **Issue:** JSON-Server uses a single JSON file (db.json) for storage
- **Impact:**
  - No concurrent write protection (can corrupt data with multiple simultaneous writes)
  - Not suitable for production with high traffic
  - No transactions or ACID properties
  - Slow with large datasets

### No Relationships/Joins
- **Issue:** JSON-Server doesn't support SQL joins or relationships
- **Impact:**
  - Must fetch related data manually (e.g., event details for registrations)
  - Multiple API calls needed for related data
  - No foreign key constraints
  - Data integrity not enforced

### Limited Querying
- **Issue:** Basic filtering only (simple query parameters)
- **Impact:**
  - No complex queries (e.g., events by date range with category filter and search)
  - No pagination support
  - No sorting beyond basic field matching
  - Limited search capabilities

**Solution for Production:** Use a real database:
- PostgreSQL, MySQL, or MongoDB
- ORM/ODM for relationships
- Complex queries and indexes
- Transaction support

---

## 3. API Limitations

### REST-Only
- **Issue:** Only supports REST endpoints
- **Impact:**
  - No GraphQL support
  - No WebSocket support for real-time updates
  - Limited to CRUD operations
  - No custom business logic on server

### No Custom Endpoints
- **Issue:** Cannot create custom API routes (e.g., `/auth/login`, `/events/search`)
- **Impact:**
  - Must implement authentication logic client-side
  - Complex operations require multiple API calls
  - No server-side validation or processing

### No Middleware
- **Issue:** Cannot add middleware (logging, rate limiting, validation)
- **Impact:**
  - No request logging
  - No rate limiting (vulnerable to abuse)
  - No automatic request validation
  - No CORS configuration flexibility

---

## 4. Business Logic Limitations

### No Server-Side Validation
- **Issue:** All validation must be done client-side
- **Impact:**
  - Client-side validation can be bypassed
  - Invalid data can be sent to API
  - No guarantee of data consistency

### No Complex Operations
- **Issue:** Cannot perform complex server-side operations
- **Impact:**
  - Email sending (notifications) must be done client-side or via third-party
  - No scheduled tasks (e.g., reminder emails)
  - No data aggregation or analytics processing
  - No file uploads without additional setup

### No Background Jobs
- **Issue:** Cannot run background tasks
- **Impact:**
  - No scheduled email notifications
  - No data cleanup tasks
  - No automated reports
  - No batch processing

---

## 5. Scalability Issues

### Single Process
- **Issue:** JSON-Server runs as a single process
- **Impact:**
  - Cannot scale horizontally
  - Performance degrades with more users
  - No load balancing support
  - Single point of failure

### No Caching
- **Issue:** No built-in caching mechanism
- **Impact:**
  - Every request hits the file system
  - Slow response times with frequent reads
  - No cache invalidation strategy

### Memory Limitations
- **Issue:** Entire database loaded into memory
- **Impact:**
  - Large datasets consume significant memory
  - Slower startup times
  - Cannot handle very large databases efficiently

---

## 6. Data Integrity

### No Constraints
- **Issue:** No foreign key constraints or data validation
- **Impact:**
  - Can delete user with active registrations (orphaned data)
  - Can create registration for non-existent event
  - Duplicate data possible
  - No referential integrity

### No Transactions
- **Issue:** No transaction support
- **Impact:**
  - Cannot ensure atomic operations
  - Partial updates can leave data inconsistent
  - No rollback capability

### Manual Data Relationships
- **Issue:** Relationships must be maintained manually
- **Impact:**
  - Must manually fetch and combine related data
  - Risk of data inconsistency
  - More complex client-side code

---

## 7. Security Vulnerabilities

### No Input Sanitization
- **Issue:** No automatic input sanitization
- **Impact:**
  - Vulnerable to injection attacks (if using _embed, etc.)
  - No XSS protection
  - No CSRF protection

### CORS Configuration
- **Issue:** Basic CORS support, limited configuration
- **Impact:**
  - May need additional CORS setup for production
  - Security headers not customizable

---

## 8. Development & Deployment

### Development Only
- **Issue:** JSON-Server is intended for prototyping/development
- **Impact:**
  - Not recommended for production
  - No production-ready features
  - Limited documentation for production use

### No Environment Configuration
- **Issue:** Limited environment variable support
- **Impact:**
  - Database file path hardcoded
  - Port configuration is basic
  - No environment-specific settings

### No Logging/Monitoring
- **Issue:** No built-in logging or monitoring
- **Impact:**
  - Cannot track errors
  - No performance monitoring
  - Difficult to debug production issues

---

## 9. Missing Features

### Email Functionality
- **Issue:** Cannot send emails
- **Impact:**
  - No registration confirmations
  - No event reminders
  - No password reset emails
  - Must use third-party service (SendGrid, etc.)

### File Uploads
- **Issue:** No built-in file upload handling
- **Impact:**
  - Cannot upload event images directly
  - Must use external storage (S3, Cloudinary)
  - No file validation or processing

### Real-time Updates
- **Issue:** No WebSocket or Server-Sent Events
- **Impact:**
  - No live updates when events change
  - Must poll for changes
  - No instant notifications

---

## Recommendations for Production

To address these limitations in a production environment:

1. **Replace JSON-Server with Express.js/Node.js Backend**
   - Implement proper authentication (JWT)
   - Add server-side validation
   - Implement role-based access control

2. **Use a Real Database**
   - PostgreSQL or MySQL for relational data
   - MongoDB for document-based storage
   - Implement proper relationships and constraints

3. **Add Security Layers**
   - Password hashing (bcrypt)
   - Input sanitization and validation
   - Rate limiting
   - CORS configuration
   - Security headers

4. **Implement Additional Features**
   - Email service integration
   - File upload handling
   - Background job processing
   - Logging and monitoring

5. **Scalability Considerations**
   - Use PM2 or similar for process management
   - Consider cloud hosting (AWS, Heroku, etc.)
   - Implement caching (Redis)
   - Load balancing for multiple instances

---

## Conclusion

JSON-Server is an excellent tool for:
- ✅ Rapid prototyping
- ✅ Frontend development without backend dependencies
- ✅ Demonstrating UI/UX
- ✅ Learning and development

However, it should **NOT** be used for:
- ❌ Production applications
- ❌ Applications requiring security
- ❌ Applications with complex business logic
- ❌ Applications with scalability requirements
- ❌ Applications handling sensitive data

For a production College Event Management System, a full custom backend with a real database is essential.

