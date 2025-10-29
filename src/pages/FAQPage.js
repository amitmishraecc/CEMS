import React, { useState } from 'react';
import './FAQPage.css';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I register for an event?",
      answer: "To register for an event, you need to first create a student account. Once logged in, navigate to the Events page, click on an event to view details, and click the 'Register for Event' button. You'll receive a confirmation once registered."
    },
    {
      question: "Can I cancel my event registration?",
      answer: "Yes, you can cancel your registration by going to the event details page and clicking 'Cancel Registration'. Please note that cancellations should be done before the event date."
    },
    {
      question: "What roles are available in the system?",
      answer: "There are three roles: Student (browse and register for events), Organizer (create and manage events, view registrants), and Admin (manage all events, users, registrations, and approve organizer accounts)."
    },
    {
      question: "How do I become an event organizer?",
      answer: "You can register for an organizer account during signup. However, organizer accounts require approval from an admin. Once your account is approved, you'll be able to create and manage events."
    },
    {
      question: "What happens if an event is full?",
      answer: "If an event reaches its maximum capacity, the registration button will be disabled and show 'Event Full'. You can check the capacity status on the event details page."
    },
    {
      question: "How do I create a new event?",
      answer: "Only approved organizers can create events. Log in to your organizer account, go to your dashboard, and click 'Create New Event'. Fill in the event details including title, date, time, location, description, and capacity."
    },
    {
      question: "Can I edit events I've created?",
      answer: "Yes, as an organizer, you can edit events you've created from your dashboard. Navigate to the event in your dashboard and click 'Edit' to modify event details."
    },
    {
      question: "How do I view who registered for my events?",
      answer: "As an organizer, log in to your dashboard. You'll see a list of your events with the number of registrants. Click on an event to view the full list of registered students."
    },
    {
      question: "What can admins do?",
      answer: "Admins have full system access. They can manage all events (create, edit, delete), manage users (approve organizer accounts, delete users), view all registrations, and access analytics about events and registrations."
    },
    {
      question: "How do I search for events?",
      answer: "On the Events page, you can use the search bar to find events by title or description. You can also filter events by category, location, and date using the filter options provided."
    },
    {
      question: "Is there a limit to how many events I can register for?",
      answer: "No, there's no limit to the number of events you can register for as a student. However, please check event dates to ensure you can attend scheduled events."
    },
    {
      question: "What information do I need to provide when registering?",
      answer: "You only need to create a student account with your name, email, username, and password. When registering for events, your account information is automatically used - no additional details needed."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="container">
        <h1>Frequently Asked Questions</h1>
        <p className="faq-intro">
          Find answers to common questions about our event management system.
        </p>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
            >
              <button 
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faq-contact">
          <h2>Still have questions?</h2>
          <p>If you couldn't find the answer you were looking for, feel free to contact us.</p>
          <a href="/contact" className="btn btn-primary">Contact Us</a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;

