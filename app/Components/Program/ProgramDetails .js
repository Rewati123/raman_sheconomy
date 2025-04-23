import React from "react";

const ProgramDetails = ({ program, onClose }) => {
  if (!program) return null; // Agar data nahi hai toh kuch mat dikhana
  console.log("Program Data:", program);

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
      <div className="bg-white p-6 rounded-lg w-1/2 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">📌 Title: <span className="font-normal">{program.title}</span></h2>
        <p className="text-lg font-bold">📌 Subtitle: <span className="font-normal">{program.subtitle}</span></p>
    
        <div className="mt-3">
          <span className="text-sm font-semibold">📷 Program Image:</span>
          <img src={program.image} alt="Program" className="w-32 h-20 object-cover rounded-md my-2" />
        </div>
    
        <p className="mt-2"><strong>📌 Short Description:</strong> {program.shortDescription}</p>
        <p className="mt-2"><strong>📌 Full Description:</strong> {program.description}</p>
    
        <div className="mt-4">
          <h3 className="font-semibold">✅ Ideal For:</h3>
          <p>{program.idealForDescription}</p>
        </div>
    
        <div className="mt-4">
          <h3 className="font-semibold">📅 Timeline:</h3>
          <p>{program.timelineDescription}</p>
          <p className="mt-1"><strong>📆 Start Date:</strong> {program.startDate}</p>
          <p><strong>⏳ End Date:</strong> {program.endDate}</p>
        </div>
    
        <div className="mt-4">
          <h3 className="font-semibold">🎁 Benefits:</h3>
          <ul className="list-disc pl-5">
            {program.benefits.map((benefit) => (
              <li key={benefit.benefitId} className="flex items-center">
                <img src={benefit.icon} alt="Benefit Icon" className="w-6 h-6 mr-2" />
                <span className="font-medium">{benefit.title}:</span> {benefit.description}
              </li>
            ))}
          </ul>
        </div>
    
        <div className="mt-4">
          <h3 className="font-semibold">💬 Testimonials:</h3>
          <ul>
            {program.testimonials.map((testi) => (
              <li key={testi.testimonialId} className="border p-2 rounded-md my-2 flex items-center">
                <img src={testi.profile} alt="Profile" className="w-8 h-8 rounded-full mr-3" />
                <div>
                  <strong>{testi.name}</strong> ({testi.designation}): {testi.message}
                </div>
              </li>
            ))}
          </ul>
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

        <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
          ❌ Close
        </button>
      </div>
    </div>
  );
};

export default ProgramDetails;
