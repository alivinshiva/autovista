import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { getAuth } from '@clerk/nextjs/server'
import fs from 'fs'
import path from 'path'
import { GridFSBucket, Db } from 'mongodb'

// Schema for developer car models
const DeveloperCarModelSchema = new mongoose.Schema({
  modelName: { type: String, required: true },
  modelPath: { type: String, required: true },
  slug: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now }
})

const DeveloperCarModel = mongoose.models.DeveloperCarModel || mongoose.model('DeveloperCarModel', DeveloperCarModelSchema)

interface UploadedFile {
  filename: string;
  size: number;
}

interface GridFSFile {
  filename: string;
  length: number;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) {
      throw new Error('MongoDB URI is not defined')
    }

    await mongoose.connect(MONGODB_URI, {
      dbName: 'autovisa'
    })

    // Initialize GridFS bucket
    const db = mongoose.connection.db as Db
    const bucket = new GridFSBucket(db, {
      bucketName: 'glbModels'
    })

    // Define the car models
    const carModels = [
      { name: "Tata Safari", path: "/assets/3d/2021_tata_safari.glb", slug: "2021_tata_safari" },
      { name: "Maruti Suzuki Baleno", path: "/assets/3d/2022_maruti_suzuki_baleno.glb", slug: "2022_maruti_suzuki_baleno" },
      { name: "Hyundai Creta", path: "/assets/3d/2023_hyundai_creta.glb", slug: "2023_hyundai_creta" },
      { name: "Audi", path: "/assets/3d/audi.glb", slug: "audi" },
      { name: "BMW M4 CSL 2023", path: "/assets/3d/bmw_m4_csl_2023.glb", slug: "bmw_m4_csl_2023" },
      { name: "Fortuner", path: "/assets/3d/fortuner.glb", slug: "fortuner" },
      { name: "Toyota GR Supra", path: "/assets/3d/toyota_gr_supra.glb", slug: "toyota_gr_supra" }
    ]

    console.log('Starting upload process...')

    // Clear existing models
    await DeveloperCarModel.deleteMany({})
    console.log('Cleared existing models from database')

    try {
      await bucket.drop()
      console.log('Cleared existing files from GridFS bucket')
    } catch (error) {
      console.log('No existing bucket to clear')
    }

    // Upload all models with progress tracking
    const results = []
    for (const model of carModels) {
      try {
        console.log(`Processing ${model.name}...`)
        
        // Read the GLB file
        const publicPath = path.join(process.cwd(), 'public')
        const filePath = path.join(publicPath, model.path)
        console.log(`Reading file from: ${filePath}`)
        
        const fileBuffer = await fs.promises.readFile(filePath)
        console.log(`File size: ${fileBuffer.length} bytes`)

        // Upload to GridFS
        const uploadStream = bucket.openUploadStream(path.basename(model.path), {
          metadata: {
            modelName: model.name,
            slug: model.slug
          }
        })

        // Create a promise to handle the upload
        const uploadPromise = new Promise<UploadedFile>((resolve, reject) => {
          uploadStream.on('finish', (file: GridFSFile) => {
            console.log(`Upload finished for ${model.name}`)
            resolve({
              filename: file.filename,
              size: file.length
            })
          })
          uploadStream.on('error', (error) => {
            console.error(`Upload error for ${model.name}:`, error)
            reject(error)
          })
        })

        // Write the file buffer to the upload stream
        uploadStream.write(fileBuffer)
        uploadStream.end()

        // Wait for the upload to complete
        const uploadedFile = await uploadPromise
        console.log(`Successfully uploaded ${model.name}`)

        // Create model document
        const modelDoc = new DeveloperCarModel({
          modelName: model.name,
          modelPath: `/api/models/${uploadedFile.filename}`,
          slug: model.slug
        })
        await modelDoc.save()
        console.log(`Saved model document for ${model.name}`)

        results.push({
          name: model.name,
          status: 'success',
          size: uploadedFile.size
        })
      } catch (err) {
        console.error(`Error processing ${model.name}:`, err)
        const error = err as Error
        results.push({
          name: model.name,
          status: 'error',
          error: error.message || 'Unknown error'
        })
      }
    }

    console.log('Upload process completed')
    return NextResponse.json({
      success: true,
      message: 'All car models uploaded successfully',
      results: results
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to upload models'
    }, { status: 500 })
  } finally {
    await mongoose.disconnect()
  }
} 