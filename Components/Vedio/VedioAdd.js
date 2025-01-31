'use client'

import { useState } from 'react'
import { Button } from "@/Components/ui/button";
export default function VedioAdd({ setdataadd, onSubmitData }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !description || !file) {
      setMessage('Please fill all fields and select a video file.')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('video', file)

    try {
      const response = await fetch('/api/vedio', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setMessage(data.message)
      if (response.ok) {
        setTitle('')
        setDescription('')
        setFile(null)
      }
      setdataadd(false);
    } catch (error) {
      setMessage('Error uploading video. Please try again.')
    }
  }

  return (
    <>
<Button
  className="cursor-pointer text-white px-4 py-2 rounded-md hover:bg-[#FF7F42] focus:outline-none"
  style={{ backgroundColor: '#FF7F42' }}
  onClick={() => setdataadd(false)}
>
  Back
</Button>

<h1 className="text-2xl font-bold mb-6 mt-4">Program Add</h1>

<form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
  <div className="flex flex-col">
    <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
    <input
      type="text"
      id="title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-1/2 mx-auto"
      required
    />
  </div>

  <div className="flex flex-col">
    <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
    <textarea
      id="description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-1/2 mx-auto"
      required
    ></textarea>
  </div>

  <div className="flex flex-col">
    <label htmlFor="video" className="text-sm font-medium text-gray-700">Video File</label>
    <input
      type="file"
      id="video"
      accept="video/*"
      onChange={(e) => setFile(e.target.files?.[0] || null)}
      className="mt-1 block w-1/2 mx-auto p-3 border border-gray-300 rounded-md"
      required
    />
  </div>

  <button
  type="submit"
  style={{ backgroundColor: '#FF7F42' }}
  className="px-6 py-4 text-white rounded-md hover:bg-[#FF7F42] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-1/3 mx-auto"
>
  Upload Video
</button>


  {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
</form>




    
    
    
    </>
   
  )
}

