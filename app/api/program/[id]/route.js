import { NextResponse } from 'next/server';
import {queryPromise } from '@/lib/db'; // Correct default import
import { put } from '@vercel/blob'

async function saveImage(file) {
  if (!file) return null;
  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExtension}`;
  const blob = await put(fileName, file, { access: 'public' });
  return blob.url;
}






export async function DELETE(request, { params }) {
  const url = new URL(request.url);
  const programId = url.pathname.split('/').pop();  

  if (!programId) {
    return NextResponse.json({ message: 'Program ID is required' }, { status: 400 });
  }

  try {
   
    const deleteTestimonialsQuery = `DELETE FROM testimonial WHERE programId = ?`;
    await queryPromise(deleteTestimonialsQuery, [programId]);

    
    const deleteBenefitsQuery = `DELETE FROM benefit WHERE programId = ?`;
    await queryPromise(deleteBenefitsQuery, [programId]);

 
    const deleteProgramQuery = `DELETE FROM program WHERE id = ?`;
    const deleteResult = await queryPromise(deleteProgramQuery, [programId]);

    if (deleteResult.affectedRows === 0) {
  
      console.error(`No program found with ID: ${programId}`);
      return NextResponse.json({ message: `Program with ID ${programId} not found` }, { status: 404 });
    }

 
    return NextResponse.json({ message: 'Program and related data deleted successfully' });
  } catch (error) {
    console.error('Error during program deletion:', error.message || error);

    

    return NextResponse.json({ message: 'Error deleting program', error: error.message || 'Unknown error' }, { status: 500 });
  }
}



