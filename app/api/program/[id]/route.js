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

export async function PUT(request) {
  try {
    const formData = await request.formData();

    // **Extract Form Fields**
    const programId = formData.get("programId");
    const title = formData.get("title");
    const subtitle = formData.get("subtitle");
    const shortDescription = formData.get("shortDescription");
    const description = formData.get("description");
    const idealForDescription = formData.get("idealForDescription");
    const timelineDescription = formData.get("timelineDescription");
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");

    // **SEO Fields**
    const metaTitle = formData.get("metaTitle");
    const metaDescription = formData.get("metaDescription");
    const metaKeywords = formData.get("metaKeywords");
    const ogTitle = formData.get("ogTitle");

    // **Save ogImage to Blob Storage**
    const ogImage = formData.get("ogImage"); 
    const ogImagePath = ogImage ? await saveImage(ogImage) : null;  

    // **Program Image**
    const image = formData.get("image");
    const imagePath = image ? await saveImage(image) : null;

    // **Update Program Data**
    const updateProgramQuery = `
      UPDATE program SET 
        title = ?, 
        subtitle = ?, 
        short_description = ?, 
        description = ?, 
        ideal_For_Description = ?, 
        timeline_Description = ?, 
        start_Date = ?, 
        end_Date = ?, 
        ${imagePath ? "image = ?," : ""}
        updated_at = NOW()
      WHERE id = ?
    `;

    const programParams = [
      title, subtitle, shortDescription, description, 
      idealForDescription, timelineDescription, startDate, endDate
    ];
    if (imagePath) programParams.push(imagePath);
    programParams.push(programId);

    await queryPromise(updateProgramQuery, programParams);

    // **Update SEO Data**
    const updateSEOQuery = `
      UPDATE seo SET 
        meta_title = ?, 
        meta_description = ?, 
        meta_keywords = ?, 
        og_title = ?, 
        ${ogImagePath ? "og_images = ?," : ""}
        updated_at = NOW()
      WHERE programId = ?
    `;

    const seoParams = [
      metaTitle, metaDescription, metaKeywords, ogTitle
    ];
    if (ogImagePath) seoParams.push(ogImagePath);
    seoParams.push(programId);

    await queryPromise(updateSEOQuery, seoParams);

    // **Handle Benefits**
    let benefits = [];
    for (let i = 0; formData.has(`benefits[${i}][title]`); i++) {
      const id = formData.get(`benefits[${i}][id]`);
      const title = formData.get(`benefits[${i}][title]`);
      const description = formData.get(`benefits[${i}][description]`);
      const icon = formData.get(`benefits[${i}][icon]`);
      const iconPath = icon ? await saveImage(icon) : null;

      benefits.push({ id, title, description, icon: iconPath });
    }

    for (const benefit of benefits) {
      if (benefit.id) {
        // Update existing benefit
        const updateBenefitQuery = `
          UPDATE benefit SET 
            title = ?, 
            description = ?, 
            ${benefit.icon ? "icon = ?," : ""}
            updated_at = NOW()
          WHERE id = ?
        `;
        const benefitParams = [benefit.title, benefit.description];
        if (benefit.icon) benefitParams.push(benefit.icon);
        benefitParams.push(benefit.id);
        await queryPromise(updateBenefitQuery, benefitParams);
      } else {
        // Insert new benefit
        const insertBenefitQuery = `INSERT INTO benefit (programId, title, description, icon) VALUES (?, ?, ?, ?)`;
        await queryPromise(insertBenefitQuery, [programId, benefit.title, benefit.description, benefit.icon]);
      }
    }

    // **Handle Testimonials**
    let testimonials = [];
    for (let i = 0; formData.has(`testimonials[${i}][name]`); i++) {
      const id = formData.get(`testimonials[${i}][id]`);
      const name = formData.get(`testimonials[${i}][name]`);
      const designation = formData.get(`testimonials[${i}][designation]`);
      const message = formData.get(`testimonials[${i}][message]`);
      const profile = formData.get(`testimonials[${i}][profile]`);
      const profilePath = profile ? await saveImage(profile) : null;

      testimonials.push({ id, name, designation, message, profile: profilePath });
    }

    for (const testimonial of testimonials) {
      if (testimonial.id) {
        // Update existing testimonial
        const updateTestimonialQuery = `
          UPDATE testimonial SET 
            name = ?, 
            designation = ?, 
            message = ?, 
            ${testimonial.profile ? "profile = ?," : ""}
            updated_at = NOW()
          WHERE id = ?
        `;
        const testimonialParams = [testimonial.name, testimonial.designation, testimonial.message];
        if (testimonial.profile) testimonialParams.push(testimonial.profile);
        testimonialParams.push(testimonial.id);
        await queryPromise(updateTestimonialQuery, testimonialParams);
      } else {
        // Insert new testimonial
        const insertTestimonialQuery = `
          INSERT INTO testimonial (programId, name, designation, message, profile) 
          VALUES (?, ?, ?, ?, ?)
        `;
        await queryPromise(insertTestimonialQuery, [programId, testimonial.name, testimonial.designation, testimonial.message, testimonial.profile]);
      }
    }

    return NextResponse.json({ message: "Program updated successfully" });

  } catch (error) {
    console.error("Error updating program data:", error);
    return NextResponse.json({ message: "Error updating program data" }, { status: 500 });
  }
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



