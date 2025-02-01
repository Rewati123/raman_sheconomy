"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import VedioAdd from "../../Vedio/VedioAdd";
import VedioEdit from "@Components/Vedio/VedioEdit";
import { Eye, Trash2, Edit } from "lucide-react";
import axios from "axios";

const VedioList = () => {
  const [userData, setUserData] = useState([]);  // Initialize as an empty array
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataAdd, setDataAdd] = useState(false);
  const [editData, setEditData] = useState(null);
  const dataPerPage = 5;

  // Fetch data from API
  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await axios.get(`/api/vedio`);
        
        // Log the response to inspect its structure
        console.log('API Response:', response.data);

        // Ensure the response data is an array
        if (Array.isArray(response.data)) {
          setUserData(response.data); 
       console.log(userData,"user")
        } else {
          console.error('Expected an array but got:', response.data);
        }
      } catch (error) {
        console.error('Error fetching program data:', error);
      }
    };

    fetchProgramData();  
  }, []);  
 
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/vedio/${id}`);
      if (response.status === 200) {
        console.log('Video deleted successfully:', response.data);
        setUserData(prevData => prevData.filter(video => video.id !== id));
        alert('Video deleted successfully!');
      } else {
        throw new Error('Failed to delete the video');
      }
    } catch (error) {
      console.error('Error deleting video:', error.response?.data || error.message);
      alert('There was an error deleting the video');
    }
  };

  
  
  
  
  

 
  const handleAddData = (formData) => {
    const newEntry = { ...formData, id: (userData.length + 1).toString() };
    setUserData([...userData, newEntry]);
    setDataAdd(false);
  };


  const handleEdit = (data) => {
    setEditData(data);
  };

  const handleUpdate = async (formData) => {
  
    if (!formData.id) {
      console.error("ID is missing");
      alert("ID is missing. Cannot update the program.");
      return;
    }
  
    try {
     
      const response = await axios.put(`/api/vedio/${formData.id}`, formData);
  
      if (response.status === 200) {
      
        const updatedList = userData.map((data) =>
          data.id === formData.id ? formData : data
        );
        setUserData(updatedList); 
        setEditData(null); 
  
        alert("Program updated successfully!");
      } else {
        
        alert("Failed to update the program.");
      }
    } catch (error) {
     
      console.error("Error updating program:", error);
      alert("There was an error updating the program.");
    }
  };
  
  

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  console.log(userData, "userData");

  const filteredData = userData.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );


  const paginatedData = filteredData.slice(
    (currentPage - 1) * dataPerPage,
    currentPage * dataPerPage
  );

  const totalPages = Math.ceil(filteredData.length / dataPerPage);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
return dataAdd ? (
  <VedioAdd
    data="Add Data"
    setdataadd={setDataAdd}
    onSubmitData={handleAddData}
  />
) : editData ? (
  <VedioEdit
    data="Edit Data"
    setdataadd={setEditData}
    eduData={editData}
    onSubmit={handleUpdate}
  />
) : (
  <div className="w-full">
    <div className="flex justify-between items-center mt-5">
      <Input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search"
        className="w-80"
      />
      <Button onClick={() => setDataAdd(true)}   style={{ backgroundColor: '#FF7F42' }}>Add Vedio</Button>
    </div>
    <div className="mt-5 overflow-x-auto">
  
  <div className="max-h-96 overflow-y-auto">
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">SN</th>
          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">title</th>
        
          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">description</th>
        
         
          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">url</th>
       
          <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {paginatedData.map((row, index) => (
          <tr key={row.id}>
            <td className="px-3 py-4 text-sm text-gray-500">
              {(currentPage - 1) * dataPerPage + index + 1}
            </td>
            <td className="px-3 py-4">{row.title}</td>
          
            <td className="px-3 py-4">{row.description}</td>
           
     
            <td className="px-3 py-4">{row.url}</td>
            <td className="px-3 py-4 text-center flex justify-center space-x-3">
  <button
    className="flex items-center justify-center text-blue-500 hover:text-blue-700"
    title="View"
  >
    <Eye className="h-5 w-5" />
  </button>
  <button
    onClick={() => handleEdit(row)}
    className="flex items-center justify-center text-green-500 hover:text-green-700"
    title="Edit"
  >
    <Edit className="h-5 w-5" />
  </button>
  <button
    onClick={() => handleDelete(row.id)}
    className="flex items-center justify-center text-red-500 hover:text-red-700"
    title="Delete"
  >
    <Trash2 className="h-5 w-5" />
  </button>
</td>

          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <div className="mt-4 flex justify-end items-center space-x-4">
    <Button onClick={prevPage} disabled={currentPage === 1} className="bg-gray-500 text-white">
      Previous
    </Button>
    <span className="text-sm text-gray-500">
      Page {currentPage} of {totalPages}
    </span>
    <Button onClick={nextPage} disabled={currentPage === totalPages} className="bg-gray-500 text-white">
      Next
    </Button>
  </div>
</div>

  </div>
);

};

export default VedioList;
