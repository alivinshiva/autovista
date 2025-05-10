import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { createReadStream } from '@/utils/gridfs'

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename

    // Create read stream
    const readStream = createReadStream(filename)

    // Set appropriate headers
    const headers = new Headers()
    headers.set('Content-Type', 'model/gltf-binary')
    headers.set('Content-Disposition', `inline; filename="${filename}"`)

    // Return the file stream
    return new NextResponse(readStream as any, {
      headers
    })
  } catch (error: any) {
    console.error('Error serving model:', error)
    return NextResponse.json({
      error: 'Failed to serve model file'
    }, { status: 500 })
  }
} 