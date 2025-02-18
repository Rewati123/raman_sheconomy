import { NextResponse } from "next/server";
import { queryPromise } from '@/lib/db';
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";

export async function DELETE(request, { params }) {
    try {
        // ✅ Extract `id` from dynamic route params
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "SEO ID is required" }, { status: 400 });
        }

        // ✅ Data delete karna
        const deleteQuery = `DELETE FROM seo WHERE id = ?`;
        const result = await queryPromise(deleteQuery, [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "SEO record not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "SEO data deleted successfully" });
    } catch (error) {
        console.error("Error deleting SEO data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function PUT(request) {
    try {
        const formData = await request.formData();
        const id = formData.get("id");
        const metaTitle = formData.get("metaTitle");
        const metaDescription = formData.get("metaDescription");
        const metaKeywords = formData.get("metaKeywords");
        const ogImages = formData.getAll("ogImage");
        const ogTitle = formData.get("og_title");

        if (!id || !metaTitle || !metaDescription) {
            return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
        }

        let imagePaths = [];
        if (ogImages.length > 0) {
            for (let i = 0; i < ogImages.length; i++) {
                const image = ogImages[i];
                const imageExtension = extname(image.name);
                const imageName = `${Date.now()}-${i}${imageExtension}`;
                const imageDir = join(process.cwd(), "public", "uploads");
                const imageFilePath = join(imageDir, imageName);

                await mkdir(imageDir, { recursive: true });
                await writeFile(imageFilePath, Buffer.from(await image.arrayBuffer()));

                imagePaths.push(`/uploads/${imageName}`);
            }
        }

        const updateQuery = `
            UPDATE seo 
            SET meta_title = ?, meta_description = ?, meta_keywords = ?, og_images = ?, og_title = ?
            WHERE id = ?;
        `;

        const queryValues = [
            metaTitle,
            metaDescription,
            metaKeywords ? metaKeywords.split(",").map(k => k.trim()).join(",") : null,
            JSON.stringify(imagePaths),
            ogTitle,
            id
        ];

        await queryPromise(updateQuery, queryValues);

        return NextResponse.json({ message: "SEO data updated successfully" });
    } catch (error) {
        console.error("Error updating SEO data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
