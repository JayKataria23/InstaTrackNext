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

    // Initialize variables for pagination
    let hasNextPage = true;
    let endCursor = null;
    let allPosts = [];
    const POST_LIMIT = 200;
    const POSTS_PER_REQUEST = 50;

    // Fetch posts with pagination
    while (hasNextPage && allPosts.length < POST_LIMIT) {
      const variables = {
        id: userIdJson,
        first: POSTS_PER_REQUEST,
        after: endCursor,
      };

      const urlQuery = `${base}/graphql/query/`;
      const postResponse = await fetch(
        `${urlQuery}?${new URLSearchParams({
          query_hash: "bd0d6d184eefd4d0ce7036c11ae58ed9",
          variables: JSON.stringify(variables),
        })}`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            Accept: "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
          },
        }
      );

      if (!postResponse.ok) {
        throw new Error(`Instagram GraphQL API error: ${postResponse.status}`);
      }

      const postData = await postResponse.json();
      const pageInfo =
        postData.data.user.edge_owner_to_timeline_media.page_info;
      const edges = postData.data.user.edge_owner_to_timeline_media.edges;

      // Transform and add posts to our collection
      const transformedPosts = edges.map(({ node }) => ({
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

      allPosts = [...allPosts, ...transformedPosts];

      // Update pagination variables
      hasNextPage = pageInfo.has_next_page;
      endCursor = pageInfo.end_cursor;

      // Add a small delay between requests to avoid rate limiting
      if (hasNextPage && allPosts.length < POST_LIMIT) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json(allPosts);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
