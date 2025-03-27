"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import ProgramAdd from "../../Components/Program/ProgramAdd";
import ProgramEdit from "../../Components/Program/ProgramEdit";
import { Eye, Trash2, Edit } from "lucide-react";
import { MoreHorizontal } from "lucide-react"; 
import ProgramDetails from "../../Components/Program/ProgramDetails ";
import ProgramDropdown from "../../Components/ProgramDropdown"
import axios from "axios";

const ProgramList = () => {
  const [userData, setUserData] = useState([]);  // Initialize as an empty array
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataAdd, setDataAdd] = useState(false);
  const [editData, setEditData] = useState(null);
  const [seoData, setSeoData] = useState(null);
  const [showSeoDetails, setShowSeoDetails] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const [selectedSeoData, setSelectedSeoData] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programSelcet,setProgramSelcet] = useState ("")
  
  const dataPerPage = 5;


  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await axios.get(`/api/program`);
        
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
 
 
  // Delete Data
  const handleDelete = async (programId) => {
    if (!programId) {
      console.error("Error: programId is undefined or null");
      alert("Invalid program ID!");
      return;
    }
  
    console.log("Deleting program with ID:", programId);
  
    try {
      const response = await axios.delete(`/api/program/${programId}`);
      if (response.status === 200) {
        setUserData(userData.filter((item) => item.id !== programId));
        alert("Program deleted successfully!");
      } else {
        alert("Failed to delete the program.");
      }
    } catch (error) {
      console.error("Error deleting program:", error);
      alert("There was an error deleting the program.");
    }
  };
  
  


  // Add Data
  const handleAddData = (formData) => {
    const newEntry = { ...formData, id: (userData.length + 1).toString() };
    setUserData([...userData, newEntry]);
    setDataAdd(false);
  };

  // Edit Data
  const handleEdit = (data) => {
    setEditData(data);
  };

  const handleUpdate = (data) => {
    console.log("Update function called with data:", data);
  };
  
  // Search Functionality
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  console.log(userData, "userData");

  // Filtering based on the search query
  const filteredData = userData.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Pagination
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
  <ProgramAdd
    data="Add Data"
    setdataadd={setDataAdd}
    onSubmitData={handleAddData}
  />
) : editData ? (
  <ProgramEdit
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
 
      <Button onClick={() => setDataAdd(true)} style={{ backgroundColor: '#FF7F42' }}>Add Program</Button>
  
        

    </div>

    <div className="mt-5 overflow-x-auto">
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">SN</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Subtitle</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Short Description</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Image</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ideal For Description</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Timeline Description</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Start Date</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">End Date</th>
                <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Actions</th>
              
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedData.map((row, index) => (
                   <tr key={row.id || row.programId || index}> 
                  <td className="px-3 py-4 text-sm text-gray-500">{(currentPage - 1) * dataPerPage + index + 1}</td>
                  <td className="px-3 py-4">{row.title}</td>
                  <td className="px-3 py-4">{row.subtitle}</td>
                  <td className="px-3 py-4">{row.shortDescription}</td>
                  <td className="px-3 py-4">{row.description}</td>
                  <td className="px-3 py-4">
                  {row.image && <img src={row.image} alt="Program Image" />}

                  </td>
                  <td className="px-3 py-4">{row.idealForDescription}</td>
                  <td className="px-3 py-4">{row.timelineDescription}</td>
                  <td className="px-3 py-4">{row.startDate}</td>
                  <td className="px-3 py-4">{row.endDate}</td>
                  <td className="px-3 py-4 text-center">
                    <button className="text-blue-500 hover:text-blue-700">
                      <Eye className="h-5 w-5"  onClick={() => setSelectedProgram(row)} />
                    </button>
                    <button onClick={() => handleEdit(row)} className="text-blue-500 hover:text-blue-700 ml-3">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
  onClick={() => {
    
    handleDelete(row?.programId);
  }}
  className="ml-3 text-red-500 hover:text-red-700"
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



      

{selectedProgram && (
        <ProgramDetails program={selectedProgram} onClose={() => setSelectedProgram(null)} />
      )}

  </div>
);

};

export default ProgramList;
