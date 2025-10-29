# Test Cases for College Event Management System

## Test Case 1: Student Registration Flow
**Objective:** Verify that a student can successfully register for an event.

**Steps:**
1. Navigate to the Events page
2. Click on an event to view details
3. Click "Register for Event" button
4. Verify registration success message appears
5. Navigate to Student Dashboard
6. Verify the event appears in "My Event Registrations"

**Expected Result:**
- Student is successfully registered for the event
- Event appears in student's dashboard
- Registration count on event page increases

**Test Data:**
- Student credentials: student1 / student123
- Event ID: 1 (Tech Conference 2024)

---

## Test Case 2: Student Canceling Registration
**Objective:** Verify that a student can cancel their event registration.

**Steps:**
1. Log in as a student
2. Navigate to Student Dashboard
3. Find a registered event
4. Click "Cancel Registration" button
5. Confirm cancellation in popup
6. Verify cancellation success message

**Expected Result:**
- Registration is cancelled successfully
- Event is removed from student's dashboard
- Student can register for the same event again

---

## Test Case 3: Organizer Creating Event
**Objective:** Verify that an organizer can create a new event.

**Steps:**
1. Log in as an organizer (organizer1 / org123)
2. Navigate to Organizer Dashboard
3. Click "Create New Event" button
4. Fill in event form:
   - Title: "Test Event"
   - Description: "This is a test event"
   - Date: Future date
   - Time: "14:00"
   - Location: "Test Hall"
   - Category: "Technology"
   - Max Capacity: 50
5. Click "Create Event"
6. Verify event appears in organizer's dashboard

**Expected Result:**
- Event is created successfully
- Event appears in organizer's event list
- Event appears in public Events page

---

## Test Case 4: Organizer Editing Event
**Objective:** Verify that an organizer can edit their own events.

**Steps:**
1. Log in as an organizer
2. Navigate to Organizer Dashboard
3. Find an existing event
4. Click "Edit" button
5. Modify event details (e.g., change title or description)
6. Click "Update Event"
7. Verify changes are saved

**Expected Result:**
- Event is updated successfully
- Changes are reflected in event details page
- Updated information is visible to all users

---

## Test Case 5: Organizer Viewing Registrants
**Objective:** Verify that an organizer can view who registered for their events.

**Steps:**
1. Log in as an organizer
2. Navigate to Organizer Dashboard
3. Find an event with registrations
4. Click "View Registrants" button (or check registration count)
5. Verify list of registered students is displayed

**Expected Result:**
- List of registered students is displayed
- Each registration shows student name, email, and registration date
- Registration count matches the number displayed

---

## Test Case 6: Admin Approving Organizer Account
**Objective:** Verify that an admin can approve pending organizer accounts.

**Steps:**
1. Log in as admin (admin / admin123)
2. Navigate to Admin Dashboard
3. Go to "Users" tab
4. Find an organizer with "Pending" status
5. Click "Approve" button
6. Verify status changes to "Approved"

**Expected Result:**
- Organizer account is approved
- Status changes to "Approved"
- Organizer can now create events

---

## Test Case 7: Admin Managing All Events
**Objective:** Verify that an admin can view and manage all events in the system.

**Steps:**
1. Log in as admin
2. Navigate to Admin Dashboard
3. Go to "Events" tab
4. Verify all events are listed (not just organizer's own)
5. Test deleting an event
6. Verify event is removed from system

**Expected Result:**
- All events are visible to admin
- Admin can delete any event
- Changes affect all users

---

## Test Case 8: Event Filtering and Search
**Objective:** Verify that users can filter and search events effectively.

**Steps:**
1. Navigate to Events page
2. Use search bar to search for "Tech"
3. Verify only matching events are displayed
4. Clear search
5. Filter by category "Sports"
6. Verify only sports events are displayed
7. Filter by location
8. Verify location filter works
9. Click "Clear Filters"

**Expected Result:**
- Search filters events by title and description
- Category filter shows only events in selected category
- Location filter works correctly
- Clear Filters resets all filters

---

## Test Case 9: Event Capacity Management
**Objective:** Verify that event capacity limits are enforced.

**Steps:**
1. Create an event with max capacity of 2
2. Register 2 different students for the event
3. Try to register a third student
4. Verify "Event Full" message appears
5. Verify registration button is disabled

**Expected Result:**
- Event shows as full after reaching capacity
- New registrations are blocked when full
- Capacity count is accurate

---

## Test Case 10: Role-Based Access Control
**Objective:** Verify that users can only access routes appropriate for their role.

**Steps:**
1. Log in as a student
2. Try to access /dashboard/organizer
3. Verify redirect to home page
4. Log out
5. Log in as an organizer (pending approval)
6. Try to create an event
7. Verify pending approval message is shown

**Expected Result:**
- Students cannot access organizer routes
- Organizers cannot access admin routes
- Pending organizers cannot create events

---

## Test Case 11: Registration After Approval Workflow
**Objective:** Verify complete workflow of organizer registration and approval.

**Steps:**
1. Register as a new organizer
2. Verify pending approval message appears
3. Log out
4. Log in as admin
5. Navigate to Users tab
6. Find the new organizer account
7. Approve the organizer account
8. Log out and log in as the organizer
9. Verify organizer can now create events

**Expected Result:**
- New organizer account requires approval
- Admin can approve organizer
- Approved organizer can create events

---

## Test Case 12: Event Details Page
**Objective:** Verify event details page displays all information correctly.

**Steps:**
1. Navigate to Events page
2. Click on any event
3. Verify all information is displayed:
   - Event title
   - Category and featured badge
   - Date and time
   - Location
   - Organizer name
   - Description
   - Capacity and registration count
4. Verify registration button (if logged in as student)

**Expected Result:**
- All event information is displayed correctly
- Formatting is consistent
- Registration functionality works if applicable

---

## Test Case 13: FAQ Page Functionality
**Objective:** Verify FAQ page works correctly.

**Steps:**
1. Navigate to FAQ page
2. Click on various FAQ items
3. Verify answers expand/collapse
4. Verify all questions have answers
5. Test "Contact Us" button link

**Expected Result:**
- FAQ items expand and collapse correctly
- All questions display answers
- Contact link works

---

## Test Case 14: Contact Form Submission
**Objective:** Verify contact form validation and submission.

**Steps:**
1. Navigate to Contact page
2. Try to submit empty form
3. Verify validation errors appear
4. Fill in form with invalid email
5. Verify email validation error
6. Fill form correctly and submit
7. Verify success message appears

**Expected Result:**
- Form validates required fields
- Email format is validated
- Success message appears on valid submission

---

## Test Case 15: Homepage Features
**Objective:** Verify homepage displays featured and upcoming events.

**Steps:**
1. Navigate to homepage
2. Verify hero section is displayed
3. Verify introduction section is present
4. Verify featured events section displays featured events
5. Verify upcoming events section displays upcoming events
6. Test "Browse Events" and "Get Started" buttons

**Expected Result:**
- All sections render correctly
- Featured events are displayed
- Upcoming events are sorted by date
- Navigation buttons work

---

## Additional Edge Cases to Test

1. **Duplicate Registration:** Try to register for the same event twice
2. **Past Events:** Verify past events are not shown in "upcoming" sections
3. **Empty States:** Test pages with no events/registrations
4. **Responsive Design:** Test on mobile and tablet views
5. **Error Handling:** Test with server errors (stop JSON-Server)
6. **Browser Compatibility:** Test in different browsers
7. **Session Persistence:** Verify login persists after page refresh
8. **Logout:** Verify user is logged out and redirected appropriately

