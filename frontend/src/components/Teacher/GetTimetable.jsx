import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar } from 'lucide-react';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const borderColors = [
  'border-t-4 border-indigo-400',
  'border-t-4 border-blue-400',
  'border-t-4 border-pink-400',
  'border-t-4 border-green-400',
  'border-t-4 border-yellow-400',
  'border-t-4 border-red-400',
  'border-t-4 border-purple-400',
];

const TeacherTimeTable = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSlots = async (day) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/api/timetable/getbyTeacher', { day });
      setSlots(response.data);
    } catch (err) {
      console.error('Error fetching slots:', err);
      setError('Failed to load timetable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots(selectedDay);
  }, [selectedDay]);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-semibold">My Timetable</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-white" />
          <select
            className="select select-bordered bg-slate-800 border-blue-500 text-white"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {daysOfWeek.map((day) => (
              <option key={day} value={day} className="text-black">
                {day}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-300">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-400">{error}</div>
      ) : slots.length === 0 ? (
        <div className="text-center text-gray-300">No slots for {selectedDay}.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot, index) => {
            const borderClass = borderColors[index % borderColors.length];
            return (
              <div
                key={slot._id || index}
                className={`bg-white text-gray-800 rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-200 ${borderClass}`}
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-indigo-700">{slot.subject.name}</h3>
                  <p className="text-sm">Class: {slot.class.Classname}</p>
                  <p className="text-sm">Section: {slot.class.section}</p>
                  <p className="text-sm">
                    Time: {slot.startTime} - {slot.endTime}
                  </p>
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

export default TeacherTimeTable;
