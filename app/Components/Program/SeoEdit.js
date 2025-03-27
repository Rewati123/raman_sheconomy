import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";

const SeoEdit = ({ seoData, setSeoData }) => {
  const [metaTitle, setMetaTitle] = useState(seoData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(seoData?.metaDescription || "");
  const [keywords, setKeywords] = useState(
    Array.isArray(seoData?.metaKeywords) ? seoData.metaKeywords : typeof seoData?.metaKeywords === "string"
      ? seoData.metaKeywords.split(",").map(kw => kw.trim())
      : []
  );
  const [images, setImages] = useState(Array.isArray(seoData?.ogImages) ? seoData.ogImages : []);
  const [ogTitle, setOgTitle] = useState(seoData?.ogTitle || "");
  const [newKeyword, setNewKeyword] = useState("");

  // Meta Title Update
  const handleMetaTitleChange = (e) => {
    setMetaTitle(e.target.value);
    setSeoData((prev) => ({ ...prev, metaTitle: e.target.value }));
  };

  // Meta Description Update
  const handleMetaDescriptionChange = (e) => {
    setMetaDescription(e.target.value);
    setSeoData((prev) => ({ ...prev, metaDescription: e.target.value }));
  };

  // Open Graph Title Update
  const handleOgTitleChange = (e) => {
    setOgTitle(e.target.value);
    setSeoData((prev) => ({ ...prev, ogTitle: e.target.value }));
  };

  // Keywords Add
  const handleAddKeyword = () => {
    if (newKeyword.trim() !== "") {
      const updatedKeywords = [...keywords, newKeyword.trim()];
      setKeywords(updatedKeywords);
      setSeoData((prev) => ({
        ...prev,
        metaKeywords: updatedKeywords,
      }));
      setNewKeyword("");
    }
  };

  // Remove Keyword
  const handleRemoveKeyword = (index) => {
    const updatedKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(updatedKeywords);
    setSeoData((prev) => ({ ...prev, metaKeywords: updatedKeywords }));
  };

  // Image Upload (FIXED)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImages((prev) => [...prev, imageUrl]);

      setSeoData((prev) => ({
        ...prev,
        metaTitle: prev?.metaTitle || "",  // Ensuring other properties don't get erased
        metaDescription: prev?.metaDescription || "",
        ogTitle: prev?.ogTitle || "",
        metaKeywords: prev?.metaKeywords || [],
        ogImages: [...(prev?.ogImages || []), imageUrl],
      }));
    }
  };

  // Remove Image
  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setSeoData((prev) => ({ ...prev, ogImages: updatedImages }));
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      {/* Meta Title */}
      <Label>Meta Title <span className="text-gray-500 text-sm">(Max: 60 chars)</span></Label>
      <Input value={metaTitle} onChange={handleMetaTitleChange} placeholder="Enter Meta Title" />

      {/* Meta Description */}
      <Label>Meta Description <span className="text-gray-500 text-sm">(Max: 160 chars)</span></Label>
      <Textarea value={metaDescription} onChange={handleMetaDescriptionChange} placeholder="Enter Meta Description" />

      {/* Open Graph Title */}
      <Label>Og Title</Label>
      <Input value={ogTitle} onChange={handleOgTitleChange} placeholder="Enter Open Graph Title" />

      {/* Meta Keywords */}
      <Label>Meta Keywords</Label>
      <div className="flex gap-2 flex-wrap">
        {keywords.length > 0 ? (
          keywords.map((kw, index) => (
            <span key={index} className="px-2 py-1 bg-gray-200 rounded text-sm flex items-center">
              {kw} 
              <button 
                onClick={() => handleRemoveKeyword(index)} 
                className="ml-2 text-red-500 text-xs font-bold"
              >
                ✕
              </button>
            </span>
          ))
        ) : (
          <span className="text-gray-500">No Keywords Added</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input 
          value={newKeyword} 
          onChange={(e) => setNewKeyword(e.target.value)} 
          placeholder="Add new keyword" 
          className="flex-1"
        />
        <Button onClick={handleAddKeyword}>Add</Button>
      </div>

      {/* Image Upload */}
      <Label>Upload SEO Image</Label>
      <Input type="file" onChange={handleImageUpload} />
      <div className="flex gap-2 mt-2">
        {images.map((img, index) => (
          <div key={index} className="relative">
            <img src={img} alt="SEO Preview" className="w-20 h-20 object-cover rounded" />
            <button 
              onClick={() => handleRemoveImage(index)} 
              className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeoEdit;
