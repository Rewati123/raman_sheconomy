"use client";

import { useState, useEffect } from "react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { X } from "lucide-react";

const SeoEdit = ({ seoData, onSeoChange }) => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const [metaTitle, setMetaTitle] = useState(seoData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(seoData?.metaDescription || "");
  const [ogTitle, setOgTitle] = useState(seoData?.ogTitle || "");

  // Keywords को हमेशा array के रूप में सेट करें
  const [keywords, setKeywords] = useState(
    Array.isArray(seoData?.metaKeywords)
      ? seoData?.metaKeywords
      : typeof seoData?.metaKeywords === "string"
      ? seoData?.metaKeywords.split(",").map((kw) => kw.trim())
      : []
  );

  const [currentKeyword, setCurrentKeyword] = useState("");

  // Images को सही से हैंडल करने के लिए 
  const [images, setImages] = useState(Array.isArray(seoData?.ogImages) ? seoData?.ogImages : []);

  useEffect(() => {
    onSeoChange({ metaTitle, metaDescription, ogTitle, metaKeywords: keywords, ogImages: images });
  }, [metaTitle, metaDescription, ogTitle, keywords, images]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prevImages) => [...prevImages, ...filePreviews]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => {
      const newImages = prevImages.filter((_, i) => i !== index);
      if (prevImages[index]?.preview) {
        URL.revokeObjectURL(prevImages[index].preview); // Memory cleanup
      }
      return newImages;
    });
  };

  const handleKeywordInput = (e) => setCurrentKeyword(e.target.value);

  const handleKeyDown = (e) => {
    if (["Enter", ",", " "].includes(e.key) && currentKeyword.trim() !== "") {
      e.preventDefault();
      if (!keywords.includes(currentKeyword.trim())) {
        setKeywords((prevKeywords) => [...prevKeywords, currentKeyword.trim()]);
      }
      setCurrentKeyword("");
    }
  };

  const handleRemoveKeyword = (index) => {
    setKeywords((prevKeywords) => prevKeywords.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 mx-auto">
      <button
        onClick={() => setOpenAccordion(openAccordion === 0 ? null : 0)}
        className="w-full flex justify-between items-center p-4 bg-gray-100 rounded-lg focus:outline-none"
      >
        <h1 className="text-2xl font-semibold">SEO</h1>
        <span>{openAccordion === 0 ? "−" : "+"}</span>
      </button>

      {openAccordion === 0 && (
        <div className="mt-4 space-y-4">
          <div>
            <Label>Meta Title</Label>
            <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
          </div>
          <div>
            <Label>Meta Description</Label>
            <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
          </div>
          <div>
            <Label>Meta Keywords</Label>
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md">
              {Array.isArray(keywords) &&
                keywords.map((keyword, index) => (
                  <div key={index} className="flex items-center bg-gray-200 rounded-full px-3 py-1">
                    <span className="text-sm">{keyword}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveKeyword(index)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              <Input
                value={currentKeyword}
                onChange={handleKeywordInput}
                onKeyDown={handleKeyDown}
                placeholder="Type keywords (Enter, comma, space)"
              />
            </div>
          </div>
          <div>
            <Label>OG Images</Label>
            <Input type="file" multiple onChange={handleFileUpload} accept="image/*" />
            <div className="mt-4 flex flex-wrap gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative w-32 h-32">
                  <img src={image.preview} alt="Preview" className="h-full w-full object-cover" />
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveImage(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label>OG Title</Label>
            <Input value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SeoEdit;
