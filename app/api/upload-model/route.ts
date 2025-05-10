import { NextRequest, NextResponse } from 'next/server'
import { upload } from '@/utils/gridfs'
import { getAuth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const modelName = formData.get('modelName') as string
    const slug = formData.get('slug') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Create a temporary file to store the uploaded data
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to GridFS
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = upload.single('file')
      const mockReq = {
        file: {
          buffer,
          originalname: file.name,
          mimetype: file.type
        },
        body: {
          modelName,
          slug
        }
      } as any

      uploadStream(mockReq, {} as any, (err: any) => {
        if (err) reject(err)
        else resolve(mockReq.file)
      })
    })

    const uploadedFile = await uploadPromise

    return NextResponse.json({
      success: true,
      filename: uploadedFile.filename,
      size: uploadedFile.size
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to upload model'
    }, { status: 500 })
  }
} 