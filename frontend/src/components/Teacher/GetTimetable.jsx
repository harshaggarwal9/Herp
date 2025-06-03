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

const colorClasses = [
  'bg-gradient-to-r from-indigo-500 to-purple-500 text-white',
  'bg-gradient-to-r from-green-400 to-blue-500 text-white',
  'bg-gradient-to-r from-pink-500 to-red-500 text-white',
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
      const response = await axios.post(
        '/api/timetable/getbyTeacher',
        { day }
      );
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">My Timetable</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-gray-600" />
          <select
            className="select select-bordered select-primary w-40"
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
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : slots.length === 0 ? (
        <div className="text-center text-gray-500">No slots for {selectedDay}.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map((slot, index) => {
            const colorClass = colorClasses[index % colorClasses.length];
            return (
              <div
                key={slot._id || index}
                className={`card shadow-lg ${colorClass} rounded-2xl p-4`}
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{slot.subject.name}</h3>
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
