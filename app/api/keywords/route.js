import { NextResponse } from "next/server";
import { queryPromise } from '@/lib/db'; 
import { mkdir, writeFile } from 'fs/promises';
import { join, extname } from 'path';


  
  // API handler function
  export async function POST(request) {
    try {
        const formData = await request.formData(); // Parse the incoming multipart form-data
        const metaTitle = formData.get('metaTitle');
        const metaDescription = formData.get('metaDescription');
        const metaKeywords = formData.get('metaKeywords');
        const ogImages = formData.getAll('ogImage');
        const og_title = formData.get('og_title');
        console.log(formData);

        if (!metaTitle || !metaDescription || !ogImages.length) {
            return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
        }

        let imagePaths = [];

        // Handle image saving for multiple images
        if (ogImages.length > 0) {
            for (let i = 0; i < ogImages.length; i++) {
                const image = ogImages[i];
                const imageExtension = extname(image.name);
                const imageName = `${Date.now()}-${i}${imageExtension}`;
                const imageDir = join(process.cwd(), 'public', 'uploads');
                const imageFilePath = join(imageDir, imageName);

                await mkdir(imageDir, { recursive: true });
                await writeFile(imageFilePath, Buffer.from(await image.arrayBuffer()));

                imagePaths.push(`/uploads/${imageName}`);
            }
        }

        // Prepare SQL query to save data
        const insertQuery = `
            INSERT INTO seo (meta_title, meta_description, meta_keywords, og_images, og_title)
            VALUES (?, ?, ?, ?,?);
        `;
        const queryValues = [
            metaTitle,
            metaDescription,
            metaKeywords ? metaKeywords.split(',').map(k => k.trim()).join(',') : null,
            JSON.stringify(imagePaths) // Save the image paths as a JSON array
        ];

        const result = await queryPromise(insertQuery, queryValues);

        return NextResponse.json({
            message: "SEO data inserted successfully",
            result
        });
    } catch (error) {
        console.error("Error inserting SEO data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}




export async function GET(req) {
    try {
        // Query to fetch all SEO data from the 'seo' table
        const selectQuery = `
            SELECT id, meta_title, meta_description, meta_keywords, og_images,og_title
            FROM seo;
        `;
        
        // Execute the query to get SEO data
        const result = await queryPromise(selectQuery);
        console.log("SQL Query Result:", result);

        // Check if no data was found
        if (result.length === 0) {
            console.log("No SEO data found");
            return NextResponse.json({
                error: "No SEO data found"
            }, { status: 404 });
        }

        // Return the SEO data
        return NextResponse.json({
            message: "SEO data fetched successfully",
            data: result
        });

    } catch (error) {
        console.error("Error fetching SEO data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        // Parse incoming request body
        const body = await req.json();
        console.log("Request Body:", body);

        const { id, metaTitle, metaDescription, metaKeywords, ogImages } = body;

        // Validate required fields
        if (!id) {
            console.log("Validation Failed: Missing ID");
            return NextResponse.json({ error: "ID is required to update SEO data" }, { status: 400 });
        }

        if (!metaTitle || !metaDescription) {
            console.log("Validation Failed: Missing required fields");
            return NextResponse.json({ error: "metaTitle and metaDescription are required" }, { status: 400 });
        }

        // Prepare SQL query for updating SEO data
        const updateQuery = `
            UPDATE seo 
            SET 
                meta_title = ?, 
                meta_description = ?, 
                meta_keywords = ?, 
                og_images = ?
            WHERE 
                id = ?;
        `;

        // Prepare query values
        const queryValues = [
            metaTitle,
            metaDescription,
            metaKeywords ? metaKeywords.join(",") : null,
            ogImages ? JSON.stringify(ogImages) : null,
            id
        ];

        console.log("SQL Query:", updateQuery);
        console.log("Query Values:", queryValues);

        // Execute the query
        const result = await queryPromise(updateQuery, queryValues);

        // Check if any row was affected
        if (result.affectedRows === 0) {
            console.log("No record found with the provided ID");
            return NextResponse.json({ error: "No record found with the provided ID" }, { status: 404 });
        }

        // Return success response
        return NextResponse.json({
            message: "SEO data updated successfully",
            result
        });

    } catch (error) {
        console.error("Error updating SEO data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
