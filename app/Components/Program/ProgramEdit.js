"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/Components/ui/accordion";
import axios from "axios";
import SeoEdit from "./SeoEdit";
import { X, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify"; // ✅ Toastify Import
import "react-toastify/dist/ReactToastify.css"; // ✅ Toastify CSS

const ProgramEdit = ({ eduData, setdataadd, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: eduData?.title || "",
    subtitle: eduData?.subtitle || "",
    shortDescription: eduData?.shortDescription || "",
    description: eduData?.description || "",
    image: eduData?.image || null,
    imagePreview: eduData?.image || null,
    benefits: (eduData?.benefits || [{ title: "", description: "", icon: null }]).map(benefit => ({
      ...benefit,
      preview: benefit.icon || null
    })),
    idealForDescription: eduData?.idealForDescription || "",
    timelineDescription: eduData?.timelineDescription || "",
    startDate: eduData?.startDate || "",
    endDate: eduData?.endDate || "",
    testimonials: (eduData?.testimonials || [{ name: "", designation: "", message: "", profile: null }]).map(testimonial => ({
      ...testimonial,
      preview: testimonial.profile || null
    })),
    seoData: eduData?.seo || { metaTitle: "", metaDescription: "", ogTitle: "", metaKeywords: [], ogImages: [] }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: preview
      }));
    }
  };

  const handleImageDelete = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  const handleBenefitChange = (index, field, value) => {
    setFormData((prev) => {
      const newBenefits = [...prev.benefits];
      if (field === 'icon' && value instanceof File) {
        const preview = URL.createObjectURL(value);
        newBenefits[index] = {
          ...newBenefits[index],
          icon: value,
          preview: preview
        };
      } else {
        newBenefits[index] = {
          ...newBenefits[index],
          [field]: value,
        };
      }
      return {
        ...prev,
        benefits: newBenefits,
      };
    });
  };

  const handleBenefitDelete = (index) => {
    setFormData((prev) => {
      const newBenefits = [...prev.benefits];
      if (newBenefits[index].preview) {
        URL.revokeObjectURL(newBenefits[index].preview);
      }
      newBenefits.splice(index, 1);
      return {
        ...prev,
        benefits: newBenefits
      };
    });
  };

  const handleBenefitImageDelete = (index) => {
    setFormData((prev) => {
      const newBenefits = [...prev.benefits];
      if (newBenefits[index].preview) {
        URL.revokeObjectURL(newBenefits[index].preview);
      }
      newBenefits[index] = {
        ...newBenefits[index],
        icon: null,
        preview: null
      };
      return {
        ...prev,
        benefits: newBenefits
      };
    });
  };

  const handleTestimonialChange = (index, field, value) => {
    setFormData((prev) => {
      const newTestimonials = [...prev.testimonials];
      if (field === 'profile' && value instanceof File) {
        const preview = URL.createObjectURL(value);
        newTestimonials[index] = {
          ...newTestimonials[index],
          profile: value,
          preview: preview
        };
      } else {
        newTestimonials[index] = {
          ...newTestimonials[index],
          [field]: value,
        };
      }
      return {
        ...prev,
        testimonials: newTestimonials,
      };
    });
  };

  const handleTestimonialDelete = (index) => {
    setFormData((prev) => {
      const newTestimonials = [...prev.testimonials];
      if (newTestimonials[index].preview) {
        URL.revokeObjectURL(newTestimonials[index].preview);
      }
      newTestimonials.splice(index, 1);
      return {
        ...prev,
        testimonials: newTestimonials
      };
    });
  };

  const handleTestimonialImageDelete = (index) => {
    setFormData((prev) => {
      const newTestimonials = [...prev.testimonials];
      if (newTestimonials[index].preview) {
        URL.revokeObjectURL(newTestimonials[index].preview);
      }
      newTestimonials[index] = {
        ...newTestimonials[index],
        profile: null,
        preview: null
      };
      return {
        ...prev,
        testimonials: newTestimonials
      };
    });
  };

  const handleSeoChange = (updatedSeoData) => {
    setFormData((prev) => ({
      ...prev,
      seoData: updatedSeoData,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("programId", eduData.programId || eduData.id);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subtitle", formData.subtitle);
      formDataToSend.append("shortDescription", formData.shortDescription);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("idealForDescription", formData.idealForDescription);
      formDataToSend.append("timelineDescription", formData.timelineDescription);
      formDataToSend.append("startDate", formData.startDate);
      formDataToSend.append("endDate", formData.endDate);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (formData.seoData) {
        formDataToSend.append("metaTitle", formData.seoData.metaTitle || "");
        formDataToSend.append("metaDescription", formData.seoData.metaDescription || "");
        formDataToSend.append("ogTitle", formData.seoData.ogTitle || "");
        formDataToSend.append("metaKeywords", JSON.stringify(formData.seoData.metaKeywords || []));
        if (formData.seoData.ogImages?.length > 0) {
          formDataToSend.append("ogImage", formData.seoData.ogImages[0]);
        }
      }

      if (Array.isArray(formData.benefits)) {
        formData.benefits.forEach((benefit, index) => {
          formDataToSend.append(`benefits[${index}][id]`, benefit.id || "");
          formDataToSend.append(`benefits[${index}][title]`, benefit.title);
          formDataToSend.append(`benefits[${index}][description]`, benefit.description);
          if (benefit.icon) {
            formDataToSend.append(`benefits[${index}][icon]`, benefit.icon);
          }
        });
      }

      if (Array.isArray(formData.testimonials)) {
        formData.testimonials.forEach((testimonial, index) => {
          formDataToSend.append(`testimonials[${index}][id]`, testimonial.id || "");
          formDataToSend.append(`testimonials[${index}][name]`, testimonial.name);
          formDataToSend.append(`testimonials[${index}][designation]`, testimonial.designation);
          formDataToSend.append(`testimonials[${index}][message]`, testimonial.message);
          if (testimonial.profile) {
            formDataToSend.append(`testimonials[${index}][profile]`, testimonial.profile);
          }
        });
      }

      const response = await axios.put("/api/program", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 && response.data.success !== false) {
       
          toast.success(data.message || "Program updated  successfully!");
        if (onSubmit) {
          onSubmit(response.data);
        }
      } else {
          toast.error(data.message || "No changes detected. Update not performed.");
      }
    } catch (error) {
      console.error("Error updating program:", error);
      alert("Error updating program. Please try again.");
    }
    setdataadd(false);
  };

  return (

    <>
        <ToastContainer />
        <form onSubmit={handleSubmit} className="space-y-8 p-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="basic-info">
          <AccordionTrigger>Basic Information</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="w-full min-h-[100px] p-2 border rounded-md" />
              </div>
              <div>
                <Label htmlFor="image">Program Image</Label>
                <div className="space-y-2">
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  {formData.imagePreview && (
                    <div className="relative w-40 h-40">
                      <img
                        src={formData.imagePreview}
                        alt="Program preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={handleImageDelete}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="program-details">
          <AccordionTrigger>Program Details</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="idealForDescription">Ideal For Description</Label>
                <textarea id="idealForDescription" name="idealForDescription" value={formData.idealForDescription} onChange={handleChange} required className="w-full min-h-[100px] p-2 border rounded-md" />
              </div>
              <div>
                <Label htmlFor="timelineDescription">Timeline Description</Label>
                <textarea id="timelineDescription" name="timelineDescription" value={formData.timelineDescription} onChange={handleChange} required className="w-full min-h-[100px] p-2 border rounded-md" />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Benefits</h2>
        {formData.benefits.map((benefit, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium">Benefit {index + 1}</h3>
              <button
                type="button"
                onClick={() => handleBenefitDelete(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={benefit.title}
                onChange={(e) => handleBenefitChange(index, 'title', e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                value={benefit.description}
                onChange={(e) => handleBenefitChange(index, 'description', e.target.value)}
                required
                className="w-full min-h-[100px] p-2 border rounded-md"
              />
            </div>
            <div>
              <Label>Icon</Label>
              <div className="space-y-2">
                <Input
                  type="file"
                  onChange={(e) => handleBenefitChange(index, 'icon', e.target.files?.[0])}
                  accept="image/*"
                />
                {benefit.preview && (
                  <div className="relative w-24 h-24">
                    <img
                      src={benefit.preview}
                      alt={`Benefit ${index + 1} icon`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleBenefitImageDelete(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <Button
          type="button"
          onClick={() => setFormData(prev => ({
            ...prev,
            benefits: [...prev.benefits, { title: "", description: "", icon: null, preview: null }]
          }))}
        >
          Add Benefit
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Testimonials</h2>
        {formData.testimonials.map((testimonial, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium">Testimonial {index + 1}</h3>
              <button
                type="button"
                onClick={() => handleTestimonialDelete(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div>
              <Label>Name</Label>
              <Input
                value={testimonial.name}
                onChange={(e) => handleTestimonialChange(index, 'name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Designation</Label>
              <Input
                value={testimonial.designation}
                onChange={(e) => handleTestimonialChange(index, 'designation', e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Message</Label>
              <textarea
                value={testimonial.message}
                onChange={(e) => handleTestimonialChange(index, 'message', e.target.value)}
                required
                className="w-full min-h-[100px] p-2 border rounded-md"
              />
            </div>
            <div>
              <Label>Profile Picture</Label>
              <div className="space-y-2">
                <Input
                  type="file"
                  onChange={(e) => handleTestimonialChange(index, 'profile', e.target.files?.[0])}
                  accept="image/*"
                />
                {testimonial.preview && (
                  <div className="relative w-24 h-24">
                    <img
                      src={testimonial.preview}
                      alt={`${testimonial.name}'s profile`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleTestimonialImageDelete(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <Button
          type="button"
          onClick={() => setFormData(prev => ({
            ...prev,
            testimonials: [...prev.testimonials, { name: "", designation: "", message: "", profile: null, preview: null }]
          }))}
        >
          Add Testimonial
        </Button>
      </div>

      <SeoEdit seoData={formData.seoData} setSeoData={handleSeoChange} />

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => setdataadd(false)}>Cancel</Button>
        <Button type="submit">Save Program</Button>
      </div>
    </form>
    
    </>
  
  );
};

export default ProgramEdit;