import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { isAdminUser } from "@/lib/admin"

export async function GET() {
  try {
    const { userId } = await auth()
    return NextResponse.json({ isAdmin: isAdminUser(userId) })
  } catch (err) {
    return NextResponse.json({ isAdmin: false })
  }
}
