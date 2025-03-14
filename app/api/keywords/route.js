import { NextResponse } from "next/server";
import { queryPromise } from "@/lib/db";
import { put } from "@vercel/blob"; // ✅ Vercel Blob import kiya

export async function POST(request) {
    try {
        const formData = await request.formData();
        const metaTitle = formData.get("metaTitle");
        const metaDescription = formData.get("metaDescription");
        const metaKeywords = formData.get("metaKeywords");
        const ogImages = formData.getAll("ogImage");
        const og_title = formData.get("og_title");

        if (!metaTitle || !metaDescription || !ogImages.length) {
            return NextResponse.json(
                { error: "All required fields must be filled" },
                { status: 400 }
            );
        }

        let imagePaths = [];
        if (ogImages.length > 0) {
            for (let i = 0; i < ogImages.length; i++) {
                const image = ogImages[i];

                // ✅ Blob Storage me upload karne ke liye `put` ka use
                const blob = await put(`seo/${Date.now()}-${i}-${image.name}`, image, {
                    access: "public",
                });

                imagePaths.push(blob.url);
            }
        }

        // ✅ SQL Query with Blob URL
        const insertQuery = `
            INSERT INTO seo (meta_title, meta_description, meta_keywords, og_images, og_title)
            VALUES (?, ?, ?, ?, ?);
        `;

        const queryValues = [
            metaTitle,
            metaDescription,
            metaKeywords ? metaKeywords.split(",").map(k => k.trim()).join(",") : null,
            JSON.stringify(imagePaths),
            og_title,
        ];

        const result = await queryPromise(insertQuery, queryValues);

        return NextResponse.json({
            message: "SEO data inserted successfully",
            result,
            imagePaths,
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


