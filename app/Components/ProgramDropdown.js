import React, { useState } from "react";

const ProgramDropdown = ({ totalPrograms, onProgramSelect }) => {
  const [selectedProgram, setSelectedProgram] = useState("");

  const generateProgramOptions = () => {
    const maxPrograms = Math.min(4, totalPrograms);
    return Array.from({ length: maxPrograms }, (_, index) => ({
      id: index + 1,
      name: `${index + 1} Programs`,
      value: (index + 1).toString()
    }));
  };

  const programs = generateProgramOptions();

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedProgram(value);
    onProgramSelect(value); 
  };
  

  return (
    <div className="p-4 flex flex-col items-center">
      <label
        className="text-white font-semibold text-lg px-3 py-1 rounded-md mb-2"
        style={{ backgroundColor: "#FF7F42" }}
      >
        Select Program 
      </label>
      <select
        className="w-60 p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 font-medium bg-white shadow-md"
        value={selectedProgram}
        onChange={handleChange}
      >
        <option value="" disabled>
          -- Choose  of programs --
        </option>
        {programs.map((program) => (
          <option key={program.id} value={program.value}>
            {program.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProgramDropdown;