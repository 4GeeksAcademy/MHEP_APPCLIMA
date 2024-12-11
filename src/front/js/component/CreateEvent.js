import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import "../../styles/EventCreation.css";

const EventCreation = ({ session }) => {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [events, setEvents] = useState({});
  const [refetch, setRefetch] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        if (!session?.provider_token) {
          Swal.fire({
            icon: 'error',
            title: 'Token no disponible',
            text: 'Por favor, inicia sesión para cargar los eventos.',
          });
          return;
        }

        const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.provider_token}`,
          },
        });

        if (!res.ok) throw new Error(`Error al obtener eventos: ${res.statusText}`);

        const data = await res.json();

        const eventsByDate = data.items.reduce((acc, event) => {
          const eventDate = event.start.date || event.start.dateTime.split('T')[0];
          if (!acc[eventDate]) acc[eventDate] = [];
          acc[eventDate].push({
            name: event.summary,
            description: event.description || 'Sin descripción',
          });
          return acc;
        }, {});

        setEvents(eventsByDate);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener eventos',
          text: 'Hubo un error al cargar los eventos. Intenta nuevamente.',
        });
      }
    }

    fetchEvents();
  }, [session?.provider_token, refetch]);

  const validateEventFields = () => {
    if (!eventName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Nombre requerido',
        text: 'El nombre del evento es obligatorio.',
      });
      return false;
    }
    if (!eventDescription.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Descripción requerida',
        text: 'La descripción del evento es obligatoria.',
      });
      return false;
    }
    if (start >= end) {
      Swal.fire({
        icon: 'warning',
        title: 'Fechas incorrectas',
        text: 'La fecha de inicio debe ser anterior a la fecha de fin.',
      });
      return false;
    }
    return true;
  };

  async function createCalendarEvent() {
    if (!session?.provider_token) {
      Swal.fire({
        icon: 'error',
        title: 'Token no disponible',
        text: 'Por favor, inicia sesión nuevamente.',
      });
      return;
    }

    if (!validateEventFields()) return;

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
          'Authorization': `Bearer ${session.provider_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al crear el evento: ${errorData.error.message}`);
      }

      const data = await response.json();
      Swal.fire({
        icon: 'success',
        title: 'Evento creado',
        text: 'El evento fue creado exitosamente.',
      });

      setRefetch((prev) => !prev);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear evento',
        text: error.message,
      });
    } finally {
      setIsModalOpen(false);
    }
  }

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
                const clickedDate = new Date(start.getFullYear(), start.getMonth(), day);
                setSelectedDate(dayStr);
                setStart(clickedDate);
                setEnd(new Date(clickedDate.getTime() + 3600000));
                setIsModalOpen(true);
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
      <h2>Hola {session.user.email}</h2>
      <div>
        <h3>{start.toLocaleString('default', { month: 'long' })} {start.getFullYear()}</h3>
        {renderCalendarGrid()}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Crear Evento"
        customStyles={customStyles}
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        <h3>Crear Evento para {selectedDate}</h3>
        <div>
          <label>Inicio del evento</label>
          <DatePicker onChange={setStart} selected={start} showTimeSelect />
        </div>
        <div>
          <label>Fin del evento</label>
          <DatePicker onChange={setEnd} selected={end} showTimeSelect />
        </div>
        <div>
          <label>Nombre del evento</label>
          <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
        </div>
        <div>
          <label>Descripción del evento</label>
          <input type="text" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
        </div>
        <hr />
        <div className="modal-actions">
          <button type='button' onClick={createCalendarEvent}>Crear Evento</button>
          <button className='secondary' type='button' onClick={() => setIsModalOpen(false)}>Cancelar</button>
        </div>
      </Modal>
    </div>
  );
};

export default EventCreation;
