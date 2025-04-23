import { NextResponse } from 'next/server';
import {queryPromise } from '@/lib/db'; // Correct default import
import { put } from '@vercel/blob'

async function saveImage(file) {
  if (!file || !file.name) return null; 
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

export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/"); 
    const programId = pathParts[pathParts.length - 1];

    if (!programId || programId === "program") {
      return NextResponse.json({ message: "Program ID is required" }, { status: 400 });
    }

    console.log(programId, "programId");

    const formData = await request.formData();
    const action = formData.get("action");
    const benefitId = url.searchParams.get("benefitId");
    console.log(benefitId,"benefitId")
    const testimonialId = url.searchParams.get("testimonialId");
    const seoId = formData.get("seoid");
   console.log(seoId,"hgcfgcjbhvgfxfdcbv")

    const existingProgram = await queryPromise(`SELECT * FROM program WHERE id = ?`, [programId]);


    const imageFile = formData.get("image");
    const imageUrl = imageFile ? await saveImage(imageFile) : existingProgram[0]?.image;

    await queryPromise(
      `UPDATE program SET 
        title = COALESCE(?, title), 
        subtitle = COALESCE(?, subtitle), 
        short_description = COALESCE(?, short_description), 
        description = COALESCE(?, description), 
        ideal_For_Description = COALESCE(?, ideal_For_Description), 
        timeline_Description = COALESCE(?, timeline_Description), 
        start_Date = COALESCE(?, start_Date), 
        end_Date = COALESCE(?, end_Date), 
        image = COALESCE(?, image)
      WHERE id = ?`,
      [
        formData.get("title") || existingProgram[0]?.title,
        formData.get("subtitle") || existingProgram[0]?.subtitle,
        formData.get("shortDescription") || existingProgram[0]?.short_description,
        formData.get("description") || existingProgram[0]?.description,
        formData.get("idealForDescription") || existingProgram[0]?.ideal_For_Description,
        formData.get("timelineDescription") || existingProgram[0]?.timeline_Description,
        formData.get("startDate") ? new Date(formData.get("startDate")) : existingProgram[0]?.start_Date,
        formData.get("endDate") ? new Date(formData.get("endDate")) : existingProgram[0]?.end_Date,
        imageUrl,
        programId,
      ]
    );

   
    if (benefitId || action === "create") {
      const existingBenefit = await queryPromise(`SELECT * FROM benefit WHERE id = ? AND programId = ?`, [benefitId, programId]);
      const iconFile = formData.get("icon");
      const iconUrl = iconFile ? await saveImage(iconFile) : existingBenefit[0]?.icon;

      if (action === "create") {
        await queryPromise(
          `INSERT INTO benefit (programId, title, description, icon) VALUES (?, ?, ?, ?)`,
          [programId, formData.get("title"), formData.get("description"), iconUrl]
        );
      } else if (action === "update") {
        await queryPromise(
          `UPDATE benefit SET 
            title = COALESCE(?, title), 
            description = COALESCE(?, description), 
            icon = COALESCE(?, icon) 
          WHERE id = ? AND programId = ?`,
          [
            formData.get("title") || existingBenefit[0]?.title,
            formData.get("description") || existingBenefit[0]?.description,
            iconUrl,
            benefitId,
            programId
          ]
        );
      } else if (action === "delete") {
        await queryPromise(`DELETE FROM benefit WHERE id = ? AND programId = ?`, [benefitId, programId]);
      }
    }


    if (testimonialId || action === "create") {
      const existingTestimonial = await queryPromise(`SELECT * FROM testimonial WHERE id = ? AND programId = ?`, [testimonialId, programId]);

      let profileUrl = formData.get("profile");
      if (profileUrl instanceof File) {
        profileUrl = await saveImage(profileUrl);
      } else {
        profileUrl = existingTestimonial[0]?.profile;
      }

      if (action === "create") {
        await queryPromise(
          `INSERT INTO testimonial (programId, name, designation, message, profile) VALUES (?, ?, ?, ?, ?)`,
          [programId, formData.get("name"), formData.get("designation"), formData.get("message"), profileUrl]
        );
      } else if (action === "update") {
        await queryPromise(
          `UPDATE testimonial SET 
            name = COALESCE(?, name), 
            designation = COALESCE(?, designation), 
            message = COALESCE(?, message), 
            profile = COALESCE(?, profile) 
          WHERE id = ? AND programId = ?`,
          [
            formData.get("name") || existingTestimonial[0]?.name,
            formData.get("designation") || existingTestimonial[0]?.designation,
            formData.get("message") || existingTestimonial[0]?.message,
            profileUrl,
            testimonialId,
            programId
          ]
        );
      } else if (action === "delete") {
        await queryPromise(`DELETE FROM testimonial WHERE id = ? AND programId = ?`, [testimonialId, programId]);
      }
    }

 
  
    if (programId) {  
      const existingSeo = await queryPromise(`SELECT * FROM seo WHERE programId = ?`, [programId]);
    
      const metaTitle = formData.get("metaTitle") || existingSeo[0]?.meta_title;
      const metaDescription = formData.get("metaDescription") || existingSeo[0]?.meta_description;
      const metaKeywords = formData.get("metaKeywords") || existingSeo[0]?.meta_keywords;
      const ogImages = formData.getAll("ogImages"); // uploaded file (expecting only one image)
    
      let ogImageUrl = existingSeo[0]?.og_images; // default: old image
    
      if (ogImages && ogImages.length > 0 && ogImages[0]?.name) {
        const uploadedUrl = await saveImage(ogImages[0]);
        if (uploadedUrl) {
          ogImageUrl = uploadedUrl;
        }
      }
    
      const ogTitle = formData.get("ogTitle") || existingSeo[0]?.og_title;
      const ogDescription = formData.get("ogDescription") || existingSeo[0]?.og_description;
    
      if (action === "update") {
        await queryPromise(
          `UPDATE seo SET 
            meta_title = COALESCE(?, meta_title), 
            meta_description = COALESCE(?, meta_description), 
            meta_keywords = COALESCE(?, meta_keywords), 
            og_images = COALESCE(?, og_images), 
            og_title = COALESCE(?, og_title), 
            og_description = COALESCE(?, og_description) 
          WHERE programId = ?`, 
          [metaTitle, metaDescription, metaKeywords, ogImageUrl, ogTitle, ogDescription, programId]
        );
      } 
      else if (action === "delete" && id) {
        await queryPromise(`DELETE FROM seo WHERE id = ?`, [id]);
      }
    }
    



// if (seoId) {
//   const existingSeo = await queryPromise(`SELECT * FROM seo WHERE id = ?`, [seoId]);

//   const metaTitle = formData.get("metaTitle") || existingSeo[0]?.meta_title;
//   const metaDescription = formData.get("metaDescription") || existingSeo[0]?.meta_description;
//   let metaKeywords = formData.get("metaKeywords") || existingSeo[0]?.meta_keywords;

//   // OG Image Files Upload
//  // OG Image Files Upload
// const ogImages = formData.getAll("ogImages"); // new uploaded files
// const existingImages = formData.getAll("existingImages[]") || []; // existing image URLs

// let ogImageUrls = [];

// for (const img of ogImages) {
//   if (img && img.name) {
//     const url = await saveImage(img);
//     if (url) {
//       ogImageUrls.push(url);
//     }
//   }
// }

// // Merge with existing if available
// if (existingImages.length > 0) {
//   ogImageUrls = [...ogImageUrls, ...existingImages];
// }

// const ogImageUrl = ogImageUrls.length > 0 ? ogImageUrls.join(",") : existingSeo[0]?.og_images;


//   const ogTitle = formData.get("ogTitle") || existingSeo[0]?.og_title;
//   const ogDescription = formData.get("ogDescription") || existingSeo[0]?.og_description;

//   if (action === "update") {
//     await queryPromise(
//       `UPDATE seo SET 
//         meta_title = ?, 
//         meta_description = ?, 
//         meta_keywords = ?, 
//         og_images = ?, 
//         og_title = ?, 
//         og_description = ?
//       WHERE id = ?`,
//       [metaTitle, metaDescription, metaKeywords, ogImageUrl, ogTitle, ogDescription, seoId]
//     );
//   } 
//   else if (action === "delete") {
//     await queryPromise(`DELETE FROM seo WHERE id = ?`, [seoId]);
//   }
// }



    return NextResponse.json({ message: "Program updated successfully" });
  } catch (error) {
    console.error("Error updating program:", error);
    return NextResponse.json({ message: "Error updating program" }, { status: 500 });
  }
}


