import React, { useState } from "react";


const ProgramDetails = ({ program, onClose }) => {
  if (!program) return null; // Agar data nahi hai toh kuch mat dikhana
  console.log("Program Data:", program);

  const [selectedTemplate, setSelectedTemplate] = useState('basic');

  const templateOptions = [
    { value: 'basic', label: 'Basic Layout' },
    { value: 'timeline', label: 'Timeline Focused' },
    { value: 'benefits', label: 'Benefits Focused' },
    { value: 'testimonials', label: 'Testimonials Focused' }
  ];

  // Parsing function to handle valid JSON or just return an empty array or string
  const parseJsonSafely = (data) => {
    try {
      // If it's a valid JSON string, parse it
      return Array.isArray(JSON.parse(data)) ? JSON.parse(data) : data; 
    } catch (error) {
      return data; // If invalid, return the original data
    }
  };

  const ogImages = program?.seo?.ogImages ? [program.seo.ogImages] : []; // Convert to array if ogImages is a string
  const metaKeywords = program?.seo?.metaKeywords ? program.seo.metaKeywords : "N/A";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Program Details</h2>
          <div className="flex items-center space-x-4">
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="p-2 border rounded"
            >
              {templateOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>

       

        <div className="mt-4">
          <h3 className="font-semibold">📌 SEO DATA:</h3>
          <p><strong>Title:</strong> {program?.seo?.metaTitle || "N/A"}</p>
          <p><strong>Description:</strong> {program?.seo?.metaDescription || "N/A"}</p>
          <p><strong>Keywords:</strong> {metaKeywords}</p>
          <p><strong>OG Title:</strong> {program?.seo?.ogTitle || "N/A"}</p>
          <p><strong>OG Description:</strong> {program?.seo?.ogDescription || "N/A"}</p> 
          {/* OG Images (अगर Null ना हो) */}
          <p><strong>OG Images:</strong></p>
          {ogImages.length > 0 ? (
            <div className="flex justify-center items-center mt-2 gap-2 flex-wrap">
              {ogImages.map((img, index) => (
                <img key={index} src={img} alt="OG Image" className="w-24 h-24 object-cover rounded-lg shadow-md" />
              ))}
            </div>
          ) : (
            <p><strong>OG Images:</strong> N/A</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;
