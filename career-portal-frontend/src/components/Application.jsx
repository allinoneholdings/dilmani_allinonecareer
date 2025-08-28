import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // <-- import your AuthContext hook

const Application = () => {
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [notes, setNotes] = useState("");
  const [education, setEducation] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth(); // <-- get current logged-in user
  const navigateTo = useNavigate();
  const { id } = useParams();

  const addSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleApplication = async (e) => {
    e.preventDefault();

    if (!experience || skills.length === 0 || !notes || !education) {
      toast.error("Please fill in all fields and add at least one skill");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/applications",
        {
          jobId: id,
          experience,
          skills,
          notes,
          education,
          name: currentUser.name,
          email: currentUser.email,
        },
        { withCredentials: true }
      );

      setExperience("");
      setSkills([]);
      setNotes("");
      setEducation("");

      toast.success("Application submitted successfully!");
      navigateTo("/job/getall");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    navigateTo("/");
    return null;
  }

  return (
    <section className="py-10 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Job Application</h2>
        <form onSubmit={handleApplication} className="space-y-4">
          {/* Experience */}
          <div>
            <label className="block font-medium mb-1">Experience</label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Describe your experience..."
              required
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block font-medium mb-1">Skills</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSkill())
                }
                placeholder="Add a skill and press Enter"
                className="flex-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1"
                >
                  {skill}{" "}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Additional notes..."
              required
            />
          </div>

          {/* Education */}
          <div>
            <label className="block font-medium mb-1">Education</label>
            <textarea
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your education background..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Application;
