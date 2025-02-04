"use client";

import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import axios from "axios";

const ProgramEdit = ({ data, setdataadd, onSubmit, eduData }) => {
  const [formData, setFormData] = useState({
    title: eduData.title || "",
    subtitle: eduData.subtitle || "",
    shortDescription: eduData.shortDescription || "",
    description: eduData.description || "",
    image: eduData.image || null,
    benefits: eduData.benefits || [{ icon: "", title: "", description: "" }],
    idealForDescription: eduData.idealForDescription || "",
    timelineDescription: eduData.timelineDescription || "",
    startDate: eduData.startDate || "",
    endDate: eduData.endDate || "",
    testimonial: eduData.testimonial || {
      name: "",
      profile: "",
      designation: "",
      message: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("testimonial.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        testimonial: { ...prev.testimonial, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBenefitChange = (e, index) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedBenefits = [...prev.benefits];
      updatedBenefits[index] = { ...updatedBenefits[index], [name]: value };
      return { ...prev, benefits: updatedBenefits };
    });
  };

  const handleBenefitAdd = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, { icon: "", title: "", description: "" }],
    }));
  };

  const handleIconChange = (e, index) => {
    const { files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => {
        const updatedBenefits = [...prev.benefits];
        updatedBenefits[index].icon = files[0];
        return { ...prev, benefits: updatedBenefits };
      });
    }
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "benefits") {
        formData.benefits.forEach((benefit, index) => {
          Object.keys(benefit).forEach((field) => {
            formDataObj.append(`benefits[${index}][${field}]`, benefit[field]);
          });
        });
      } else if (key === "testimonial") {
        Object.keys(formData.testimonial).forEach((field) => {
          formDataObj.append(`testimonial[${field}]`, formData.testimonial[field]);
        });
      } else if (key === "image" && formData[key]) {
        formDataObj.append("image", formData[key]);
      } else {
        formDataObj.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.put("/api/program", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("API Response:", response.data);
      if (onSubmit) onSubmit(response.data);
      setdataadd(false);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="max-w-full mx-auto mt-5 min-h-screen bg-white p-8">
      <Button className="cursor-pointer" style={{ backgroundColor: '#FF7F42' }} onClick={() => setdataadd(false)}>
        Back
      </Button>
      <h1 className="text-2xl font-bold mb-4">{data}</h1>
  <form method="POST" onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
      {/* Title and Subtitle in One Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            required
            className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
          />
        </div>
      </div>
  
      {/* Short Description and Description in One Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Input
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            required
            className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-1/2 p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
  
      {/* Image Upload */}
      <div className="flex flex-col">
        <Label htmlFor="image">Upload Image</Label>
        <Input
          type="file"
          id="image"
          name="image"
          onChange={handleImageChange}
          required
          className="mt-2 p-2 border border-gray-300 rounded-md w-1/2"
        />
      </div>
  
      {/* Benefits Section */}
      <div className="w-full">
        <Label>Benefits</Label>
        {formData.benefits.map((benefit, index) => (
          <div key={index} className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <Label htmlFor={`benefit-icon-${index}`}>Icon</Label>
                <Input
                  type="file"
                  id={`benefit-icon-${index}`}
                  name="icon"
                  onChange={(e) => handleIconChange(e, index)}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-1/2"
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor={`benefit-title-${index}`}>Benefit Title</Label>
                <Input
                  id={`benefit-title-${index}`}
                  name="title"
                  value={benefit.title}
                  onChange={(e) => handleBenefitChange(e, index)}
                  required
                  className="mt-2 p-2 border border-gray-300 rounded-md w-1/2"
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor={`benefit-description-${index}`}>Description</Label>
                <Input
                  id={`benefit-description-${index}`}
                  name="description"
                  value={benefit.description}
                  onChange={(e) => handleBenefitChange(e, index)}
                  required
                  className="mt-2 p-2 border border-gray-300 rounded-md w-1/2"
                />
              </div>
            </div>
          </div>
        ))}
        <Button
     
          className="mt-4"
          onClick={handleBenefitAdd}
          style={{ backgroundColor: '#FF7F42' }}
        >
          Add More Benefits
        </Button>
      </div>
  
      {/* Ideal For Description, Timeline Description, Start Date, End Date Section */}
      <div className="w-full mt-8">
        <Label>Program Details</Label>
        <div className="flex flex-col space-y-4 mt-4">
          <div className="flex flex-col">
            <Label htmlFor="idealForDescription">Ideal For Description</Label>
            <textarea
              id="idealForDescription"
              name="idealForDescription"
              value={formData.idealForDescription}
              onChange={handleChange}
              required
              className="w-1/2 p-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="timelineDescription">Timeline Description</Label>
            <textarea
              id="timelineDescription"
              name="timelineDescription"
              value={formData.timelineDescription}
              onChange={handleChange}
              required
              className="w-1/2 p-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="mt-2 p-2 border border-gray-300 rounded-md w-1/2"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="mt-2 p-2 border border-gray-300 rounded-md w-1/2"
            />
          </div>
        </div>
      </div>
  
      {/* Testimonial Section */}
      <div className="w-full mt-8">
        <Label>Testimonial</Label>
        <div className="flex flex-col space-y-4 mt-4">
          <div className="flex flex-col">
            <Label htmlFor="testimonial-name">Name</Label>
            <Input
              id="testimonial-name"
              name="testimonial.name"
              value={formData.testimonial.name}
              onChange={handleChange}
              required
              className="mt-2 p-2 border border-gray-300 rounded-md w-1/2"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="testimonial-profile">Profile</Label>
            <Input
              type="file"
              id="testimonial-profile"
              name="testimonial.profile"
              onChange={handleChange}
              className="mt-2 p-2 border border-gray-300 rounded-md w-1/2"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="testimonial-designation">Designation</Label>
            <Input
              id="testimonial-designation"
              name="testimonial.designation"
              value={formData.testimonial.designation}
              onChange={handleChange}
              required
              className="mt-2 p-2 border border-gray-300 rounded-md w-1/2"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="testimonial-message">Message</Label>
            <textarea
              id="testimonial-message"
              name="testimonial.message"
              value={formData.testimonial.message}
              onChange={handleChange}
              required
              className="w-1/2 p-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
  
      <Button
  type="submit"
  className="mt-6"
  style={{ backgroundColor: '#FF7F42' }}
>
  Add Program
</Button>

    </form>
    </div>
  );
};

export default ProgramEdit;
