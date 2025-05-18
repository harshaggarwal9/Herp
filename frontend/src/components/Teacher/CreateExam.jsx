// Frontend: CreateExamForm.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../../stores/useAuthStore";

export default function CreateExamForm() {
  const { user } = useAuthStore();
  const userId = user?._id;

  const [teacher, setTeacher] = useState(null);
  const [loadingTeacher, setLoadingTeacher] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    marks: "",
    subject: "",
    classes: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch teacher with populated classes and subjects
  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:5000/api/teacher/fetch/${userId}`)
      .then(res => setTeacher(res.data))
      .catch(err => console.error("Error loading teacher:", err))
      .finally(() => setLoadingTeacher(false));
  }, [userId]);

  if (loadingTeacher) return (
    <div className="flex justify-center items-center h-64">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  if (!teacher) return <p className="text-center text-red-500">Unable to load teacher data.</p>;

  // Prepare subject and class options
  const subjectOptions = teacher.subjects || []; // array of string subjects
  const classOptions = teacher.classes || [];    // array of { _id, className, section }

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiChange = classId => {
    setFormData(prev => {
      const setVals = new Set(prev.classes);
      if (setVals.has(classId)) setVals.delete(classId);
      else setVals.add(classId);
      return { ...prev, classes: Array.from(setVals) };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await axios.post("http://localhost:5000/api/exam/create", {
        name: formData.name,
        date: formData.date,
        marks: Number(formData.marks),
        subject: formData.subject,   // sending subject name string
        classes: formData.classes    // sending class IDs
      });
      setMessage({ type: "success", text: "Exam created successfully!" });
      setFormData({ name: "", date: "", marks: "", subject: "", classes: [] });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.message || "Error creating exam" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body space-y-6">
          <h2 className="card-title text-2xl">Create New Exam</h2>

          {message && (
            <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            {/* Exam Name */}
            <div className="form-control">
              <label className="label"><span className="label-text">Exam Name</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-bordered"
                placeholder="Enter exam name"
                required
              />
            </div>

            {/* Date & Marks */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Date</span></label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Total Marks</span></label>
                <input
                  type="number"
                  name="marks"
                  value={formData.marks}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="Max marks"
                  required
                />
              </div>
            </div>

            {/* Subject */}
            <div className="form-control">
              <label className="label"><span className="label-text">Subject</span></label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="select select-bordered"
                required
              >
                <option value="" disabled>Select subject</option>
                {subjectOptions.map(sub => (
                  <option key={sub} value={sub}>{sub}</option> // use string subject
                ))}
              </select>
            </div>

            {/* Classes */}
            <div className="form-control">
              <label className="label"><span className="label-text">Classes</span></label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                {classOptions.map(c => (
                  <label key={c._id} className="cursor-pointer flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.classes.includes(c._id)}
                      onChange={() => handleMultiChange(c._id)}
                      className="checkbox checkbox-secondary mr-2"
                    />
                    <span>{`${c.className} ${c.section}`}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="form-control mt-4">
              <button
                type="submit"
                className={`btn btn-primary ${submitting ? "loading" : ""}`}
                disabled={submitting}
              >{submitting ? "Creating..." : "Create Exam"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
