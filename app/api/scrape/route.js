import { NextResponse } from "next/server";
import fetch from "node-fetch";

export async function POST(request) {
  try {
    const { userId } = await request.json();
    console.log(userId);

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const url =
      "https://www.instagram.com/api/v1/users/web_profile_info/";

    // Get user ID first
    const response = await fetch(
      `${url}?${new URLSearchParams({
        username: userId,
      })}`,
      {
        headers: {
          "x-ig-app-id": "936619743392459",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`);
    }
    console.log(response.text)
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
