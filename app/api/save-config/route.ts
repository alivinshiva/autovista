// app/api/save-config/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { databases } from '@/lib/appwrite'

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const CONFIG_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CONFIG_COLLECTION_ID

if (!DATABASE_ID || !CONFIG_COLLECTION_ID) {
  throw new Error('Please define the Appwrite database and collection IDs in .env')
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Create configuration document in Appwrite
    const result = await databases.createDocument(
      DATABASE_ID as string,
      CONFIG_COLLECTION_ID as string,
      'unique()', // Let Appwrite generate a unique ID
      {
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        modelName: data.modelName,
        bodyColor: data.bodyColor,
        wheelColor: data.wheelColor,
        wheelScale: data.wheelScale,
        wheels: data.wheels,
        headlights: data.headlights,
        interiorColor: data.interiorColor,
        accessories: data.accessories || [],
        isShared: false,
        createdAt: new Date().toISOString()
      }
    )

    return NextResponse.json({ 
      success: true, 
      id: result.$id 
    })
  } catch (error) {
    console.error('Error saving configuration:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to save configuration' 
      },
      { status: 500 }
    )
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
