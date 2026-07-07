import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { isAdminUser, ADMIN_IDS } from "@/lib/admin"

export async function GET() {
  try {
    const { userId } = await auth()
    return NextResponse.json({
      isAdmin: isAdminUser(userId),
      hasUserId: !!userId,
      userId,
      adminCount: ADMIN_IDS.length,
      envSet: ADMIN_IDS.length > 0,
    })
  } catch (err) {
    return NextResponse.json({ isAdmin: false, error: String(err) })
  }
}
