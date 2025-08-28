import React, { useState } from 'react';

const SkillsInput = ({ skills, setSkills }) => {
  const [skill, setSkill] = useState('');

  const addSkill = () => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkill('');
    }
  };

  const removeSkill = (s) => setSkills(skills.filter(sk => sk !== s));

  return (
    <div>
      <div className="flex mb-2">
        <input value={skill} onChange={e => setSkill(e.target.value)} placeholder="Add skill" className="border p-2 rounded-l" />
        <button type="button" onClick={addSkill} className="bg-blue-600 text-white px-4 py-2 rounded-r">Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((s, i) => (
          <span key={i} className="bg-blue-100 px-2 py-1 rounded flex items-center">
            {s} <button onClick={() => removeSkill(s)} className="ml-1 text-red-500">×</button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsInput;
