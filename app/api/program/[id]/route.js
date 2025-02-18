import { NextResponse } from 'next/server';
import {queryPromise } from '@/lib/db'; // Correct default import

export async function PUT(request) {
  try {
    const { programId, title, subtitle, shortDescription, description, idealForDescription, timelineDescription, startDate, endDate, image, benefits, testimonials } = await request.json();
    
    // Update Program Data
    const programUpdateQuery = `
      UPDATE Program SET
        title = ?, 
        subtitle = ?, 
        short_description = ?, 
        description = ?, 
        ideal_For_Description = ?, 
        timeline_Description = ?, 
        start_Date = ?, 
        end_Date = ?, 
        image = ?
      WHERE id = ?
    `;
    
    // Execute program update query
    await queryPromise(programUpdateQuery, [title, subtitle, shortDescription, description, idealForDescription, timelineDescription, startDate, endDate, image, programId]);

    // Update Benefits if any
    if (benefits && benefits.length > 0) {
      const benefitUpdatePromises = benefits.map(benefit => {
        const benefitUpdateQuery = `
          UPDATE Benefit SET
            icon = ?, 
            title = ?, 
            description = ?
          WHERE id = ?
        `;
        
        return queryPromise(benefitUpdateQuery, [benefit.icon, benefit.title, benefit.description, benefit.id]);
      });
      await Promise.all(benefitUpdatePromises);
    }

    // Update Testimonials if any
    if (testimonials && testimonials.length > 0) {
      const testimonialUpdatePromises = testimonials.map(testimonial => {
        const testimonialUpdateQuery = `
          UPDATE Testimonial SET
            name = ?, 
            profile = ?, 
            designation = ?, 
            message = ?
          WHERE id = ?
        `;
        
        return queryPromise(testimonialUpdateQuery, [testimonial.name, testimonial.profile, testimonial.designation, testimonial.message, testimonial.id]);
      });
      await Promise.all(testimonialUpdatePromises);
    }

    // Return success response
    return NextResponse.json({ message: "Program updated successfully" });
  } catch (error) {
    console.error('Error updating program data:', error);
    return NextResponse.json({ message: 'Error updating program data' }, { status: 500 });
  }
}


export async function DELETE(request, { params }) {
  const url = new URL(request.url);
  const programId = url.pathname.split('/').pop();  // Extract programId from the URL

  if (!programId) {
    return NextResponse.json({ message: 'Program ID is required' }, { status: 400 });
  }

  try {
   
    const deleteTestimonialsQuery = `DELETE FROM Testimonial WHERE programId = ?`;
    await queryPromise(deleteTestimonialsQuery, [programId]);

    
    const deleteBenefitsQuery = `DELETE FROM Benefit WHERE programId = ?`;
    await queryPromise(deleteBenefitsQuery, [programId]);

 
    const deleteProgramQuery = `DELETE FROM Program WHERE id = ?`;
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





