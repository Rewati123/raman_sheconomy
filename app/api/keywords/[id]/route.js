import { NextResponse } from "next/server"
import { queryPromise } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const [rows] = await queryPromise.query("SELECT * FROM keywords WHERE id = ?", [params.id])
    if (rows.length === 0) {
      return NextResponse.json({ error: "Keyword not found" }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Failed to fetch keyword:", error)
    return NextResponse.json({ error: "Failed to fetch keyword" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { text } = await request.json()
    await queryPromise.query("UPDATE keywords SET text = ? WHERE id = ?", [text, params.id])
    const [updatedKeyword] = await queryPromise.query("SELECT * FROM keywords WHERE id = ?", [params.id])
    return NextResponse.json(updatedKeyword[0])
  } catch (error) {
    console.error("Failed to update keyword:", error)
    return NextResponse.json({ error: "Failed to update keyword" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await queryPromise.query("DELETE FROM keywords WHERE id = ?", [params.id])
    return NextResponse.json({ message: "Keyword deleted successfully" })
  } catch (error) {
    console.error("Failed to delete keyword:", error)
    return NextResponse.json({ error: "Failed to delete keyword" }, { status: 500 })
  }
}

