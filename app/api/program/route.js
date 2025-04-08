import { NextResponse } from 'next/server';
import { queryPromise } from '@/lib/db';
import { put } from '@vercel/blob';



async function saveImage(file) {
  if (!file) {
    console.error("No file received");
    return null;
  }

  if (!file.name) {
    console.error("File name is missing");
    return null;
  }

  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExtension}`;

  try {
    const blob = await put(fileName, file, {
      access: 'public', 
    });
    return blob.url; 
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}


// export async function PUT(request) {
//   try {
//     const formData = await request.formData();
//     const programId = formData.get("id") || formData.get("programId");

//     if (!programId) {
//       return NextResponse.json({ message: "Program ID missing" }, { status: 400 });
//     }

//     // 🎯 Program Fields
//     const title = formData.get("title");
//     const subtitle = formData.get("subtitle");
//     const shortDescription = formData.get("shortDescription");
//     const description = formData.get("description");
//     const idealForDescription = formData.get("idealForDescription");
//     const timelineDescription = formData.get("timelineDescription");
//     const startDate = formData.get("startDate");
//     const endDate = formData.get("endDate");

//     // 🎯 SEO Fields
//     const metaTitle = formData.get("metaTitle");
//     const metaDescription = formData.get("metaDescription");
//     const metaKeywordsString = formData.get("metaKeywords");
//     const ogTitle = formData.get("ogTitle");
//     const ogDescription = formData.get("ogDescription");

//     // 📷 Save Images
//     const ogImage = formData.get("ogImage");
//     const ogImagePath = ogImage ? await saveImage(ogImage) : null;

//     const image = formData.get("image");
//     const imagePath = image ? await saveImage(image) : null;
 
    
//     // 🔄 **Update Program Query**
//     const updateProgramQuery = `
//       UPDATE program SET 
//         title = ?, subtitle = ?, short_description = ?, description = ?, 
//         ideal_For_Description = ?, timeline_Description = ?, start_Date = ?, end_Date = ?
//         ${imagePath ? ", image = ?" : ""}
//       WHERE id = ?;
//     `;

//     const programParams = [title, subtitle, shortDescription, description, idealForDescription, timelineDescription, startDate, endDate];
//     if (imagePath) programParams.push(imagePath);
//     programParams.push(programId);

//     await queryPromise(updateProgramQuery, programParams);

//     // 🔄 **Update SEO Query**
//     const updateSEOQuery = `
//       UPDATE seo SET 
//         meta_title = ?, meta_description = ?, meta_keywords = ?, 
//         og_title = ?, og_description = ?
//         ${ogImagePath ? ", og_images = ?" : ""}
//       WHERE programId = ?;
//     `;

//     const seoParams = [metaTitle, metaDescription, metaKeywordsString, ogTitle, ogDescription];
//     if (ogImagePath) seoParams.push(ogImagePath);
//     seoParams.push(parseInt(programId, 10));

//     await queryPromise(updateSEOQuery, seoParams);

//     // 🔄 **Update Benefits**
    
//     for (let i = 0; formData.has(`benefits[${i}][title]`); i++) {
//       const id = formData.get(`benefits[${i}][id]`);
//       const title = formData.get(`benefits[${i}][title]`);
//       const description = formData.get(`benefits[${i}][description]`);
//       const icon = formData.get(`benefits[${i}][icon]`);
//       const iconPath = icon && !icon.startsWith("http") ? await saveImage(icon) : icon; 
    
//       if (!id || id.trim() === "") {
//         const insertBenefitQuery = `INSERT INTO benefit (title, description, icon) VALUES (?, ?, ?);`;
//         await queryPromise(insertBenefitQuery, [title, description, iconPath]);
//       } else {
//         const updateBenefitQuery = `
//           UPDATE benefit SET 
//             title = ?, description = ?
//             ${iconPath ? ", icon = ?" : ""}
//           WHERE id = ?;
//         `;
    
//         const benefitParams = [title, description];
//         if (iconPath) benefitParams.push(iconPath);
//         benefitParams.push(id);
    
//         await queryPromise(updateBenefitQuery, benefitParams);
//       }
//     }
    

//     // 🔄 **Update Testimonials**
//     for (let i = 0; formData.has(`testimonials[${i}][id]`); i++) {
//       const id = formData.get(`testimonials[${i}][id]`);
//       if (!id || id.trim() === "") continue; // ❌ Skip if ID missing

//       const name = formData.get(`testimonials[${i}][name]`);
//       const designation = formData.get(`testimonials[${i}][designation]`);
//       const message = formData.get(`testimonials[${i}][message]`);
//       const profile = formData.get(`testimonials[${i}][profile]`);
//       const profilePath = profile ? await saveImage(profile) : null;

//       const updateTestimonialQuery = `
//         UPDATE testimonial SET 
//           name = ?, designation = ?, message = ?
//           ${profilePath ? ", profile = ?" : ""}
//         WHERE id = ?;
//       `;

//       const testimonialParams = [name, designation, message];
//       if (profilePath) testimonialParams.push(profilePath);
//       testimonialParams.push(id);

//       await queryPromise(updateTestimonialQuery, testimonialParams);
//     }

//     return NextResponse.json({ message: "✅ Program updated successfully" });

//   } catch (error) {
//     console.error("❌ Error updating program data:", error);
//     return NextResponse.json({ message: "Error updating program data" }, { status: 500 });
//   }
// }





// export async function PUT(request) {
//   try {
//     const formData = await request.formData();
//     const programId = formData.get("programId");

//     if (!programId) {
//       return NextResponse.json({ message: "Program ID is required" }, { status: 400 });
//     }

//     // **Program Fields**
//     const title = formData.get("title");
//     const subtitle = formData.get("subtitle");
//     const shortDescription = formData.get("shortDescription");
//     const description = formData.get("description");
//     const idealForDescription = formData.get("idealForDescription");
//     const timelineDescription = formData.get("timelineDescription");
//     const startDate = formData.get("startDate");
//     const endDate = formData.get("endDate");
//     const image = formData.get("image");

//     // **SEO Fields**
//     const metaTitle = formData.get("metaTitle");
//     const metaDescription = formData.get("metaDescription");
//     const metaKeywords = formData.get("metaKeywords");
//     const ogTitle = formData.get("ogTitle");
//     const ogDescription = formData.get("ogDescription");
//     const ogImages = formData.get("ogImages");

//     // **Benefits**
//     let benefits = [];
//     for (let i = 0; formData.has(`benefits[${i}][id]`); i++) {
//       benefits.push({
//         id: Number(formData.get(`benefits[${i}][id]`)),
//         title: formData.get(`benefits[${i}][title]`),
//         description: formData.get(`benefits[${i}][description]`),
//         icon: formData.get(`benefits[${i}][icon]`),
//       });
//     }

//     // **Testimonials**
//     let testimonials = [];
//     for (let i = 0; formData.has(`testimonials[${i}][id]`); i++) {
//       testimonials.push({
//         id: Number(formData.get(`testimonials[${i}][id]`)),
//         name: formData.get(`testimonials[${i}][name]`),
//         designation: formData.get(`testimonials[${i}][designation]`),
//         message: formData.get(`testimonials[${i}][message]`),
//         profile: formData.get(`testimonials[${i}][profile]`),
//       });
//     }

//     // **1. Update Program**
//     await queryPromise(
//       `UPDATE program SET 
//         title = ?, 
//         subtitle = ?, 
//         short_description = ?, 
//         description = ?, 
//         ideal_For_Description = ?, 
//         timeline_Description = ?, 
//         start_Date = ?, 
//         end_Date = ?, 
//         image = ? 
//       WHERE id = ?`,
//       [
//         title,
//         subtitle,
//         shortDescription,
//         description,
//         idealForDescription,
//         timelineDescription,
//         new Date(startDate),
//         new Date(endDate),
//         image,
//         programId,
//       ]
//     );

//     // **2. Update SEO**
//     await queryPromise(
//       `UPDATE seo SET 
//         meta_title = ?, 
//         meta_description = ?, 
//         meta_keywords = ?, 
//         og_images = ?, 
//         og_title = ?, 
//         og_description = ? 
//       WHERE programId = ?`,
//       [metaTitle, metaDescription, metaKeywords, ogImages, ogTitle, ogDescription, programId]
//     );

//     // **3. Update Benefits**
//     for (const benefit of benefits) {
//       await queryPromise(
//         `UPDATE benefit SET title = ?, description = ?, icon = ? WHERE id = ?`,
//         [benefit.title, benefit.description, benefit.icon, benefit.id]
//       );
//     }

//     // **4. Update Testimonials**
//     for (const testimonial of testimonials) {
//       await queryPromise(
//         `UPDATE testimonial SET name = ?, designation = ?, message = ?, profile = ? WHERE id = ?`,
//         [testimonial.name, testimonial.designation, testimonial.message, testimonial.profile, testimonial.id]
//       );
//     }

//     return NextResponse.json({ message: "Program updated successfully" });
//   } catch (error) {
//     console.error("Error updating program:", error);
//     return NextResponse.json({ message: "Error updating program" }, { status: 500 });
//   }
// }








export async function POST(request) {
  try {
    const formData = await request.formData();

    // **Extract Form Fields**
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
    const ogDescription = formData.get("ogDescription");
    const ogTitle = formData.get("ogTitle");
   
   
    // **Save ogImage to Blob Storage**
    const ogImage = formData.get("ogImage"); 
    const ogImagePath = ogImage ? await saveImage(ogImage) : null;  

    // **Program Image**
    const image = formData.get("image");
    const imagePath = image ? await saveImage(image) : null;

    // **Extract and Parse Benefits Data**
    let benefits = [];
    for (let i = 0; formData.has(`benefits[${i}][title]`); i++) {
      const title = formData.get(`benefits[${i}][title]`);
      const description = formData.get(`benefits[${i}][description]`);
      const icon = formData.get(`benefits[${i}][icon]`);
      const iconPath = icon ? await saveImage(icon) : null;

      benefits.push({ title, description, icon: iconPath });
    }

    // **Extract and Parse Testimonials Data**
    let testimonials = [];
    for (let i = 0; formData.has(`testimonials[${i}][name]`); i++) {
      const name = formData.get(`testimonials[${i}][name]`);
      const designation = formData.get(`testimonials[${i}][designation]`);
      const message = formData.get(`testimonials[${i}][message]`);
      const profile = formData.get(`testimonials[${i}][profile]`);
      const profilePath = profile ? await saveImage(profile) : null;

      testimonials.push({ name, designation, message, profile: profilePath });
    }

    // **Insert Program Data**
    const programInsertQuery = `
      INSERT INTO program (title, subtitle, short_description, description, ideal_For_Description, timeline_Description, start_Date, end_Date, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const programResult = await queryPromise(programInsertQuery, [
      title, subtitle, shortDescription, description, idealForDescription, timelineDescription, startDate, endDate, imagePath
    ]);

    const programId = programResult.insertId;

    // **Insert Benefits**
    for (const benefit of benefits) {
      const benefitInsertQuery = `INSERT INTO benefit (programId, icon, title, description) VALUES (?, ?, ?, ?)`;
      await queryPromise(benefitInsertQuery, [programId, benefit.icon, benefit.title, benefit.description]);
    }

    // **Insert Testimonials**
    for (const testimonial of testimonials) {
      const testimonialInsertQuery = `
        INSERT INTO testimonial (programId, name, profile, designation, message) 
        VALUES (?, ?, ?, ?, ?)
      `;
      await queryPromise(testimonialInsertQuery, [
        programId, testimonial.name, testimonial.profile, testimonial.designation, testimonial.message
      ]);
    }


  // **Insert SEO Data**
const seoInsertQuery = `
INSERT INTO seo (programId, meta_title, meta_description, meta_keywords, og_images, og_title, og_description)
VALUES (?, ?, ?, ?, ?, ?, ?)
`;
await queryPromise(seoInsertQuery, [
programId, metaTitle, metaDescription, metaKeywords, ogImagePath, ogTitle, ogDescription 
]);


    return NextResponse.json({ message: "Program added successfully" });
  } catch (error) {
    console.error("Error saving program data:", error);
    return NextResponse.json({ message: "Error saving program data" }, { status: 500 });
  }
}



export async function GET(request) {
  try {
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

        -- Benefits
        b.id AS benefitId,
        b.icon AS benefitIcon,
        b.title AS benefitTitle,
        b.description AS benefitDescription,

        -- Testimonials
        t.id AS testimonialId,
        t.name AS testimonialName,
        t.profile AS testimonialProfile,
        t.designation AS testimonialDesignation,
        t.message AS testimonialMessage,

        -- SEO Data
        s.meta_title,
        s.meta_description,
        s.meta_keywords,
        s.og_images,
        s.og_title,
        s.og_description,
        s.id as seoid

      FROM program p
      LEFT JOIN benefit b ON p.id = b.programId
      LEFT JOIN testimonial t ON p.id = t.programId
      LEFT JOIN seo s ON p.id = s.programId
    `;

    const programs = await queryPromise(programQuery);

    // Format the data into a structured response
    const result = programs.reduce((acc, program) => {
      let programData = acc.find((p) => p.programId === program.programId);

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
          benefits: new Map(),
          testimonials: new Map(),

          // SEO Data
          seo: {
            metaTitle: program.meta_title,
            metaDescription: program.meta_description,
            metaKeywords: program.meta_keywords,
            ogImages: program.og_images,
            ogTitle: program.og_title,
            ogDescription: program.og_description,
            seoid:program.seoid
          },
        };
        acc.push(programData);
      }

      // Add benefit data if available and not already added
      if (program.benefitId && !programData.benefits.has(program.benefitId)) {
        programData.benefits.set(program.benefitId, {
          benefitId: program.benefitId,
          icon: program.benefitIcon,
          title: program.benefitTitle,
          description: program.benefitDescription,
        });
      }

      // Add testimonial data if available and not already added
      if (program.testimonialId && !programData.testimonials.has(program.testimonialId)) {
        programData.testimonials.set(program.testimonialId, {
          testimonialId: program.testimonialId,
          name: program.testimonialName,
          profile: program.testimonialProfile,
          designation: program.testimonialDesignation,
          message: program.testimonialMessage,
        });
      }

      return acc;
    }, []);

    // Convert Maps to Arrays for the final response
    const finalResult = result.map((program) => ({
      ...program,
      benefits: Array.from(program.benefits.values()),
      testimonials: Array.from(program.testimonials.values()),
    }));

    // Return the structured data as a JSON response
    return NextResponse.json(finalResult);
  } catch (error) {
    console.error("Error fetching program data:", error);
    return NextResponse.json({ message: "Error fetching program data" }, { status: 500 });
  }
}
