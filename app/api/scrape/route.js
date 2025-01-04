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
    const base = "https://www.instagram.com";

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

    const obj = await response.json();
    const userIdJson = obj.data.user.id;

    // Fetch posts
    const urlQuery = `${base}/graphql/query/`;
    const variables = {
      id: userIdJson,
      first: 50,
    };

    const postResponse = await fetch(
      `${urlQuery}?${new URLSearchParams({
        query_hash: "bd0d6d184eefd4d0ce7036c11ae58ed9",
        variables: JSON.stringify(variables),
      })}`
    );

    if (!postResponse.ok) {
      throw new Error(`Instagram GraphQL API error: ${postResponse.status}`);
    }

    const postData = await postResponse.json();
    const profileData =
      postData.data.user.edge_owner_to_timeline_media.edges.map(({ node }) => ({
        post_id: node.id,
        type: node.__typename,
        likes_count: node.edge_media_preview_like.count,
        comments_count: node.edge_media_to_comment.count,
        top_comments: node.edge_media_to_comment.edges
          .slice(0, 3)
          .map((comment) => comment.node.text),
        description:
          node.edge_media_to_caption.edges.length > 0
            ? node.edge_media_to_caption.edges[0].node.text
            : "",
        date_time: node.taken_at_timestamp,
        media_url: node.display_url,
        views_count:
          node.__typename === "GraphVideo" ? node.video_view_count || 0 : 0,
      }));

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
