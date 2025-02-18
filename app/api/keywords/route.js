import { NextResponse } from "next/server";
import { queryPromise } from '@/lib/db'; 
import { mkdir, writeFile } from 'fs/promises';
import { join, extname } from 'path';


  
  // API handler function
  export async function POST(request) {
    try {
        const formData = await request.formData();
        const metaTitle = formData.get('metaTitle');
        const metaDescription = formData.get('metaDescription');
        const metaKeywords = formData.get('metaKeywords');
        const ogImages = formData.getAll('ogImage');
        const og_title = formData.get('og_title'); // ✅ यह ऐड किया
        
        if (!metaTitle || !metaDescription || !ogImages.length) {
            return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
        }

        let imagePaths = [];
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

        const insertQuery = `
            INSERT INTO seo (meta_title, meta_description, meta_keywords, og_images, og_title)
            VALUES (?, ?, ?, ?, ?);
        `;
        
        const queryValues = [
            metaTitle,
            metaDescription,
            metaKeywords ? metaKeywords.split(',').map(k => k.trim()).join(',') : null,
            JSON.stringify(imagePaths),
            og_title // ✅ इसे जोड़ा
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


