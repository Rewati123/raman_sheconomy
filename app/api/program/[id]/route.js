import { NextResponse } from 'next/server';
import {queryPromise } from '../../../../lib/db'; // Correct default import

export async function PUT(request) {
  try {
    const { programId, title, subtitle, shortDescription, description, idealForDescription, timelineDescription, startDate, endDate, image, benefits, testimonials } = await request.json();
    
    // Update Program Data
    const programUpdateQuery = `
      UPDATE program SET
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
          UPDATE benefit SET
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
          UPDATE testimonial SET
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

export async function GET(request) {
  try {
    // Fetch program data along with benefits and testimonials using JOIN
    const programQuery = `
      SELECT 
        p.id AS programId,
        p.title,
        p.subtitle,
        p.short_description,
        p.description,
        p.ideal_For_Description,
        p.timeline_Description,
        p.start_Date,
        p.end_Date,
        p.image,
        b.id AS benefitId,
        b.icon AS benefitIcon,
        b.title AS benefitTitle,
        b.description AS benefitDescription,
        t.id AS testimonialId,
        t.name AS testimonialName,
        t.profile AS testimonialProfile,
        t.designation AS testimonialDesignation,
        t.message AS testimonialMessage
      FROM program p
      LEFT JOIN benefit b ON p.id = b.programId
      LEFT JOIN testimonial t ON p.id = t.programId
    `;
    
    const programs = await queryPromise(programQuery); 

    // Format the data into a structured response
    const result = programs.reduce((acc, program) => {
      let programData = acc.find(p => p.programId === program.programId);
      
      if (!programData) {
        programData = {
          programId: program.programId,
          title: program.title,
          subtitle: program.subtitle,
          shortDescription: program.short_description,
          description: program.description,
          idealForDescription: program.ideal_For_Description,
          timelineDescription: program.timeline_Description,
          startDate: program.start_Date,
          endDate: program.end_Date,
          image: program.image,
          benefits: [],
          testimonials: []
        };
        acc.push(programData);
      }

      // Add benefit data if available
      if (program.benefitId) {
        programData.benefits.push({
          benefitId: program.benefitId,
          icon: program.benefitIcon,
          title: program.benefitTitle,
          description: program.benefitDescription
        });
      }

      // Add testimonial data if available
      if (program.testimonialId) {
        programData.testimonials.push({
          testimonialId: program.testimonialId,
          name: program.testimonialName,
          profile: program.testimonialProfile,
          designation: program.testimonialDesignation,
          message: program.testimonialMessage
        });
      }

      return acc;
    }, []);

    // Return the structured data as a JSON response
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching program data:', error);
    return NextResponse.json({ message: 'Error fetching program data' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const url = new URL(request.url);
  const programId = url.pathname.split('/').pop();  // Extract programId from the URL

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



