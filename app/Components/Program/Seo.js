"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import { X } from "lucide-react"

const Seo = ({ onSeoChange }) => {
  const [openAccordion, setOpenAccordion] = useState(null)
  const [images, setImages] = useState([])
  const [keywords, setKeywords] = useState([])
  const [currentKeyword, setCurrentKeyword] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")

  const [ogTitle, setOgTitle] = useState("")
 
  const inputRef = useRef(null)

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index)
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    const filePreviews = files.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) }))
    setImages((prevImages) => {
      const newImages = [...prevImages, ...filePreviews]
      updateSeoData({ ogImages: newImages })
      return newImages
    })
  }

  const handleRemoveImage = (index) => {
    setImages((prevImages) => {
      const newImages = prevImages.filter((_, i) => i !== index)
      updateSeoData({ ogImages: newImages })
      return newImages
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const filePreviews = files.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) }))
    setImages((prevImages) => {
      const newImages = [...prevImages, ...filePreviews]
      updateSeoData({ ogImages: newImages })
      return newImages
    })
  }

  const handleKeywordInput = (e) => {
    const value = e.target.value
    setCurrentKeyword(value)
    if (value.trim() !== "") {
      setKeywords((prevKeywords) => {
        const lastKeyword = prevKeywords[prevKeywords.length - 1]
        if (lastKeyword && lastKeyword.partial) {
          const newKeywords = [...prevKeywords.slice(0, -1), { text: value, partial: true }]
          updateSeoData({ metaKeywords: newKeywords.map((k) => k.text) })
          return newKeywords
        } else {
          const newKeywords = [...prevKeywords, { text: value, partial: true }]
          updateSeoData({ metaKeywords: newKeywords.map((k) => k.text) })
          return newKeywords
        }
      })
    } else {
      setKeywords((prevKeywords) => {
        const newKeywords = prevKeywords.filter((keyword) => !keyword.partial)
        updateSeoData({ metaKeywords: newKeywords.map((k) => k.text) })
        return newKeywords
      })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault()
      if (currentKeyword.trim() !== "") {
        setKeywords((prevKeywords) => {
          const newKeywords = [
            ...prevKeywords.filter((keyword) => !keyword.partial),
            { text: currentKeyword.trim(), partial: false },
          ]
          updateSeoData({ metaKeywords: newKeywords.map((k) => k.text) })
          return newKeywords
        })
        setCurrentKeyword("")
      }
    }
  }

  const handleRemoveKeyword = (index) => {
    setKeywords((prevKeywords) => {
      const newKeywords = prevKeywords.filter((_, i) => i !== index)
      updateSeoData({ metaKeywords: newKeywords.map((k) => k.text) })
      return newKeywords
    })
  }

  const updateSeoData = (newData) => {
    onSeoChange({
      metaTitle,
      metaDescription,
      metaKeywords: keywords.map((k) => k.text),
      ogImages: images,
      ...newData,
    })
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [keywords])

  return (
    <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 mx-auto">
      <button
        onClick={() => toggleAccordion(0)}
        className="w-full flex justify-between items-center p-4 bg-gray-100 rounded-lg focus:outline-none"
      >
        <h1 className="text-2xl font-semibold">SEO</h1>
        <span>{openAccordion === 0 ? "−" : "+"}</span>
      </button>

      {openAccordion === 0 && (
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="meta-title">Meta Title</Label>
            <Input
              id="meta-title"
              placeholder="Enter Meta Title"
              value={metaTitle}
              onChange={(e) => {
                setMetaTitle(e.target.value)
                updateSeoData({ metaTitle: e.target.value })
              }}
            />
          </div>

          <div>
            <Label htmlFor="meta-description">Meta Description</Label>
            <Textarea
              id="meta-description"
              placeholder="Enter Meta Description"
              value={metaDescription}
              onChange={(e) => {
                setMetaDescription(e.target.value)
                updateSeoData({ metaDescription: e.target.value })
              }}
            />
          </div>

          <div>
            <Label htmlFor="meta-keywords">Meta Keywords</Label>
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md">
              {keywords.map((keyword, index) => (
                <div
                  key={index}
                  className={`flex items-center bg-gray-200 rounded-full px-3 py-1 ${
                    keyword.partial ? "border border-blue-500" : ""
                  }`}
                >
                  <span className="text-sm">{keyword.text}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 p-0 h-4 w-4"
                    onClick={() => handleRemoveKeyword(index)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove keyword</span>
                  </Button>
                </div>
              ))}
              <Input
                ref={inputRef}
                type="text"
                id="meta-keywords"
                value={currentKeyword}
                onChange={handleKeywordInput}
                onKeyDown={handleKeyDown}
                className="flex-grow border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Type keywords (press Enter, comma, or space to add)"
              />
            </div>
          </div>

          <div>
            <Label>Og Images</Label>
            <div
              className="mt-1 flex justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-6"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <Label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Click or drag image to upload</span>
                  <Input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </Label>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative w-32 h-32 flex justify-center items-center bg-gray-100 rounded-md group"
                >
                  <img
                    src={image.preview || "/placeholder.svg"}
                    alt="Preview"
                    className="h-full w-full object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove image</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
 




          {/* New Fields */}
          <div>
            <Label htmlFor="og-title">OG Title</Label>
            <Input
              id="og-title"
              placeholder="Enter OG Title"
              value={ogTitle}
              onChange={(e) => {
                setOgTitle(e.target.value)
                updateSeoData({ ogTitle: e.target.value })
              }}
            />
          </div>

  
        </div>
      )}
           
    </div>
  )
}

export default Seo

