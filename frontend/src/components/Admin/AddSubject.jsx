import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;

export default function CreateSubject() {
  const [name, setName] = useState("");
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/class/fetch");
        setAllClasses(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load classes");
      }
    })();
  }, []);

  const handleClassChange = (e) => {
    const opts = Array.from(e.target.selectedOptions).map((o) => o.value);
    setSelectedClasses(opts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || selectedClasses.length === 0) {
      return toast.error("Please enter a subject name and select at least one class.");
    }

    try {
      const payload = { name: name.trim(), classes: selectedClasses };
      await axios.post("/api/subject/create", payload);
      toast.success("Subject created successfully!");
      setName("");
      setSelectedClasses([]);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create subject");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 bg-base-200">
      <div className="w-full max-w-xl bg-base-100 p-6 sm:p-8 shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Create New Subject</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Subject Name */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Subject Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Mathematics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Class Multi-Select */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Assign to Classes</span>
            </label>
            <select
              multiple
              value={selectedClasses}
              onChange={handleClassChange}
              className="select select-bordered w-full h-40 sm:h-32 overflow-auto"
              required
            >
              {allClasses.map((c) => (
                <option key={c._id} value={c.className}>
                  {c.className} — Section {c.section}
                </option>
              ))}
            </select>
            <label className="label">
              <span className="label-text-alt text-xs sm:text-sm">
                Hold <kbd className="kbd kbd-xs">Ctrl</kbd> (Windows) or{" "}
                <kbd className="kbd kbd-xs">⌘</kbd> (Mac) to select multiple.
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="form-control">
            <button
              type="submit"
              className="btn btn-primary w-full flex justify-center space-x-2"
            >
              <span>Create Subject</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
