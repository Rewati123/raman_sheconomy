"use client"

import { useState } from "react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/Components/ui/accordion"
import Seo from "./Seo"
import axios from "axios"

const ProgramAdd = ({ setdataadd, onSubmitData }) => {
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
  const handleChange = (e, index) => {
    const { name, value, files } = e.target

    if (name.startsWith("testimonial.")) {
      const field = name.split(".")[1]
      if (field === "profile" && files && files[0]) {
        setFormData((prev) => ({
          ...prev,
          testimonial: { ...prev.testimonials, [field]: files[0] },
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          testimonial: { ...prev.testimonials, [field]: value },
        }))
      }
    } else if (name === "benefits" && index !== undefined) {
      setFormData((prev) => {
        const updatedBenefits = [...prev.benefits]
        updatedBenefits[index] = { ...updatedBenefits[index], [name]: value }
        return { ...prev, benefits: updatedBenefits }
      })
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleBenefitAdd = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, { icon: "", title: "", description: "" }],
    }))
  }

  const handleIconChange = (e, index) => {
    const { files } = e.target
    if (files && files[0]) {
      const updatedBenefits = [...formData.benefits]
      updatedBenefits[index].icon = files[0]
      setFormData((prev) => ({ ...prev, benefits: updatedBenefits }))
    }
  }

  const handleImageChange = (e) => {
    const { files } = e.target
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, image: files[0] }))
    }
  }

  const handleBenefitChange = (e, index) => {
    const { name, value } = e.target
    const updatedBenefits = [...formData.benefits]
    updatedBenefits[index] = { ...updatedBenefits[index], [name]: value }

    setFormData((prevData) => ({
      ...prevData,
      benefits: updatedBenefits,
    }))
  }
  const handleBenefitRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }))
  }
  const handleSeoChange = (newSeoData) => {
    setSeoData(newSeoData)
  }

  const handleTestimonialAdd = () => {
    setFormData((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, { name: "", profile: null, designation: "", message: "" }],
    }))
  }

  const handleTestimonialChange = (e, index) => {
    const { name, value, files } = e.target
    const field = name.split(".")[1]

    setFormData((prev) => {
      const updatedTestimonials = [...prev.testimonials]
      if (field === "profile" && files && files[0]) {
        updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: files[0] }
      } else {
        updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value }
      }
      return { ...prev, testimonials: updatedTestimonials }
    })
  }

  const handleTestimonialRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(seoData.metaTitle, seoData.metaDescription, seoData.metaKeywords, seoData.ogImages, "dataaa")

    if (formData.benefits.some((benefit) => !benefit.title || !benefit.description)) {
      alert("Please fill in all benefits.")
      return
    }

    if (formData.testimonials.some((testimonial) => !testimonial.name || !testimonial.message)) {
      alert("Please fill in all testimonial fields.")
      return
    }

    // if (!seoData.metaTitle || !seoData.metaDescription || !seoData.ogImages.length) {
    //   alert("Please fill in all required SEO fields.")
    //   return
    // }

    const form = new FormData()
    form.append("title", formData.title)
    form.append("subtitle", formData.subtitle)
    form.append("shortDescription", formData.shortDescription)
    form.append("description", formData.description)
    form.append("idealForDescription", formData.idealForDescription)
    form.append("timelineDescription", formData.timelineDescription)
    form.append("startDate", formData.startDate)
    form.append("endDate", formData.endDate)

    // Append benefits data
    form.append("benefits", JSON.stringify(formData.benefits))

    // Append testimonials data
    form.append("testimonial", JSON.stringify(formData.testimonials)) 

    if (formData.image) {
      form.append("image", formData.image)
    }

    form.append("metaTitle", seoData.metaTitle)
    form.append("metaDescription", seoData.metaDescription)
    form.append("metaKeywords", seoData.metaKeywords)

    if (seoData.ogImages && seoData.ogImages.length > 0) {
      seoData.ogImages.forEach((image) => {
        form.append("ogImage", image)
      })
    }

    try {
      const response = await axios.post("/api/program", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Program added successfully", response.data)

      const seoResponse = await axios.post("/api/keywords", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("SEO data added successfully", seoResponse.data)
      setdataadd(false)
    } catch (error) {
      console.error("Error adding program", error)
    }
  }

  console.log("test", formData)

  return (
    <div className="max-w-full mx-auto mt-5 min-h-screen bg-white p-8">
      <Button className="cursor-pointer" style={{ backgroundColor: "#FF7F42" }} onClick={() => setdataadd(false)}>
        Back
      </Button>
      <h1 className="text-2xl font-bold mb-4">Program Add</h1>
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

        <div className="w-full">
          <Label>Benefits</Label>
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="relative space-y-4 mt-4 border p-4 rounded-md shadow-md">
              <button
                type="button"
                onClick={() => handleBenefitRemove(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                ✖
              </button>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <Label htmlFor={`benefit-title-${index}`}>Benefit Title</Label>
                  <Input
                    id={`benefit-title-${index}`}
                    name="title"
                    value={benefit.title}
                    onChange={(e) => handleBenefitChange(e, index)}
                    required
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
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
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor={`benefit-icon-${index}`}>Icon</Label>
                  <Input
                    type="file"
                    id={`benefit-icon-${index}`}
                    name="icon"
                    onChange={(e) => handleIconChange(e, index)}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button className="mt-4" onClick={handleBenefitAdd} style={{ backgroundColor: "#FF7F42" }}>
            Add More Benefits
          </Button>
        </div>

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

        <div className="w-full mt-8">
          <Label>Testimonials</Label>
          <Accordion type="single" collapsible className="w-full">
            {formData.testimonials.map((testimonial, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>Testimonial {index + 1}</AccordionTrigger>
                <AccordionContent>
                  <div className="relative space-y-4 mt-4 border p-4 rounded-md shadow-md">
                    <button
                      type="button"
                      onClick={() => handleTestimonialRemove(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      ✖
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <Label htmlFor={`testimonial-name-${index}`}>Name</Label>
                        <Input
                          id={`testimonial-name-${index}`}
                          name={`testimonial.name`}
                          value={testimonial.name}
                          onChange={(e) => handleTestimonialChange(e, index)}
                          required
                          className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        />
                      </div>
                      <div className="flex flex-col">
                        <Label htmlFor={`testimonial-designation-${index}`}>Designation</Label>
                        <Input
                          id={`testimonial-designation-${index}`}
                          name={`testimonial.designation`}
                          value={testimonial.designation}
                          onChange={(e) => handleTestimonialChange(e, index)}
                          required
                          className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <Label htmlFor={`testimonial-profile-${index}`}>Profile</Label>
                      <Input
                        type="file"
                        id={`testimonial-profile-${index}`}
                        name={`testimonial.profile`}
                        onChange={(e) => handleTestimonialChange(e, index)}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label htmlFor={`testimonial-message-${index}`}>Message</Label>
                      <textarea
                        id={`testimonial-message-${index}`}
                        name={`testimonial.message`}
                        value={testimonial.message}
                        onChange={(e) => handleTestimonialChange(e, index)}
                        required
                        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button className="mt-4" onClick={handleTestimonialAdd} style={{ backgroundColor: "#FF7F42" }}>
            Add More Testimonials
          </Button>
        </div>
        <Seo onSeoChange={handleSeoChange} />
        <Button type="submit" className="mt-6" style={{ backgroundColor: "#FF7F42" }}>
          Add Program
        </Button>
      </form>
    </div>
  )
}

export default ProgramAdd

