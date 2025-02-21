import { NextResponse } from 'next/server';
import { queryPromise } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';

// export async function POST(request) {
//   try {
//     const formData = await request.formData();

//     // Extract form fields
//     const title = formData.get('title');
//     const subtitle = formData.get('subtitle');
//     const shortDescription = formData.get('shortDescription');
//     const description = formData.get('description');
//     const idealForDescription = formData.get('idealForDescription');
//     const timelineDescription = formData.get('timelineDescription');
//     const startDate = formData.get('startDate');
//     const endDate = formData.get('endDate');
//     const benefits = formData.get('benefits');
//     const testimonial = formData.get('testimonial');
//     const image = formData.get('image');

   

//     // Parse benefits and testimonial with error handling
//     let parsedBenefits = [];
//     let parsedTestimonial = {};

//     try {
//       parsedBenefits = JSON.parse(benefits || '[]');
//     } catch (e) {
//       console.error('Error parsing benefits:', e);
//     }

//     try {
//       parsedTestimonial = JSON.parse(testimonial || '{}');
//     } catch (e) {
//       console.error('Error parsing testimonial:', e);
//     }

//     // Handle file upload (image)
//     let imagePath = null;
//     if (image) {
//       const imageExtension = extname(image.name);
//       const imageName = `${Date.now()}${imageExtension}`;
//       const imageDir = join(process.cwd(), 'public', 'uploads');
//       await mkdir(imageDir, { recursive: true });
//       const imageFilePath = join(imageDir, imageName);
//       await writeFile(imageFilePath, Buffer.from(await image.arrayBuffer()));
//       imagePath = `/uploads/${imageName}`;
//     }

//     // Insert program data into the program table
//     const programInsertQuery = `
//       INSERT INTO Program (title, subtitle, short_description, description, ideal_For_Description, timeline_Description, start_Date, end_Date, image)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;
//     const programResult = await queryPromise(programInsertQuery, [
//       title,
//       subtitle,
//       shortDescription,
//       description,
//       idealForDescription,
//       timelineDescription,
//       startDate,
//       endDate,
//       imagePath,
//     ]);

//     const programId = programResult.insertId;

   
//     console.log('Program inserted with ID:', programId);
//     console.log('Parsed Benefits:', parsedBenefits);

//     // Insert benefits into the benefits table with icon file path handling
//     if (parsedBenefits.length > 0) {
//       for (const benefit of parsedBenefits) {
//         let iconPath = null;

//         // Check if the benefit has an icon
//         if (benefit.icon && benefit.icon.name) {
//           const iconExtension = extname(benefit.icon.name);
//           const iconName = `${Date.now()}${iconExtension}`;
//           const iconDir = join(process.cwd(), 'public', 'uploads');
          
//           // Ensure the uploads directory exists
//           await mkdir(iconDir, { recursive: true });
          
//           // Write the icon to the server
//           const iconFilePath = join(iconDir, iconName);
//           await writeFile(iconFilePath, benefit.icon.data); // Assuming icon data is available in `benefit.icon.data`
//           iconPath = `/uploads/${iconName}`;
//         } else {
//           console.log('No icon provided for the benefit');
//         }

//         const benefitInsertQuery = `
//           INSERT INTO Benefit (programId, icon, title, description)
//           VALUES (?, ?, ?, ?)
//         `;
//         await queryPromise(benefitInsertQuery, [
//           programId,
//           iconPath,  // Use the iconPath here
//           benefit.title,
//           benefit.description,
//         ]);
//       }
//       console.log('Benefits inserted:', parsedBenefits);
//     } else {
//       console.log('No benefits to insert');
//     }

//     console.log('Parsed Testimonial:', parsedTestimonial);

//     // Insert testimonial into the testimonials table
//     if (parsedTestimonial && parsedTestimonial.name) {
//       let profilePath = null;

//       // Check if the testimonial has a profile image
//       if (parsedTestimonial.profile && parsedTestimonial.profile.name) {
//         const profileExtension = extname(parsedTestimonial.profile.name);
//         const profileName = `${Date.now()}${profileExtension}`;
//         const profileDir = join(process.cwd(), 'public', 'uploads');
//         await mkdir(profileDir, { recursive: true });
//         const profileFilePath = join(profileDir, profileName);
//         await writeFile(profileFilePath, Buffer.from(await parsedTestimonial.profile.arrayBuffer()));
//         profilePath = `/uploads/${profileName}`;
//       } else {
//         console.log('No profile image provided for the testimonial');
//       }

//       const testimonialInsertQuery = `
//         INSERT INTO Testimonial (programId, name, profile, designation, message)
//         VALUES (?, ?, ?, ?, ?)
//       `;
//       await queryPromise(testimonialInsertQuery, [
//         programId,
//         parsedTestimonial.name || 'Anonymous', 
//         profilePath,
//         parsedTestimonial.designation,
//         parsedTestimonial.message,
//       ]);
//       console.log('Testimonial inserted:', parsedTestimonial);
//     } else {
//       console.log('No testimonial to insert');
//     }

//     // Final response
//     return NextResponse.json({ message: 'Program added successfully' });
//   } catch (error) {
//     console.error('Error saving program data:', error);
//     return NextResponse.json({ message: 'Error saving program data' }, { status: 500 });
//   }
// }




// Helper function to save image files
async function saveImage(file) {
  if (!file) return null;
  
  const fileExtension = extname(file.name);
  const fileName = `${Date.now()}${fileExtension}`;
  const fileDir = join(process.cwd(), 'public', 'uploads');
  
  await mkdir(fileDir, { recursive: true });
  const filePath = join(fileDir, fileName);
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
  
  return `/uploads/${fileName}`;
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const title = formData.get("title");
    const subtitle = formData.get("subtitle");
    const shortDescription = formData.get("shortDescription");
    const description = formData.get("description");
    const idealForDescription = formData.get("idealForDescription");
    const timelineDescription = formData.get("timelineDescription");
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");

    // **Program Image**
    const image = formData.get("image");
    const imagePath = await saveImage(image);

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
    `

    const programs = await queryPromise(programQuery)

    // Format the data into a structured response
    const result = programs.reduce((acc, program) => {
      let programData = acc.find((p) => p.programId === program.programId)

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
        }
        acc.push(programData)
      }

      // Add benefit data if available and not already added
      if (program.benefitId && !programData.benefits.has(program.benefitId)) {
        programData.benefits.set(program.benefitId, {
          benefitId: program.benefitId,
          icon: program.benefitIcon,
          title: program.benefitTitle,
          description: program.benefitDescription,
        })
      }

      // Add testimonial data if available and not already added
      if (program.testimonialId && !programData.testimonials.has(program.testimonialId)) {
        programData.testimonials.set(program.testimonialId, {
          testimonialId: program.testimonialId,
          name: program.testimonialName,
          profile: program.testimonialProfile,
          designation: program.testimonialDesignation,
          message: program.testimonialMessage,
        })
      }

      return acc
    }, [])

    // Convert Maps to Arrays for the final response
    const finalResult = result.map((program) => ({
      ...program,
      benefits: Array.from(program.benefits.values()),
      testimonials: Array.from(program.testimonials.values()),
    }))

    // Return the structured data as a JSON response
    return NextResponse.json(finalResult)
  } catch (error) {
    console.error("Error fetching program data:", error)
    return NextResponse.json({ message: "Error fetching program data" }, { status: 500 })
  }
}
