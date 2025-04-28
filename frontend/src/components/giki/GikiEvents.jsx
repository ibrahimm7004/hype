import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import fetchData from "../../utils/fetchData";
import { FaSyncAlt } from "react-icons/fa"; // FontAwesome refresh icon

const GikiEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEvents = async (fromRefresh = false) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchData("/giki/giki-events");
      console.log(response);
      setEvents(response.data.events || []);

      // Save to localStorage
      localStorage.setItem(
        "gikiEvents",
        JSON.stringify(response.data.events || [])
      );
    } catch (err) {
      console.error(err);
      if (fromRefresh) {
        setError("Failed to refresh events. Please try again later.");
      } else {
        setError("Failed to load events. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if cached data exists
    const cachedEvents = localStorage.getItem("gikiEvents");
    if (cachedEvents) {
      setEvents(JSON.parse(cachedEvents));
    } else {
      fetchEvents();
    }
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      gsap.from(".event-item", {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 1,
        ease: "power2.out",
      });
    }
  }, [events]);

  return (
    <div className="border border-gray-300 rounded-2xl p-6 shadow-md bg-white mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-center flex-1">GIKI Events</h2>
        <button
          onClick={() => fetchEvents(true)}
          className="ml-4 p-2 text-blue-600 hover:text-blue-800 transition-transform transform hover:scale-110"
          title="Refresh Events"
        >
          <FaSyncAlt size={20} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-500">
          No events available at the moment.
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((item, index) => (
            <div
              key={index}
              className="event-item border-b pb-4 last:border-none"
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-1">
                {item.date} • {item.time}
              </p>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View Event →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GikiEvents;
