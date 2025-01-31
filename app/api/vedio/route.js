import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { queryPromise } from '../../../lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};


export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const video = formData.get('video');

    if (!title || !description || !video) {
      return NextResponse.json({ message: 'Please provide all required fields.' }, { status: 400 });
    }

    // Validate file type
    if (!video.type.startsWith('video/')) {
      return NextResponse.json({ message: 'Only video files are allowed.' }, { status: 400 });
    }

    // Validate file size (100MB limit)
    if (video.size > 100 * 1024 * 1024) {
      return NextResponse.json({ message: 'File size exceeds 100MB limit.' }, { status: 400 });
    }

    const bytes = await video.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file
    const filename = Date.now() + '-' + video.name;
    const path = join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(path, buffer);

    const videoUrl = `/uploads/${filename}`;

    // Insert video details into the database using queryPromise
    const query = 'INSERT INTO Video (title, description, url) VALUES (?, ?, ?)';
    const result = await queryPromise(query, [title, description, videoUrl]);

    return NextResponse.json({ message: 'Video uploaded successfully!', videoId: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json({ message: 'Error uploading video.', error: error.message }, { status: 500 });
  }
}

export async function GET() {
    try {
      const query = 'SELECT id, title, description, url FROM Video ORDER BY id DESC';
      const videos = await queryPromise(query);
  
      return NextResponse.json(videos, { status: 200 });
    } catch (error) {
      console.error('Error fetching videos:', error);
      return NextResponse.json(
        { message: 'Error fetching videos.', error: error.message },
        { status: 500 }
      );
    }
  }
  


  