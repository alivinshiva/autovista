import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import db from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json()

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
   
    const result = db.prepare(`INSERT INTO Configs (userId, userEmail, userName, modelName, bodyColor, wheelColor, wheelScale, finishType, wheels, headlights, interiorColor, accessories, isShared, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(userId, userEmail, userName, modelName, bodyColor, wheelColor, wheelScale, finishType, wheels, headlights, interiorColor, JSON.stringify(accessories), isShared, new Date())
   
    return NextResponse.json({ success: true, id: result.lastInsertRowid })
  } catch (err) {
    console.error('Error saving car config:', err)
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 })
  }
}
