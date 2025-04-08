// /app/api/benefit/route.js
import { NextResponse } from "next/server";
import { queryPromise } from "@/lib/db";
import { put } from "@vercel/blob";

async function saveImage(file) {
  if (!file || !file.name) return null;
  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExtension}`;
  const blob = await put(fileName, file, { access: 'public' });
  return blob.url;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const programId = formData.get("programId");
    const title = formData.get("title");
    const description = formData.get("description");
    const icon = formData.get("icon");
    const iconPath = icon ? await saveImage(icon) : null;

    if (!programId || !title || !description) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await queryPromise(
      `INSERT INTO benefit (programId, title, description, icon) VALUES (?, ?, ?, ?)`,
      [programId, title, description, iconPath]
    );

    return NextResponse.json({ message: "Benefit added successfully" });
  } catch (error) {
    console.error("Error adding benefit:", error);
    return NextResponse.json({ message: "Error adding benefit" }, { status: 500 });
  }
}

