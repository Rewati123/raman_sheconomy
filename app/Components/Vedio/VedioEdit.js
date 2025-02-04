import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/Components/ui/button";
const VedioEdit = ({ data, setdataadd, onSubmit, eduData }) => {
  const [formData, setFormData] = useState({
    id:eduData?.id|| "",
    title: eduData?.title || "",
    description: eduData?.description || "",
    url: eduData?.url || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const videoId = eduData?.id;
    if (!videoId) {
      console.error("Video ID is missing.");
      return;
    }

    try {
      const response = await fetch(`/api/vedio/${videoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update video');
      }

      const result = await response.json();
      console.log('Video updated:', result);
onSubmit(formData)
      setdataadd(false); // Close the edit form
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  

  
  

  return (
    <div className="max-w-full mx-auto mt-5 min-h-screen bg-white p-8">
   <Button
     className="cursor-pointer text-white px-4 py-2 rounded-md hover:bg-[#FF7F42] focus:outline-none"
     style={{ backgroundColor: '#FF7F42' }}
     onClick={() => setdataadd(false)}
   >
     Back
   </Button>
      <h1 className="text-2xl font-bold mb-4">{data}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            URL
          </label>
          <input
            type="text"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
  type="submit"
  style={{ backgroundColor: '#FF7F42' }}
  className="px-6 py-4 text-white rounded-md hover:bg-[#FF7F42] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-1/3 mx-auto"
>
  Upload Video
</button>
      </form>
    </div>
  );
};

export default VedioEdit;
