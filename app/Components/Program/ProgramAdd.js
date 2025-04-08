import React, { useState } from "react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/Components/ui/accordion"
import Seo from "./Seo"
import axios from "axios"
import { saveImage } from '../../../utils/imageUpload'
import { X, Trash2 } from "lucide-react" 
import { ToastContainer, toast } from "react-toastify"; // ✅ Toastify Import
import "react-toastify/dist/ReactToastify.css"; // ✅ Toastify CSS

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
    benefits: [{ title: "", description: "", icon: null, preview: null }],
    testimonials: [{ name: "", profile: null, designation: "", message: "", preview: null }],
    image: null,
    imagePreview: null,
  })
  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    ogTitle: "",
    metaKeywords: [],
    ogDescription: "",
    ogImages: [],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const preview = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: preview
      }))
    }
  }

  const handleImageDelete = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }))
  }

  const handleBenefitChange = (index, field, value) => {
    setFormData((prev) => {
      const newBenefits = [...prev.benefits]
      if (field === 'icon' && value instanceof File) {
        const preview = URL.createObjectURL(value)
        newBenefits[index] = {
          ...newBenefits[index],
          icon: value,
          preview: preview
        }
      } else {
        newBenefits[index] = {
          ...newBenefits[index],
          [field]: value,
        }
      }
      return {
        ...prev,
        benefits: newBenefits,
      }
    })
  }

  const handleBenefitDelete = (index) => {
    setFormData((prev) => {
      const newBenefits = [...prev.benefits]
      if (newBenefits[index].preview) {
        URL.revokeObjectURL(newBenefits[index].preview)
      }
      newBenefits.splice(index, 1)
      return {
        ...prev,
        benefits: newBenefits
      }
    })
  }

  const handleBenefitImageDelete = (index) => {
    setFormData((prev) => {
      const newBenefits = [...prev.benefits]
      if (newBenefits[index].preview) {
        URL.revokeObjectURL(newBenefits[index].preview)
      }
      newBenefits[index] = {
        ...newBenefits[index],
        icon: null,
        preview: null
      }
      return {
        ...prev,
        benefits: newBenefits
      }
    })
  }

  const handleTestimonialChange = (index, field, value) => {
    setFormData((prev) => {
      const newTestimonials = [...prev.testimonials]
      if (field === 'profile' && value instanceof File) {
        const preview = URL.createObjectURL(value)
        newTestimonials[index] = {
          ...newTestimonials[index],
          profile: value,
          preview: preview
        }
      } else {
        newTestimonials[index] = {
          ...newTestimonials[index],
          [field]: value,
        }
      }
      return {
        ...prev,
        testimonials: newTestimonials,
      }
    })
  }

  const handleTestimonialDelete = (index) => {
    setFormData((prev) => {
      const newTestimonials = [...prev.testimonials]
      if (newTestimonials[index].preview) {
        URL.revokeObjectURL(newTestimonials[index].preview)
      }
      newTestimonials.splice(index, 1)
      return {
        ...prev,
        testimonials: newTestimonials
      }
    })
  }

  const handleTestimonialImageDelete = (index) => {
    setFormData((prev) => {
      const newTestimonials = [...prev.testimonials]
      if (newTestimonials[index].preview) {
        URL.revokeObjectURL(newTestimonials[index].preview)
      }
      newTestimonials[index] = {
        ...newTestimonials[index],
        profile: null,
        preview: null
      }
      return {
        ...prev,
        testimonials: newTestimonials
      }
    })
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
  
      if (formData.image) {
        form.append("image", formData.image);
      }
  
      formData.benefits.forEach((benefit, index) => {
        form.append(`benefits[${index}][title]`, benefit.title);
        form.append(`benefits[${index}][description]`, benefit.description);
        if (benefit.icon) {
          form.append(`benefits[${index}][icon]`, benefit.icon);
        }
      });
  
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
      form.append("ogDescription", seoData.ogDescription)
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
      toast.success(response.data.message || "Program added successfully!");
      setdataadd(false);
    } catch (error) {
      console.error("Error adding program", error);
      toast.error(error.response?.data?.message || "Error adding program");
    } finally {
      setIsSubmitting(false);
    }
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
                <div className="space-y-2">
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    required={!formData.image}
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
    </>
   
  )
}

export default ProgramAdd