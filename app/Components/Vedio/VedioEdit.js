import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VedioEdit = ({ data, setdataadd, onSubmit, eduData }) => {
  const [formData, setFormData] = useState({
    id: eduData?.id || "",
    title: eduData?.title || "",
    description: eduData?.description || "",
    url: eduData?.url || "",
  });

  const [showPreview, setShowPreview] = useState(!!eduData?.url);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "url") {
      setShowPreview(value.trim() !== "");
    }
  };

  const handleDeleteVideo = () => {
    setShowPreview(false);
    setFormData({ ...formData, url: "" });
    toast.info("Video removed! Upload a new one.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id) {
      toast.error("Video ID missing!");
      return;
    }

    try {
      const response = await fetch(`/api/vedio/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update video");
      }

      const result = await response.json();
      console.log("Video updated:", result);
      toast.success("Video updated successfully!");

      onSubmit(formData);
      setdataadd(false);
    } catch (error) {
      toast.error("Failed to update video!");
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const isMp4Video = (url) => url.endsWith(".mp4");

  return (
    <div className="max-w-lg mx-auto mt-5 bg-white p-6 rounded-lg shadow-md">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center">
        <Button
          className="cursor-pointer text-white px-4 py-2 rounded-md hover:bg-[#FF7F42] focus:outline-none"
          style={{ backgroundColor: "#FF7F42" }}
          onClick={() => setdataadd(false)}
        >
          Back
        </Button>
        <h1 className="text-xl font-bold">{data}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
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
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {showPreview && formData.url ? (
          <div className="mt-4 relative">
            <label className="block text-sm font-medium text-gray-700">Video Preview</label>
            <div className="mt-2 relative w-60 h-36 border border-gray-300 rounded-md overflow-hidden">
              <button
                className="absolute top-1 right-1 bg-gray-700 text-white p-1 rounded-full hover:bg-gray-900"
                onClick={handleDeleteVideo}
                type="button"
              >
                <X size={16} />
              </button>
              {getYouTubeEmbedUrl(formData.url) ? (
                <iframe
                  className="w-full h-full"
                  src={getYouTubeEmbedUrl(formData.url)}
                  title="YouTube Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : isMp4Video(formData.url) ? (
                <video className="w-full h-full" controls>
                  <source src={formData.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p className="text-red-500">Invalid video URL</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload New Video</label>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="Enter YouTube or MP4 URL"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        )}

        <button
          type="submit"
          style={{ backgroundColor: "#FF7F42" }}
          className="px-4 py-2 text-white rounded-md hover:bg-[#FF7F42] focus:outline-none w-full"
        >
          Upload Video
        </button>
      </form>
    </div>
  );
};

export default VedioEdit;
