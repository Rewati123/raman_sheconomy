import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { toast } from "react-toastify";

const SeoEdit = ({ seoData, setSeoData }) => {
  const [metaTitle, setMetaTitle] = useState(seoData?.metaTitle || "");
  const [seoid, setSetid]= useState(seoData.seoid||"")
  const [metaDescription, setMetaDescription] = useState(seoData?.metaDescription || "");
  const [metaKeywords, setMetaKeywords] = useState(Array.isArray(seoData?.metaKeywords) ? seoData.metaKeywords : []);
  const [ogTitle, setOgTitle] = useState(seoData?.ogTitle || "");
  const [ogDescription, setOgDescription] = useState(seoData?.ogDescription || "");
  const [ogImages, setOgImages] = useState(Array.isArray(seoData?.ogImages) ? seoData.ogImages : []);
  const [newKeyword, setNewKeyword] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const updatedImages = [...ogImages, imageUrl];
      setOgImages(updatedImages);
      setSeoData((prev) => ({ ...prev, ogImages: updatedImages }));
    }
  };

  const handleReplaceImage = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const updatedImages = [...ogImages];
      updatedImages[index] = imageUrl;
      setOgImages(updatedImages);
      setSeoData((prev) => ({ ...prev, ogImages: updatedImages }));
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = ogImages.filter((_, i) => i !== index);
    setOgImages(updatedImages);
    setSeoData((prev) => ({ ...prev, ogImages: updatedImages }));
  };

  // **SEO Update Function**
  const handleSeoUpdate = async () => {
    // alert(`seoid: ${seoData.seoidanil}, ID: ${seoData.id}`);

    try {
    
      const formDataToSend = new FormData();
      formDataToSend.append("action", "update");
      formDataToSend.append("metaTitle", metaTitle);
      formDataToSend.append("metaDescription", metaDescription);
      formDataToSend.append("ogTitle", ogTitle);
      formDataToSend.append("ogDescription", ogDescription);
  
      formDataToSend.append("metaKeywords", metaKeywords.join(","));
  
      ogImages.forEach((image, index) => {
        formDataToSend.append(`ogImages[${index}]`, image);
      });
  

    const apiUrl = `/api/program/${seoData?.id}`;
  
      const response = await axios.put(apiUrl, formDataToSend);
      console.log("🔄 Response Status:", response.status);
      console.log("📦 Response Data:", response.data);
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

  





  
//   console.log(seoid,"gggggg")
// console.log(seoData.seoid,"seoData2222222")
  return (
    <div className="p-4 border rounded-lg space-y-4">
      <Label>Meta Title</Label>
      {/* <input type="hidden" name="seoid" value={seoid} /> */}
      <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Enter Meta Title" />

      <Label>Meta Description</Label>
      <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Enter Meta Description" />

      <Label>Og Title</Label>
      <Input value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} placeholder="Enter Open Graph Title" />

      <Label>Og Description</Label>
      <Textarea value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} placeholder="Enter Open Graph Description" />

      {/* Image Upload */}
      <Label>Upload SEO Image</Label>
      <Input type="file" onChange={handleImageUpload} />
      
      <div className="flex gap-2 mt-2">
        {ogImages.map((img, index) => (
          <div key={index} className="relative border p-2 rounded-lg">
            <img src={img} alt="SEO Preview" className="w-24 h-24 object-cover rounded-md" />
            <div className="mt-2 flex gap-2">
              {/* Replace Image */}
              <Input type="file" onChange={(e) => handleReplaceImage(index, e)} className="text-xs" />
              {/* Remove Image */}
              <button onClick={() => handleRemoveImage(index)} className="text-red-500 text-sm font-bold">
                Remove
              </button>
            </div>
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
