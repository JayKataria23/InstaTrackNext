import { db } from "@/lib/astra";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get username from URL search params
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 }
      );
    }

    // Query the posts collection for the specified username
    const posts = await db
      .collection("posts")
      .find({ username: username })
      .toArray();

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
