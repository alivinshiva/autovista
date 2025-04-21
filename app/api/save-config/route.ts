// // app/api/save-config/route.ts
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
//     await connectToDB()

//     const result = await CarConfig.create({
//       userId,
//       createdAt: new Date(),
//       config: body, // You can spread body fields here if you want
//     })

//     return NextResponse.json({ success: true, id: result._id })
//   } catch (err) {
//     console.error('Error saving car config:', err)
//     return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 })
//   }
// }


import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { connectToDB } from '@/lib/mongodb'
import { CarConfig } from '@/models/CarConfig'

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    await connectToDB()

    const {
      userEmail,
      userName,
      modelName,
      bodyColor,
      wheelColor,
      wheelScale,
      finishType,
      wheels,
      headlights,
      interiorColor,
      accessories,
      isShared = false,
    } = body

    const result = await CarConfig.create({
      userId,
      userEmail,
      userName,
      modelName,
      bodyColor,
      wheelColor,
      wheelScale,
      finishType,
      wheels,
      headlights,
      interiorColor,
      accessories,
      isShared,
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, id: result._id })
  } catch (err) {
    console.error('Error saving car config:', err)
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 })
  }
}
