import { NextResponse } from "next/server";
import { queryPromise } from "@/lib/db";
async function saveImage(file) {
    if (!file || !file.name) return null; 
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    const blob = await put(fileName, file, { access: 'public' });
    return blob.url;
  }

export async function PUT(request, { params }) {
  try {
    const benefitId = params.id;
    const formData = await request.formData();
    const programId = formData.get("programId");

    const existing = await queryPromise(`SELECT * FROM benefit WHERE id = ? AND programId = ?`, [benefitId, programId]);
    const iconFile = formData.get("icon");
    const iconUrl = iconFile ? await saveImage(iconFile) : existing[0]?.icon;

    await queryPromise(
      `UPDATE benefit SET title = COALESCE(?, title), description = COALESCE(?, description), icon = COALESCE(?, icon) WHERE id = ? AND programId = ?`,
      [
        formData.get("title") || existing[0]?.title,
        formData.get("description") || existing[0]?.description,
        iconUrl,
        benefitId,
        programId
      ]
    );

    return NextResponse.json({ message: "Benefit updated successfully" });
  } catch (error) {
    console.error("Error updating benefit:", error);
    return NextResponse.json({ message: "Error updating benefit" }, { status: 500 });
  }
}

export async function DELETE(request, { params, url }) {
  try {
    const benefitId = params.id;
    const programId = new URL(request.url).searchParams.get("programId");

    await queryPromise(`DELETE FROM benefit WHERE id = ? AND programId = ?`, [benefitId, programId]);
    return NextResponse.json({ message: "Benefit deleted successfully" });
  } catch (error) {
    console.error("Error deleting benefit:", error);
    return NextResponse.json({ message: "Error deleting benefit" }, { status: 500 });
  }
}
