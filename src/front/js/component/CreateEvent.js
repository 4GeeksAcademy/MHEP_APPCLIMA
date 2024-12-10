import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from 'react-modal';
import "../../styles/EventCreation.css";

const EventCreation = ({ session }) => {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [events, setEvents] = useState({});
  const [refetch, setRefetch] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch events on mount and whenever the provider_token changes
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.provider_token}`, // Assuming the token is available in session
          },
        });
        if (!res.ok) throw new Error('Failed to fetch events from Google Calendar');
        
        const data = await res.json();
        
        // Organize events by date
        const eventsByDate = data.items.reduce((acc, event) => {
          const eventDate = event.start.date || event.start.dateTime.split('T')[0]; // Extract date if dateTime is present
          if (!acc[eventDate]) acc[eventDate] = [];
          acc[eventDate].push({
            name: event.summary,
            description: event.description || 'No description',
          });
          return acc;
        }, {});
        
        setEvents(eventsByDate);
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      }
    }
  
    if (session?.provider_token) {
      fetchEvents(); // Fetch events when the token is available
    }
  }, [session?.provider_token, refetch]); // Only run if provider_token changes or is available

  // Handle event creation and force fetch after successful creation
  async function createCalendarEvent() {
    console.log("Creating calendar event");
    const event = {
      'summary': eventName,
      'description': eventDescription,
      'start': {
        'dateTime': start.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      'end': {
        'dateTime': end.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };
    
    try {
      const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          'Authorization': 'Bearer ' + session.provider_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      
      const data = await response.json();
      console.log("Event created:", data);

       setRefetch((prev)=> !prev)
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsModalOpen(false); // Close modal after event creation
    }
  }

  // Render the calendar grid
  const renderCalendarGrid = () => {
    const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    return (
      <div className="calendar-grid">
        {daysArray.map(day => {
          const dayStr = `${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          const dayEvents = events[dayStr] || [];

          return (
            <div
              key={day}
              className="calendar-day"
              onClick={() => {
                setSelectedDate(dayStr);
                setIsModalOpen(true); // Open modal when a day is clicked
              }}
            >
              <span>{day}</span>
              {dayEvents.length > 0 && (
                <div className="events">
                  {dayEvents.map((event, idx) => (
                    <div key={idx} className="event">{event.name}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
    },
  };

  return (
    <div className="container">
      <h2>Hey there {session.user.email}</h2>

      {/* Calendar View */}
      <div>
        <h3>{start.toLocaleString('default', { month: 'long' })} {start.getFullYear()}</h3>
        {renderCalendarGrid()}
      </div>

      {/* Modal for Event Form */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Create Event"
        customStyles={customStyles}
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        <h3>Create Event for {selectedDate}</h3>
        <div>
          <label>Start of your event</label>
          <DatePicker onChange={setStart} selected={start} showTimeSelect />
        </div>
        <div>
          <label>End of your event</label>
          <DatePicker onChange={setEnd} selected={end} showTimeSelect />
        </div>
        <div>
          <label>Event name</label>
          <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
        </div>
        <div>
          <label>Event description</label>
          <input type="text" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
        </div>
        <hr />
        <div className="modal-actions">
          <button type='button' onClick={createCalendarEvent}>Create Calendar Event</button>
          <button className='secondary' type='button' onClick={() => setIsModalOpen(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default EventCreation;
