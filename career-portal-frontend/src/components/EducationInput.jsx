import React from 'react';

const EducationInput = ({ education, setEducation }) => {
  const addEducation = () => setEducation([...education, { institution: '', degree: '', field: '', startYear: '', endYear: '' }]);
  const removeEducation = (i) => setEducation(education.filter((_, index) => index !== i));
  const handleChange = (i, field, value) => {
    const newEdu = [...education]; newEdu[i][field] = value; setEducation(newEdu);
  };

  return (
    <div>
      {education.map((edu, i) => (
        <div key={i} className="border p-3 rounded mb-2">
          <input type="text" placeholder="Institution" value={edu.institution} onChange={e => handleChange(i,'institution',e.target.value)} className="border p-2 mb-1 w-full rounded" />
          <input type="text" placeholder="Degree" value={edu.degree} onChange={e => handleChange(i,'degree',e.target.value)} className="border p-2 mb-1 w-full rounded" />
          <input type="text" placeholder="Field" value={edu.field} onChange={e => handleChange(i,'field',e.target.value)} className="border p-2 mb-1 w-full rounded" />
          <div className="flex gap-2">
            <input type="number" placeholder="Start Year" value={edu.startYear} onChange={e => handleChange(i,'startYear',e.target.value)} className="border p-2 w-1/2 rounded" />
            <input type="number" placeholder="End Year" value={edu.endYear} onChange={e => handleChange(i,'endYear',e.target.value)} className="border p-2 w-1/2 rounded" />
          </div>
          {education.length > 1 && <button type="button" onClick={() => removeEducation(i)} className="bg-red-500 text-white px-3 py-1 rounded mt-2">Remove</button>}
        </div>
      ))}
      <button type="button" onClick={addEducation} className="bg-gray-200 px-3 py-1 rounded mt-2">+ Add Education</button>
    </div>
  );
};

export default EducationInput;
