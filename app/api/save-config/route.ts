// app/api/save-config/route.ts
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'

// Define the schema directly in the route file
const CarConfigSchema = new mongoose.Schema({
  userId: String,
  userEmail: String,
  modelName: String,
  modelPath: String,
  bodyColor: String,
  wheelColor: String,
  wheelScale: Number,
  finish: String,
  wheels: String,
  headlights: String,
  interiorColor: String,
  createdAt: { type: Date, default: Date.now }
})

// Create model if it doesn't exist
const CarConfig = mongoose.models.CarConfig || mongoose.model('CarConfig', CarConfigSchema)

export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) {
      throw new Error('MongoDB URI is not defined')
    }

    await mongoose.connect(MONGODB_URI, {
      dbName: 'autovisa'
    })

    // Get request data
    const data = await req.json()
    
    // Create new config
    const config = new CarConfig({
      userId: data.userId,
      userEmail: data.userEmail,
      modelName: data.modelName,
      modelPath: data.modelPath,
      bodyColor: data.bodyColor,
      wheelColor: data.wheelColor,
      wheelScale: data.wheelScale,
      finish: data.finish,
      wheels: data.wheels,
      headlights: data.headlights,
      interiorColor: data.interiorColor
    })

    // Save to database
    await config.save()

    return NextResponse.json({ 
      success: true, 
      message: 'Configuration saved successfully',
      configId: config._id 
    })

  } catch (error: any) {
    console.error('Save config error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to save configuration' 
    }, { 
      status: 500 
    })
  } finally {
    // Close the connection
    await mongoose.disconnect()
  }
}


// import { NextRequest, NextResponse } from 'next/server'
// import { getAuth } from '@clerk/nextjs/server'
// import { connectToDB } from '@/lib/mongodb'
// import { CarConfig } from '@/models/CarConfig'

// export async function POST(req: NextRequest) {
//   try {
//     const { userId } = getAuth(req)
//     if (!userId) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const body = await req.json()
    
//     if (!body.userEmail) {
//       return NextResponse.json({ error: 'User email is required' }, { status: 400 })
//     }

//     await connectToDB()

//     const config = {
//       userId,
//       userEmail: body.userEmail,
//       userName: body.userName,
//       modelName: body.modelName,
//       modelPath: body.modelPath,
//       bodyColor: body.bodyColor,
//       wheelColor: body.wheelColor,
//       wheelScale: body.wheelScale,
//       finishType: body.finish, // Note: frontend sends 'finish', we store as 'finishType'
//       wheels: body.wheels,
//       headlights: body.headlights,
//       interiorColor: body.interiorColor,
//       accessories: body.accessories || [],
//       isShared: false,
//       createdAt: new Date()
//     }

//     console.log('Saving config:', config) // Debug log

//     const result = await CarConfig.create(config)

//     return NextResponse.json({ 
//       success: true, 
//       config: {
//         id: result._id,
//         modelName: result.modelName,
//         createdAt: result.createdAt
//       }
//     })
//   } catch (err: any) {
//     console.error('Error saving car config:', err)
//     return NextResponse.json({ 
//       error: err.message || 'Failed to save configuration' 
//     }, { 
//       status: 500 
//     })
//   }
// }
