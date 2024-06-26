import { CalendarEvent } from '../types/CalendarEvent.ts';
import { useEffect, useState } from 'react';
import { useUser } from '../hooks/use-user.ts';

const weekDaysNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const weekDays = [1, 2, 3, 4, 5];
const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

function handleAddEvent(event: Omit<CalendarEvent, 'availability'>) {
  fetch('https://localhost:7162/add', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
}

function handleRemoveEvent(event: Omit<CalendarEvent, 'availability'>) {
  fetch('https://localhost:7162/remove', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
}

function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('https://localhost:7162/chosenhour');
      const data = await res.json();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  const { user } = useUser();
  console.log(user);

  return (
    <>
      <button
        onClick={() => window.location.replace('/login')}
        style={{ marginBottom: '50px' }}
      >
        Logout
      </button>
      <table>
        <thead>
          <tr>
            <th></th>
            {weekDaysNames.map(day => (
              <th key={day} style={{ textAlign: 'center' }}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map(hour => (
            <tr key={hour}>
              <td>{hour}:00</td>
              {weekDays.map(day => (
                <td key={day}>
                  {events.map(event => {
                    if (event.day === day && event.hour === hour) {
                      return (
                        <div key={event.id}>
                          <div>Availability: {event.availability}</div>
                        </div>
                      );
                    }
                  })}
                  <div>
                    <button
                      className='gg-add-r'
                      onClick={() => handleAddEvent({ day, hour })}
                      style={{ display: 'inline', marginRight: '10px' }}
                    ></button>
                    <button
                      className='gg-close-r'
                      onClick={() => handleRemoveEvent({ day, hour })}
                      style={{ display: 'inline' }}
                    ></button>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Calendar;
