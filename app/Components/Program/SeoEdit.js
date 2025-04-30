import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { toast } from "react-toastify";

const SeoEdit = ({ seoData, setSeoData }) => {
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");

  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImages, setOgImages] = useState([]);
  const [ogImageFiles, setOgImageFiles] = useState([]);

  useEffect(() => {
    setMetaTitle(seoData?.metaTitle || "");
    setMetaDescription(seoData?.metaDescription || "");
    setOgTitle(seoData?.ogTitle || "");
    setOgDescription(seoData?.ogDescription || "");

    if (seoData?.metaKeywords) {
      const keywords = Array.isArray(seoData.metaKeywords)
        ? seoData.metaKeywords
        : seoData.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean);
      setMetaKeywords(keywords);
    } else {
      setMetaKeywords([]);
    }

    if (seoData?.ogImages) {
      const images = Array.isArray(seoData.ogImages)
        ? seoData.ogImages
        : [seoData.ogImages];
      setOgImages(images);
      setOgImageFiles(images.map(() => null));
    } else {
      setOgImages([]);
      setOgImageFiles([]);
    }
  }, [seoData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setOgImages([imageUrl]);
      setOgImageFiles([file]);
    }
  };

  const handleSeoUpdate = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("action", "update");
      formDataToSend.append("metaTitle", metaTitle);
      formDataToSend.append("metaDescription", metaDescription);
      formDataToSend.append("ogTitle", ogTitle);
      formDataToSend.append("ogDescription", ogDescription);
      formDataToSend.append("metaKeywords", metaKeywords.join(","));

      ogImageFiles.forEach((file, index) => {
        if (file instanceof File) {
          formDataToSend.append("ogImages", file);
        } else {
          formDataToSend.append("existingImages[]", ogImages[index]);
        }
      });

      const apiUrl = `/api/program/${seoData?.id}`;
      const response = await axios.put(apiUrl, formDataToSend);

      if (response.status === 200) {
        toast.success("SEO Updated Successfully!");
        setSeoData(response.data);
      } else {
        toast.error("Failed to update SEO.");
      }
    } catch (error) {
      console.error("Error updating SEO:", error);
      toast.error("Something went wrong!");
    }
  };

  const addNewKeyword = () => {
    const trimmed = newKeyword.trim();
    if (!trimmed) return;
    if (metaKeywords.includes(trimmed)) {
      toast.warning("Keyword already exists!");
      return;
    }
    setMetaKeywords((prev) => [...prev, trimmed]);
    setNewKeyword("");
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <Label>Meta Title</Label>
      <Input
        value={metaTitle}
        onChange={(e) => setMetaTitle(e.target.value)}
        placeholder="Enter Meta Title"
      />

      <Label>Meta Description</Label>
      <Textarea
        value={metaDescription}
        onChange={(e) => setMetaDescription(e.target.value)}
        placeholder="Enter Meta Description"
      />

      <Label>Og Title</Label>
      <Input
        value={ogTitle}
        onChange={(e) => setOgTitle(e.target.value)}
        placeholder="Enter Open Graph Title"
      />

      <Label>Og Description</Label>
      <Textarea
        value={ogDescription}
        onChange={(e) => setOgDescription(e.target.value)}
        placeholder="Enter Open Graph Description"
      />

      <Label>Meta Keywords</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {metaKeywords.map((keyword, index) => (
          <div key={index} className="flex items-center gap-2 bg-gray-200 rounded-full px-3 py-1">
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                const updated = [...metaKeywords];
                updated[index] = e.target.value;
                setMetaKeywords(updated);
              }}
              className="bg-transparent border-none outline-none w-auto text-sm"
            />
            <button
              type="button"
              onClick={() => {
                const updated = metaKeywords.filter((_, i) => i !== index);
                setMetaKeywords(updated);
              }}
              className="text-red-600 font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          placeholder="Add new keyword"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addNewKeyword();
            }
          }}
        />
        <Button type="button" onClick={addNewKeyword}>
          Add
        </Button>
      </div>

      <Label>Upload SEO Image</Label>
      <Input type="file" onChange={handleImageUpload} />

      <div className="flex gap-2 mt-2 flex-wrap">
        {ogImages.map((img, index) => (
          <div key={index} className="relative border p-2 rounded-lg">
            <img
              src={img}
              alt={`og-${index}`}
              className="w-24 h-24 object-cover rounded-md"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-4">
        <Button onClick={handleSeoUpdate} className="bg-blue-500 text-white">
          Update SEO
        </Button>
      </div>
    </div>
  );
};

export default SeoEdit;
