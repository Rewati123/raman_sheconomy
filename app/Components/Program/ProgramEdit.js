"use client";

import React, { useState,useEffect  } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/Components/ui/accordion";
import axios from "axios";
import SeoEdit from "./SeoEdit";
const ProgramEdit = ({ eduData, setdataadd, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: eduData?.title || "",
    subtitle: eduData?.subtitle || "",
    shortDescription: eduData?.shortDescription || "",
    description: eduData?.description || "",
    image: eduData?.image || null,
    benefits: eduData?.benefits || [{ title: "", description: "", icon: null }],
    idealForDescription: eduData?.idealForDescription || "",
    timelineDescription: eduData?.timelineDescription || "",
    startDate: eduData?.startDate || "",
    endDate: eduData?.endDate || "",
    testimonials: eduData?.testimonials || [{ name: "", designation: "", message: "", profile: null }],
    seoData: eduData?.seo || { metaTitle: "", metaDescription: "", ogTitle: "", metaKeywords: [], ogImages: [] }

    
  });
  

  
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleBenefitChange = (index, field, value) => {
    const updatedBenefits = [...formData.benefits];
    updatedBenefits[index][field] = value;
    setFormData((prev) => ({ ...prev, benefits: updatedBenefits }));
  };

  const handleBenefitAdd = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, { title: "", description: "", icon: null }],
    }));
  };

  const handleTestimonialChange = (index, field, value) => {
    const updatedTestimonials = [...formData.testimonials];
    updatedTestimonials[index][field] = value;
    setFormData((prev) => ({ ...prev, testimonials: updatedTestimonials }));
  };

  const handleTestimonialAdd = () => {
    setFormData((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, { name: "", designation: "", message: "", profile: null }],
    }));
  };



  const handleSeoChange = (updatedSeoData) => {
    setFormData((prev) => ({
      ...prev,
      seoData: {
        ...prev.seoData,  
        ...updatedSeoData, 
      },
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const formDataToSend = new FormData();
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

        formData.benefits.forEach((benefit, index) => {
            formDataToSend.append(`benefits[${index}][title]`, benefit.title);
            formDataToSend.append(`benefits[${index}][description]`, benefit.description);
            if (benefit.icon) {
                formDataToSend.append(`benefits[${index}][icon]`, benefit.icon);
            }
        });

        formData.testimonials.forEach((testimonial, index) => {
            formDataToSend.append(`testimonials[${index}][name]`, testimonial.name);
            formDataToSend.append(`testimonials[${index}][designation]`, testimonial.designation);
            formDataToSend.append(`testimonials[${index}][message]`, testimonial.message);
            if (testimonial.profile) {
                formDataToSend.append(`testimonials[${index}][profile]`, testimonial.profile);
            }
        });

        formDataToSend.append("metaTitle", formData.seoData.metaTitle);
        formDataToSend.append("metaDescription", formData.seoData.metaDescription);
        formDataToSend.append("ogTitle", formData.seoData.ogTitle);

        if (formData.seoData.metaKeywords.length > 0) {
            formDataToSend.append("metaKeywords", JSON.stringify(formData.seoData.metaKeywords));
        }

        if (formData.seoData.ogImages.length > 0) {
            formData.seoData.ogImages.forEach((image, index) => {
                formDataToSend.append(`ogImages[${index}]`, image);
            });
        }

        const response = await axios.put("/api/program", formDataToSend, {
            headers: {
                "Content-Type": "multipart/form-data",
            
            },
        });

        if (response.status === 200) {
            console.log("Program updated successfully");
            setdataadd(false);
            if (onSubmit) onSubmit();
        }
    } catch (error) {
        console.error("Error updating program:", error);
    }
};





  
  console.log("eduData:", eduData);
 
  console.log("SEO Data from API:", eduData?.seo);
 
  


  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="basic-info">
          <AccordionTrigger>Basic Information</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange} required />
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleChange} required />
              <Label htmlFor="description">Description</Label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="w-full min-h-[100px] p-2 border rounded-md" />
              <Label htmlFor="image">Program Image</Label>
              <Input id="image" name="image" type="file" onChange={handleImageChange} accept="image/*" />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="program-details">
          <AccordionTrigger>Program Details</AccordionTrigger>
          <AccordionContent>
            <Label htmlFor="idealForDescription">Ideal For Description</Label>
            <textarea id="idealForDescription" name="idealForDescription" value={formData.idealForDescription} onChange={handleChange} required className="w-full min-h-[100px] p-2 border rounded-md" />
            <Label htmlFor="timelineDescription">Timeline Description</Label>
            <textarea id="timelineDescription" name="timelineDescription" value={formData.timelineDescription} onChange={handleChange} required className="w-full min-h-[100px] p-2 border rounded-md" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="benefits">
          <AccordionTrigger>Benefits</AccordionTrigger>
          <AccordionContent>
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="space-y-4 mb-4 p-4 border rounded-md">
                <Label>Benefit Title</Label>
                <Input value={benefit.title} onChange={(e) => handleBenefitChange(index, "title", e.target.value)} required />
                <Label>Benefit Description</Label>
                <textarea value={benefit.description} onChange={(e) => handleBenefitChange(index, "description", e.target.value)} required className="w-full min-h-[100px] p-2 border rounded-md" />
                <Label>Icon</Label>
                <Input type="file" onChange={(e) => handleBenefitChange(index, "icon", e.target.files?.[0])} accept="image/*" />
              </div>
            ))}
            <Button type="button" onClick={handleBenefitAdd}>Add Benefit</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="testimonials">
          <AccordionTrigger>Testimonials</AccordionTrigger>
          <AccordionContent>
            {formData.testimonials.map((testimonial, index) => (
              <div key={index} className="space-y-4 mb-4 p-4 border rounded-md">
                <Label>Name</Label>
                <Input value={testimonial.name} onChange={(e) => handleTestimonialChange(index, "name", e.target.value)} required />
                <Label>Designation</Label>
                <Input value={testimonial.designation} onChange={(e) => handleTestimonialChange(index, "designation", e.target.value)} required />
                <Label>Message</Label>
                <textarea value={testimonial.message} onChange={(e) => handleTestimonialChange(index, "message", e.target.value)} required className="w-full min-h-[100px] p-2 border rounded-md" />
                <Label>Profile Picture</Label>
                <Input type="file" onChange={(e) => handleTestimonialChange(index, "profile", e.target.files?.[0])} accept="image/*" />
              </div>
            ))}
            <Button type="button" onClick={handleTestimonialAdd}>Add Testimonial</Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <SeoEdit seoData={formData.seoData} onSeoChange={handleSeoChange} />

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => setdataadd(false)}>Cancel</Button>
        <Button type="submit">Save Program</Button>
      </div>
    </form>
  );
};

export default ProgramEdit;
