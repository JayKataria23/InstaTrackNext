"use client";

import { useSearchParams } from "next/navigation";
import AnimatedBackground from "@/components/animated-background";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Post {
  post_id: string;
  type: string;
  likes_count: number;
  comments_count: number;
  description: string;
  date_time: number;
  media_url: string;
  top_comments: string[];
  views_count: number;
}

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const username = searchParams ? searchParams.get("username") : null;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [posts, setPosts] = useState<Post[]>([]);

  const fetchData = async (username: string) => {
    const response = await fetch("/api/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: username }),
    });
    const data = await response.json();
    console.log(data);
    setPosts(data);
  };

  useEffect(() => {
    setIsLoading(true);
    if (username) {
      fetchData(username as string);
    }
    setIsLoading(false);
  }, [username]);

  return (
    <div className="min-h-screen bg-black text-white relative">
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="text-white hover:text-primary mb-8"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-block bg-primary/10 text-primary font-bold py-1 px-4 rounded-full animate-pulse">
              Analysis in Progress
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Analyzing Profile:{" "}
              <span className="text-primary">@{username || "Unknown"}</span>
            </h1>
            {isLoading && (
              <p className="text-xl text-gray-400 max-w-2xl">
                We&apos;re gathering insights and analyzing the Instagram
                profile data. This process helps us provide you with
                comprehensive analytics and actionable insights.
              </p>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-black">
              <thead>
                <tr>
                  <th className="py-2">Post ID</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Likes Count</th>
                  <th className="py-2">Comments Count</th>
                  <th className="py-2">Description</th>
                  <th className="py-2">Date Time</th>
                  <th className="py-2">Top Comments</th>
                  <th className="py-2">Views Count</th>
                  <th className="py-2">Media URL</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.post_id}>
                    <td className="py-2">{post.post_id}</td>
                    <td className="py-2">{post.type}</td>
                    <td className="py-2">{post.likes_count}</td>
                    <td className="py-2">{post.comments_count}</td>
                    <td className="py-2">{post.description}</td>
                    <td className="py-2">
                      {new Date(post.date_time * 1000).toLocaleString()}
                    </td>
                    <td className="py-2">{post.top_comments.join(", ")}</td>
                    <td className="py-2">{post.views_count}</td>
                    <td className="py-2">
                      <a
                        href={post.media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Media
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
