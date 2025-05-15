import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { User, BookOpen, ClipboardList, Check } from "lucide-react";

axios.defaults.withCredentials = true;

export default function AssignTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  // fetch all teachers & classes on mount
  useEffect(() => {
    (async () => {
      try {
        const [tRes, cRes] = await Promise.all([
          axios.get("http://localhost:5000/api/teacher/fetch"), 
          axios.get("http://localhost:5000/api/class/fetch")
        ]);
        setTeachers(tRes.data.data);
        setClasses(cRes.data.data);
        console.table(setTeachers,setClasses);
      } catch (err) {
        toast.error("Failed to load data");
        console.error(err);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeacher || !selectedClass || !selectedSubject) {
      return toast.error("Please select all fields");
    }

    try {
      await axios.post(
        `http://localhost:5000/api/teacher/assign/${selectedTeacher}`,
        {
          classId: selectedClass,
          subject: selectedSubject,
        }
      );
      toast.success("✅ Teacher assigned successfully");
      // reset form
      setSelectedTeacher("");
      setSelectedClass("");
      setSelectedSubject("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Assignment failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <ClipboardList size={28} /> 
        <span>Assign Teacher</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Teacher Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User size={16} className="inline-block mr-1" />
            Teacher
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <option value="">Select a teacher…</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.userId.name} ({t.userId.email})
              </option>
            ))}
          </select>
        </div>

        {/* Class Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <BookOpen size={16} className="inline-block mr-1" />
            Class
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select a class…</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.className} — Section {c.section}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Select (filtered by teacher’s interests) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <BookOpen size={16} className="inline-block mr-1" />
            Subject
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedTeacher}
          >
            <option value="">
              {selectedTeacher
                ? "Select a subject…"
                : "Select teacher first"}
            </option>
            {teachers
              .find((t) => t._id === selectedTeacher)
              ?.subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
        >
          <Check />
          <span>Assign</span>
        </button>
      </form>
    </div>
  );
}
