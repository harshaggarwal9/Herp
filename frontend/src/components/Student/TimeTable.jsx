import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, CalendarDays } from 'lucide-react';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const colorThemes = [
  'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white',
  'bg-gradient-to-r from-cyan-500 to-blue-500 text-white',
  'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
];

const StudentTimeTable = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSlots = async (day) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/api/timetable/getbyClass', { day });
      setSlots(response.data);
    } catch (err) {
      console.error('Error fetching slots:', err);
      setError('Failed to load timetable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots(selectedDay);
  }, [selectedDay]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-600" />
          <h2 className="text-3xl font-bold text-purple-800">My Class Timetable</h2>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-gray-600" />
          <select
            className="select select-bordered select-accent w-44"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading timetable...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : slots.length === 0 ? (
        <div className="text-center text-gray-500">No slots scheduled for {selectedDay}.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot, index) => {
            const theme = colorThemes[index % colorThemes.length];
            return (
              <div
                key={slot._id || index}
                className={`card shadow-xl ${theme} p-6 rounded-2xl`}
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    {slot.subject.name}
                  </h3>
                  <p className="text-sm">Teacher: {slot.teacher.userId.name}</p>
                  <p className="text-sm">Time: {slot.startTime} - {slot.endTime}</p>
                  <p className="text-sm">Day: {slot.day}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentTimeTable;