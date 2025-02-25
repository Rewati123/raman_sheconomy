"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";

import { Eye, Edit, Trash2 } from 'lucide-react'

const UserLIst = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [programData, setProgramData] = useState([]);
    const recordsPerPage = 5;

      // Fetch data from the API
      useEffect(() => {
        const fetchProgramData = async () => {
          try {
            const response = await axios.get("/api/submit-application");
            console.log("Full API response:", response.data);
  
            if (response.data && Array.isArray(response.data)) {
              setProgramData(response.data); 
            } else if (response.data.applications && Array.isArray(response.data.applications)) {
              setProgramData(response.data.applications); // Expected structure
            } else {
              console.error("Unexpected response structure:", response.data);
              setProgramData([]); 
            }
          } catch (error) {
            console.error("Error fetching program data:", error);
            setProgramData([]); // Fallback to empty array on error
          }
        };
      
        fetchProgramData();
      }, []);
      

  const handleEdit = (user) => {
    console.log("Edit user:", user);
  };

  const handleDelete = (user) => {
    console.log("Delete user:", user);
  };

  const filteredData = programData.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.startupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = filteredData.slice(
    startIndex,
    startIndex + recordsPerPage
  );



  return (
    <div>


<div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Program Participants</h2>
      <Card>
        <CardHeader>
          <input
            type="text"
            placeholder="Search participants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-2 p-2 border rounded w-1/2"
          />
        </CardHeader>
        <CardContent>
          {programData.length === 0 ? (
            <p>No program participants found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.N</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Startup Name</TableHead>
                 
                  <TableHead> description</TableHead>
                 
           
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRecords.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.startupName}</TableCell>
                    <TableCell>{user.description}</TableCell>
                    <TableCell>
                    
                  
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>{user.fullName}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              <p><strong>Email:</strong> {user.email}</p>
                              <p><strong>Phone Number:</strong> {user.phone}</p>
                              <p><strong>Startup Name:</strong> {user.startupName}</p>
                              <p><strong>Description:</strong> {user.description}</p>
                            
                           
                              <p><strong>Profile Link:</strong> <a href={user.profileLink} target="_blank">{user.profileLink}</a></p>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="icon" onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(user)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-between items-center mt-4">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
          Next
        </Button>
      </div>
    </div>



    </div>
  )
}

export default UserLIst