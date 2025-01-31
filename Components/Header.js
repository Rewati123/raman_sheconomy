import React from 'react'
import { Bell, Search } from 'lucide-react'
import { Input } from "@/Components/ui/input"
const Header = () => {
  return (
    <div>


<header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center">
        <Input type="text" placeholder="Search..." className="w-64 mr-4" />
        <Search className="text-gray-500" />
      </div>
      <div className="flex items-center">
        <button className="p-2 mr-4 text-gray-500 hover:text-gray-700">
          <Bell />
        </button>
        <img
          className="w-8 h-8 rounded-full"
          src="/placeholder.svg?height=32&width=32"
          alt="User avatar"
        />
      </div>
    </header>

    </div>
  )
}

export default Header