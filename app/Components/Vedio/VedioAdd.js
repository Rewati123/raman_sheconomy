'use client'

import { useState } from 'react'
import { Button } from "@/Components/ui/button";
import { X } from 'lucide-react'; // Cross Icon for delete
import { ToastContainer, toast } from "react-toastify"; // ✅ Toastify Import
import "react-toastify/dist/ReactToastify.css"; // ✅ Toastify CSS

export default function VedioAdd({ setdataadd, onSubmitData }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); // Generate preview URL
    }
  };

  const handleRemoveVideo = () => {
    setFile(null);
    setPreviewUrl(null);
    toast.success("Video removed successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !file) {
      toast.error("Please fill all fields and select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', file);

    try {
      const response = await fetch('/api/vedio', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setTitle('');
        setDescription('');
        setFile(null);
        setPreviewUrl(null);
        toast.success(data.message || "Video uploaded successfully!");
        setdataadd(false);
      } else {
        toast.error(data.message || "Error uploading video.");
      }
    } catch (error) {
      toast.error("Error uploading video. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer />
      <Button
        className="cursor-pointer text-white px-4 py-2 rounded-md hover:bg-[#FF7F42] focus:outline-none"
        style={{ backgroundColor: '#FF7F42' }}
        onClick={() => setdataadd(false)}
      >
        Back
      </Button>

      <h1 className="text-2xl font-bold mb-6 mt-4">Program Add</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm w-1/2 mx-auto"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm w-1/2 mx-auto"
            required
          ></textarea>
        </div>

        <div className="flex flex-col">
          <label htmlFor="video" className="text-sm font-medium text-gray-700">Video File</label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleFileChange}
            className="mt-1 block w-1/2 mx-auto p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        {previewUrl && (
          <div className="relative mt-4 w-1/2 mx-auto">
            <video src={previewUrl} controls className="w-full h-60 rounded-md shadow-md"></video>
            <button
              onClick={handleRemoveVideo}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <button
          type="submit"
          style={{ backgroundColor: '#FF7F42' }}
          className="px-6 py-4 text-white rounded-md hover:bg-[#FF7F42] focus:outline-none w-1/3 mx-auto"
        >
          Upload Video
        </button>
      </form>
    </>
  )
}
