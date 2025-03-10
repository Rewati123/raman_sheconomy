"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Users } from "lucide-react" // यूज़र आइकन के लिए

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/submit-application')
        if (response.status === 200) {
          setTotalUsers(response.data.length) 
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="p-6 flex ">
      <div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-4 w-64">
        <Users className="w-12 h-12 text-blue-500" /> 
        <div>
          <h4 className="text-2xl font-bold">{totalUsers}</h4>
          <p className="text-gray-500 text-sm">Total Users</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
