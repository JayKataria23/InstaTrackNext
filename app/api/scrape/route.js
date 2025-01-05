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

    const response = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${userId}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
          "x-ig-app-id": "936619743392459",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Response text:", errorText);
      throw new Error(`Instagram API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Transform posts to match the original format
    const transformedPosts =
      data.data.user.edge_owner_to_timeline_media.edges.map(({ node }) => ({
        post_id: node.id,
        type: node.__typename,
        likes_count:
          node.edge_liked_by?.count || node.edge_media_preview_like?.count || 0,
        comments_count: node.edge_media_to_comment?.count || 0,
        top_comments: (node.edge_media_to_comment?.edges || [])
          .slice(0, 3)
          .map((comment) => comment.node.text),
        description: node.edge_media_to_caption?.edges[0]?.node?.text || "",
        date_time: node.taken_at_timestamp,
        media_url: node.display_url,
        views_count:
          node.__typename === "GraphVideo" ? node.video_view_count || 0 : 0,
      }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
