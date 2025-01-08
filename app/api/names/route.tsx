import { NextResponse } from "next/server";
import { db } from "@/lib/astra";

export async function GET() {
  try {
    // Get distinct usernames from posts collection
    const usernames = await db.collection("posts").distinct("username");

    return NextResponse.json({
      usernames,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching usernames:", error);
    return NextResponse.json(
      { error: "Failed to fetch usernames", success: false },
      { status: 500 }
    );
  }
}
