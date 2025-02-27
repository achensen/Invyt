import { useEffect, useState } from "react";

interface Event {
  id: string;
  name: string;
  images: { url: string }[];
  dates: { start: { localDate: string } };
  url: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const userLocation = await getUserLocation();
        const response = await fetch(`http://localhost:3001/api/ticketmaster/events?lat=${userLocation.latitude}&long=${userLocation.longitude}`);
    
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
    
        const data = await response.json();
        setEvents(data); // Set state with the fetched events
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    

    fetchEvents();
  }, []);

  async function getUserLocation() {
    return new Promise<{ latitude: number; longitude: number }>(
      (resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              reject(error);
            }
          );
        } else {
          reject(new Error("Geolocation is not supported by this browser."));
        }
      }
    );
  }

  return (
    <div className="container mt-4">
      <h2>Events Near You</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="event-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <a href={event.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={event.images[0].url}
                  alt={event.name}
                  className="event-image"
                />
                <h3>{event.name}</h3>
                <p>{event.dates.start.localDate}</p>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;