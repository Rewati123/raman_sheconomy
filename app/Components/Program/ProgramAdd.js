import React, { useState } from "react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/Components/ui/accordion"
import Seo from "./Seo"
import axios from "axios"
import { saveImage } from '../../../utils/imageUpload'

const ProgramAdd = ({ setdataadd, onSubmitData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    shortDescription: "",
    description: "",
    idealForDescription: "",
    timelineDescription: "",
    startDate: "",
    endDate: "",
    benefits: [{ title: "", description: "", icon: null }],
    testimonials: [{ name: "", profile: null, designation: "", message: "" }],
    image: null,
  })
  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    og_title: "",
    metaKeywords: [],
    ogImages: [],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleBenefitChange = (index, field, value) => {
    setFormData((prev) => {
      const newBenefits = [...prev.benefits]
      newBenefits[index] = {
        ...newBenefits[index],
        [field]: value,
      }
      return {
        ...prev,
        benefits: newBenefits,
      }
    })
  }

  const handleTestimonialChange = (index, field, value) => {
    setFormData((prev) => {
      const newTestimonials = [...prev.testimonials]
      newTestimonials[index] = {
        ...newTestimonials[index],
        [field]: value,
      }
      return {
        ...prev,
        testimonials: newTestimonials,
      }
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }))
    }
  }

  const handleSeoChange = (newSeoData) => {
    setSeoData(newSeoData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
  
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("subtitle", formData.subtitle);
      form.append("shortDescription", formData.shortDescription);
      form.append("description", formData.description);
      form.append("idealForDescription", formData.idealForDescription);
      form.append("timelineDescription", formData.timelineDescription);
      form.append("startDate", formData.startDate);
      form.append("endDate", formData.endDate);
  
      // **Program Image**
      if (formData.image) {
        form.append("image", formData.image);
      }
  
      // **Benefits Images**
      formData.benefits.forEach((benefit, index) => {
        form.append(`benefits[${index}][title]`, benefit.title);
        form.append(`benefits[${index}][description]`, benefit.description);
        if (benefit.icon) {
          form.append(`benefits[${index}][icon]`, benefit.icon);
        }
      });
  
      // **Testimonials Images**
      formData.testimonials.forEach((testimonial, index) => {
        form.append(`testimonials[${index}][name]`, testimonial.name);
        form.append(`testimonials[${index}][designation]`, testimonial.designation);
        form.append(`testimonials[${index}][message]`, testimonial.message);
        if (testimonial.profile) {
          form.append(`testimonials[${index}][profile]`, testimonial.profile);
        }
      });
  
     
      form.append("metaTitle", seoData.metaTitle)
      form.append("metaDescription", seoData.metaDescription)
      form.append("metaKeywords", seoData.metaKeywords)
      form.append("ogTitle", seoData.ogTitle);
      if (seoData.ogImages && seoData.ogImages.length > 0) {
        seoData.ogImages.forEach((image) => {
          form.append("ogImage", image)
        })
      }




      const response = await axios.post("/api/program", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Program added successfully", response.data)
    
      setdataadd(false);
    } catch (error) {
      console.error("Error adding program", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="basic-info">
          <AccordionTrigger>Basic Information</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full min-h-[100px] p-2 border rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="image">Program Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  required
                />
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
                <textarea
                  id="idealForDescription"
                  name="idealForDescription"
                  value={formData.idealForDescription}
                  onChange={handleChange}
                  required
                  className="w-full min-h-[100px] p-2 border rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="timelineDescription">Timeline Description</Label>
                <textarea
                  id="timelineDescription"
                  name="timelineDescription"
                  value={formData.timelineDescription}
                  onChange={handleChange}
                  required
                  className="w-full min-h-[100px] p-2 border rounded-md"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="dates">
          <AccordionTrigger>Dates & Timeline</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="benefits">
          <AccordionTrigger>Benefits</AccordionTrigger>
          <AccordionContent>
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="space-y-4 mb-4 p-4 border rounded-md">
                <div>
                  <Label>Benefit Title</Label>
                  <Input
                    value={benefit.title}
                    onChange={(e) => handleBenefitChange(index, 'title', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Benefit Description</Label>
                  <textarea
                    value={benefit.description}
                    onChange={(e) => handleBenefitChange(index, 'description', e.target.value)}
                    required
                    className="w-full min-h-[100px] p-2 border rounded-md"
                  />
                </div>
                <div>
                  <Label>Icon</Label>
                  <Input
                    type="file"
                    onChange={(e) => handleBenefitChange(index, 'icon', e.target.files?.[0])}
                    accept="image/*"
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                benefits: [...prev.benefits, { title: "", description: "", icon: null }]
              }))}
            >
              Add Benefit
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="testimonials">
          <AccordionTrigger>Testimonials</AccordionTrigger>
          <AccordionContent>
            {formData.testimonials.map((testimonial, index) => (
              <div key={index} className="space-y-4 mb-4 p-4 border rounded-md">
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
                  <Input
                    type="file"
                    onChange={(e) => handleTestimonialChange(index, 'profile', e.target.files?.[0])}
                    accept="image/*"
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                testimonials: [...prev.testimonials, { name: "", designation: "", message: "", profile: null }]
              }))}
            >
              Add Testimonial
            </Button>
          </AccordionContent>
        </AccordionItem>

       
      </Accordion>
      <Seo onSeoChange={handleSeoChange} />
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => setdataadd(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Program'}
        </Button>
      </div>
    </form>
  )
}

export default ProgramAdd