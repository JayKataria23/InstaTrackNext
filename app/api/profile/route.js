import { NextResponse } from "next/server";
import fetch from "node-fetch";

export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const url = "https://i.instagram.com/api/v1/users/web_profile_info";

    const response = await fetch(
      `${url}?${new URLSearchParams({
        username: userId,
      })}`,
      {
        headers: {
          "x-ig-app-id": "936619743392459",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`);
    }

    const data = await response.json();
    const user = data.data.user;

    // Extract only the requested profile information
    const profileData = {
      profile_pic_url: user.profile_pic_url_hd || user.profile_pic_url,
      followers_count: user.edge_followed_by.count,
      following_count: user.edge_follow.count,
      posts_count: user.edge_owner_to_timeline_media.count,
      biography: user.biography,
      is_private: user.is_private,
      is_verified: user.is_verified,
    };
    console.log(profileData);
    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
