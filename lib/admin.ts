import { NextResponse } from "next/server"

export const ADMIN_IDS = (process.env.ADMIN_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean)

export function isAdminUser(userId?: string | null) {
  return !!userId && ADMIN_IDS.includes(userId)
}

export function requireAdmin(userId?: string | null) {
  if (!isAdminUser(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return null
}
