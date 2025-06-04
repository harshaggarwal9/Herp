import React, { useState, useEffect } from "react";
import axios from "axios";
export default function StudentResults() {
  const [subjects, setSubjects] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
useEffect(() => {
    async function fetchData() {
      try {
        // 1) Fetch all subjects for the logged‐in student
        const subjectsRes = await axios.get("/api/student/fetchSubjects");
        // Expect: [ { _id, name }, … ]
        setSubjects(subjectsRes.data || []);

        // 2) Fetch all result documents for that student (populated with exam & subject)
        const resultsRes = await axios.get("/api/result/fetch");
        // Expect: [ { _id, subject: { _id, name }, exam: { _id, name, marks }, marks }, … ]
        setResults(resultsRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setErrorMsg(
          err.response?.data?.message ||
            "Failed to fetch subjects or results. Please try again."
        );
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="alert alert-error shadow-lg max-w-lg mx-auto my-8">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01M12 3C7.032 3 3 7.032 3 12s4.032 9 9 9 9-4.032 9-9-4.032-9-9-9z"
            />
          </svg>
          <span>{errorMsg}</span>
        </div>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="alert alert-warning shadow-lg max-w-lg mx-auto my-8">
        <div>
          <span>No subjects found for your profile.</span>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="alert alert-info shadow-lg max-w-lg mx-auto my-8">
        <div>
          <span>No results have been uploaded yet.</span>
        </div>
      </div>
    );
  }

  // Group results by exam._id
  const examsMap = {};
  results.forEach((r) => {
    const examId = r.exam._id;
    if (!examsMap[examId]) {
      examsMap[examId] = { exam: r.exam, results: [] };
    }
    examsMap[examId].results.push(r);
  });
  const examsArray = Object.values(examsMap);

  return (
    <div className="space-y-8 px-6 py-8">
      {examsArray.map(({ exam, results: resultList }) => {
        // Determine which subjects are missing a result for this exam
        const submittedSubjectIds = new Set(
          resultList.map((r) => r.subject._id)
        );
        const missingSubjects = subjects.filter(
          (subj) => !submittedSubjectIds.has(subj._id)
        );

        return (
          <div
            key={exam._id}
            className="card bg-gray-800 text-gray-100 shadow-lg border border-gray-700"
          >
            <div className="card-body">
              {/* Exam Title */}
              <h2 className="card-title text-2xl text-blue-400">{exam.name}</h2>

              {/* If any subject is missing → show a golden banner */}
              {missingSubjects.length > 0 && (
                <div className="alert bg-yellow-400 text-black shadow-lg mt-4">
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01M12 3C7.032 3 3 7.032 3 12s4.032 9 9 9 9-4.032 9-9-4.032-9-9-9z"
                      />
                    </svg>
                    <span>
                      Marks not uploaded for:{" "}
                      {missingSubjects.map((s) => s.name).join(", ")}
                    </span>
                  </div>
                </div>
              )}

              {/* Results Table */}
              <div className="overflow-x-auto mt-6">
                <table className="table w-full">
                  {/* Table Header */}
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th>Subject</th>
                      <th className="text-center">Max Marks</th>
                      <th className="text-center">Marks Obtained</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {subjects.map((subj) => {
                      // Find the result object for this subject (if any)
                      const resForSubj = resultList.find(
                        (r) => r.subject._id === subj._id
                      );
                      return (
                        <tr
                          key={subj._id}
                          className="hover:bg-gray-700 even:bg-gray-800"
                        >
                          <td className="py-3 px-2 flex items-center space-x-2">
                            <span className="font-medium">{subj.name}</span>
                          </td>
                          <td className="text-center">
                            {exam.marks ?? "—"}
                          </td>
                          <td className="text-center">
                            {resForSubj ? resForSubj.marks : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
