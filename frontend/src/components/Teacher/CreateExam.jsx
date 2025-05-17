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
    subjects: [],
    classes: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch teacher (with populated classes) on mount
  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:5000/api/teacher/fetch/${userId}`)
      .then(res => {
        const t = res.data;
        setTeacher(t);
        const subjects = t.subjects || [];
        const classes = (t.classes || []).map(c => `${c.className} ${c.section}`);
        setFormData(prev => ({ ...prev, subjects: [], classes }));
      })
      .catch(err => console.error("Error loading teacher:", err))
      .finally(() => setLoadingTeacher(false));
  }, [userId]);

  if (loadingTeacher) return (
    <div className="flex justify-center items-center h-64">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
  if (!teacher) return <p className="text-center text-red-500">Unable to load teacher data.</p>;

  // Options for subjects come from teacher
  const subjectOptions = teacher.subjects || [];
  const classOptions = (teacher.classes || []).map(c => `${c.className} ${c.section}`);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiChange = (name, value) => {
    setFormData(prev => {
      const arr = new Set(prev[name]);
      if (arr.has(value)) arr.delete(value);
      else arr.add(value);
      return { ...prev, [name]: Array.from(arr) };
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
        // send a single subject name (the first selected)
        subject: formData.subjects[0],
        // send all selected classes
        className: formData.classes
      });
      setMessage({ type: "success", text: "Exam created successfully!" });
      setFormData(prev => ({ ...prev, name: "", date: "", marks: "", subjects: subjectOptions, classes: [] }));
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

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Subjects</span></label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                  {subjectOptions.map(sub => (
                    <label key={sub} className="cursor-pointer flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes(sub)}
                        onChange={() => handleMultiChange("subjects", sub)}
                        className="checkbox checkbox-primary mr-2"
                      />
                      <span>{sub}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Classes</span></label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                  {classOptions.map(cn => (
                    <label key={cn} className="cursor-pointer flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.classes.includes(cn)}
                        onChange={() => handleMultiChange("classes", cn)}
                        className="checkbox checkbox-secondary mr-2"
                      />
                      <span>{cn}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

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
