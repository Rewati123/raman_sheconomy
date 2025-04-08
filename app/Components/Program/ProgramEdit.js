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
import Seo from "./Seo"

const ProgramEdit = ({ eduData, setdataadd, onSubmit,programId }) => {
  const [seoData, setSeoData] = useState({})
  const [newBenefit, setNewBenefit] = useState({
    title: "",
    description: "",
    icon: null,
  });
  const [newTestimonial, setNewTestimonial] = useState({ name: "", profile: null, designation: "", message: "", preview: null });
  
  const [formData, setFormData] = useState({
    id: eduData.id ,
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
    seoData: {
      id: eduData.programId || "",  
      seoid: eduData.seo.seoid || "", 
      metaTitle: eduData?.seo?.metaTitle || "",
      metaDescription: eduData?.seo?.metaDescription || "",
      ogTitle: eduData?.seo?.ogTitle || "",
      metaKeywords: eduData?.seo?.metaKeywords || [],
      ogDescription:eduData?.seo?.ogDescription||"",
      ogImages: eduData?.seo?.ogImages || []
    }
    
  });
console.log(eduData,"hhhhhhhhhhhhhh")
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };
      console.log("Updated Form Data:", updatedForm); 
      return updatedForm;
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData((prev) => {
        const updatedForm = { ...prev, image: file, imagePreview: preview };
        console.log("Image Selected:", updatedForm); 
        return updatedForm;
      });
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

  // const handleBenefitDelete = (index) => {
  //   setFormData((prev) => {
  //     const newBenefits = [...prev.benefits];
  //     if (newBenefits[index].preview) {
  //       URL.revokeObjectURL(newBenefits[index].preview);
  //     }
  //     newBenefits.splice(index, 1);
  //     return {
  //       ...prev,
  //       benefits: newBenefits
  //     };
  //   });
  // };

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

  // const handleTestimonialDelete = (index) => {
  //   setFormData((prev) => {
  //     const newTestimonials = [...prev.testimonials];
  //     if (newTestimonials[index].preview) {
  //       URL.revokeObjectURL(newTestimonials[index].preview);
  //     }
  //     newTestimonials.splice(index, 1);
  //     return {
  //       ...prev,
  //       testimonials: newTestimonials
  //     };
  //   });
  // };

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





  const handleBenefitUpdate = async (index) => {
   
    try {
    

      const benefit = formData.benefits[index];

      if (!benefit?.benefitId) {
        toast.error("Benefit ID missing!");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("action", "update");
      formDataToSend.append("title", benefit.title);
      formDataToSend.append("description", benefit.description);

      if (benefit.icon) {
        formDataToSend.append("icon", benefit.icon);
      }

      
      const apiUrl = `/api/program/${eduData?.programId}?benefitId=${benefit?.benefitId}`;
      console.log("API URL:", apiUrl);
      
      const response = await axios.put(apiUrl, formDataToSend);

      if (response.status === 200) {
        toast.success("Benefit updated successfully!");
      } else {
        toast.error("Failed to update benefit.");
      }
    } catch (error) {
      console.error("Error updating benefit:", error);
      toast.error("Something went wrong!");
    }
  };

  


  const handleBenefitDelete = async (index) => {
    try {
      const benefit = formData.benefits[index];
  
      if (!benefit?.benefitId) {
        // **If benefit is not saved in DB, just remove from UI**
        setFormData((prev) => ({
          ...prev,
          benefits: prev.benefits.filter((_, i) => i !== index),
        }));
        return;
      }
  
      // **Same URL Structure as PUT request**
      const apiUrl = `/api/program/${eduData?.programId}?benefitId=${benefit?.benefitId}`;
  
      console.log("API URL:", apiUrl);
  
      // **Optimistically remove benefit from UI**
      setFormData((prev) => ({
        ...prev,
        benefits: prev.benefits.filter((_, i) => i !== index),
      }));
  
      const response = await axios.delete(apiUrl);
  
      if (response.status === 200) {
        toast.success("Benefit deleted successfully!");
      } else {
        throw new Error("Failed to delete benefit.");
      }
    } catch (error) {
      console.error("Error deleting benefit:", error);
      toast.error("Something went wrong! Please try again.");
    }
  };
  
  
                                                                                                                     
  
  
  const handleAddBenefit = async (benefitId) => {
    try {
      const formData = new FormData();
      // formData.append("programId", programId);
      formData.append("title", newBenefit.title);
      formData.append("description", newBenefit.description);
      formData.append("action", "create");
      if (newBenefit.icon) {
        formData.append("icon", newBenefit.icon);
      }
 

      const apiUrl = `/api/program/${benefitId}?action=create`;
  
      const response = await axios.put(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 200) {
        toast.success("✅ Benefit added successfully!");
        setNewBenefit({ title: "", description: "", icon: null });
      } else {
        toast.error("⚠️ Failed to add benefit.");
      }
    } catch (error) {
      console.error("❌ Error adding benefit:", error);
      toast.error("Something went wrong! Please try again.");
    }
  };
  
  

  const handleAddTestimonial = async () => {
    try {
      const formData = new FormData();
      formData.append("programId", newTestimonial.programId);
      formData.append("name", newTestimonial.name);
      formData.append("designation", newTestimonial.designation);
      formData.append("message", newTestimonial.message);
      formData.append("action", "create");
      if (newTestimonial.profile) {
        formData.append("profile", newTestimonial.profile);
      }
  
  
  
      const apiUrl = `/api/program/tesmonial/testimonial `;
  
      const response = await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        toast.success("✅ Testimonial added successfully!");
      } else {
        toast.error("❌ Failed to add testimonial.");
      }
    } catch (error) {
      console.error("❌ Error adding testimonial:", error);
      toast.error("❌ Something went wrong!");
    }
  };
  

  const handleTestimonialUpdate = async (index) => {
    try {
      const testimonial = formData.testimonials[index];
  
      if (!testimonial?.testimonialId) {
        toast.error("Testimonial ID missing!");
        return;
      }
  
      const formDataToSend = new FormData();
      formDataToSend.append("action", "update");
      formDataToSend.append("name", testimonial.name);
      formDataToSend.append("designation", testimonial.designation);
      formDataToSend.append("message", testimonial.message);
  
     
      if (testimonial.profile instanceof File) {
        formDataToSend.append("profile", testimonial.profile);
      }
  
      // ✅ API URL Generate
      const apiUrl = `/api/program/${eduData?.programId}?testimonialId=${testimonial?.testimonialId}`;
      console.log("API URL:", apiUrl);
  
      const response = await axios.put(apiUrl, formDataToSend);
  
      if (response.status === 200) {
        toast.success("Testimonial updated successfully!");
      } else {
        toast.error("Failed to update testimonial.");
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast.error("Something went wrong!");
    }
  };
  

  const handleTestimonialDelete = async (index) => {
    try {
      const testimonialId = formData.testimonials[index]?.id;
      
      if (!testimonialId) {
        setFormData((prev) => ({
          ...prev,
          testimonials: prev.testimonials.filter((_, i) => i !== index),
        }));
        return;
      }
  
      const response = await axios.delete(`/api/program/${eduData.programId}/testimonial/${testimonialId}`);
  
      if (response.status === 200) {
        toast.success("Testimonial deleted successfully!");
        setFormData((prev) => ({
          ...prev,
          testimonials: prev.testimonials.filter((_, i) => i !== index),
        }));
      } else {
        toast.error("Failed to delete testimonial.");
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Something went wrong!");
    }
  };












  const handleSeoChange = (updatedSeoData) => {
    setFormData((prev) => ({
      ...prev,
      seoData: {
        ...(prev.seoData || {}), 
        ...updatedSeoData, 
      },
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

      // if (formData.seoData) {
      //   formDataToSend.append("metaTitle", formData.seoData.metaTitle || "");
      //   formDataToSend.append("metaDescription", formData.seoData.metaDescription || "");
      //   formDataToSend.append("metaKeywords", JSON.stringify(formData.seoData.metaKeywords || []));
      //   formDataToSend.append("ogTitle", formData.seoData.ogTitle || "");
      //   formDataToSend.append("ogDescription", formData.seoData.ogDescription || "");
        
      //   const ogImagesArray = Array.isArray(formData.seoData.ogImages) ? formData.seoData.ogImages : [];

      //   ogImagesArray.forEach((image, index) => {
      //       formDataToSend.append(`ogImages[${index}]`, image);
      //   });
      // }
      
  
      const response = await axios.put(`/api/program/${eduData.programId}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
     
  
      if (response.status === 200 && response.data.success !== false) {
        toast.success(response.data.message || "Program updated successfully!");
        if (onSubmit) {
          onSubmit(response.data);
        }
      } else {
        toast.error(response.data.message || "No changes detected. Update not performed.");
      }
  
    } catch (error) {
      console.error("Error updating program:", error); // ✅ Error handling में भी प्रिंट करें
      toast.error(error.response?.data?.message || "Something went wrong!");
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

      {/* Title Input */}
      <div className="flex items-center space-x-4">
        <Label>Title</Label>
        <Input
          type="text"
          value={benefit.title}
          onChange={(e) => handleBenefitChange(index, "title", e.target.value)}
          required
        />
      </div>

      {/* Description Input */}
      <div className="flex flex-col space-y-2">
        <Label>Description</Label>
        <textarea
          value={benefit.description}
          onChange={(e) => handleBenefitChange(index, "description", e.target.value)}
          required
          className="w-full min-h-[100px] p-2 border rounded-md"
        />
      </div>

      {/* Icon Upload */}
      <div className="space-y-2">
        <Label>Icon</Label>
        <Input
          type="file"
          onChange={(e) => handleBenefitChange(index, "icon", e.target.files?.[0])}
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

      {/* Update Button */}
      <Button onClick={() => handleBenefitUpdate(index)}>Update</Button>
      <Button onClick={() => handleAddBenefit(index)}>Add</Button>
    </div>
  ))}

  {/* Add Benefit Button */}
  <Button
    type="button"
    onClick={() =>
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, { title: "", description: "", icon: null, preview: null }],
      }))
    }
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
      
      {/* Name Input */}
      <div className="flex items-center space-x-4">
        <Label>Name</Label>
        <Input
          type="text"
          value={testimonial.name}
          onChange={(e) => handleTestimonialChange(index, "name", e.target.value)}
          required
        />
      </div>

      {/* Designation Input */}
      <div className="flex items-center space-x-4">
        <Label>Designation</Label>
        <Input
          type="text"
          value={testimonial.designation}
          onChange={(e) => handleTestimonialChange(index, "designation", e.target.value)}
          required
        />
      </div>

      {/* Message Input */}
      <div className="flex flex-col space-y-2">
        <Label>Message</Label>
        <textarea
          value={testimonial.message}
          onChange={(e) => handleTestimonialChange(index, "message", e.target.value)}
          required
          className="w-full min-h-[100px] p-2 border rounded-md"
        />
      </div>

      {/* Profile Picture Upload */}
      <div className="space-y-2">
        <Label>Profile Picture</Label>
        <Input
          type="file"
          onChange={(e) => handleTestimonialChange(index, "profile", e.target.files?.[0])}
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

      {/* Update Button */}
      <Button onClick={() => handleTestimonialUpdate(index)}>Update</Button>
      <Button onClick={() => handleAddTestimonial ((programId))}>Add</Button>
    </div>
  ))}
  
  {/* Add Testimonial Button */}
  <Button
    type="button"
    onClick={() =>
      setFormData((prev) => ({
        ...prev,
        testimonials: [...prev.testimonials, { name: "", designation: "", message: "", profile: null, preview: null }],
      }))
    }
  >
    Add Testimonial
  </Button>
</div>


      <SeoEdit seoData={formData.seoData}  setSeoData={handleSeoChange} />

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => setdataadd(false)}>Cancel</Button>
        <Button type="submit">Save Program</Button>
      </div>
    </form>
    
    </>
  
  );
};

export default ProgramEdit;