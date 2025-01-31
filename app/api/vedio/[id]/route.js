import { queryPromise } from '@/lib/db';
import { NextResponse } from 'next/server';
export async function DELETE(request, { params }) {
    try {
      const { id } = params;
      console.log('Deleting video with id:', id);
  
      if (!id) {
        return NextResponse.json({ message: 'Video ID is required.' }, { status: 400 });
      }
  
      const query = 'DELETE FROM Video WHERE id = ?';
      const result = await queryPromise(query, [id]);
  
      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'Video not found.' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Video deleted successfully!' }, { status: 200 });
    } catch (error) {
      console.error('Error deleting video:', error);
      return NextResponse.json({ message: 'Error deleting video.', error: error.message }, { status: 500 });
    }
  }
  
  

 
export async function PUT(request, { params }) {
    try {
      // Ensure params are awaited before using them
      const { id } = await params;  // Await params before accessing the id
      const { title, description, url } = await request.json();  // Parse JSON body
  
      // Check for missing required fields
      if (!id || !title || !description || !url) {
        return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
      }
  
      // SQL query to update the video
      const query = 'UPDATE Video SET title = ?, description = ?, url = ? WHERE id = ?';
      const result = await queryPromise(query, [title, description, url, id]);
  
      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'Video not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Video updated successfully!', data: { id, title, description, url } }, { status: 200 });
  
    } catch (error) {
      console.error('Error updating video:', error);
      return NextResponse.json({ message: 'Error updating video', error: error.message }, { status: 500 });
    }
  }
  