"use client";
import { useState } from "react";

export default function ProgramDropdown() {
  const [selectedProgram, setSelectedProgram] = useState("");

  const programs = [
    { id: 1, name: "Program 1" },
    { id: 2, name: "Program 2" },
    { id: 3, name: "Program 3" },
    { id: 4, name: "Program 4" },
  ];

  const handleChange = (event) => {
    setSelectedProgram(event.target.value);
    console.log("Selected Program:", event.target.value);
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
          -- Choose a Program --
        </option>
        {programs.map((program) => (
          <option key={program.id} value={program.name}>
            {program.name}
          </option>
        ))}
      </select>
    </div>
  );
}
