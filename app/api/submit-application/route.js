// pages/api/applications/index.ts
import { NextRequest, NextResponse } from 'next/server'
import { queryPromise } from '@/lib/db';


  export async function GET() {
    try {
      const query = 'SELECT id, fullName, email, phone,startupName,description,profileLink FROM application ORDER BY id DESC';
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