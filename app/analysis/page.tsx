"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { ArrowLeft, Download, Filter, ImageIcon, Loader2 } from "lucide-react";

import AnimatedBackground from "@/components/animated-background";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";

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
  const username = searchParams?.get("username") ?? null;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/scrape", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: username }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const filteredPosts =
    selectedType === "all"
      ? posts
      : posts.filter((post) => post.type === selectedType);

  const uniqueTypes = [
    "all",
    ...Array.from(new Set(posts.map((post) => post.type))),
  ];

  const handleDownloadExcel = () => {
    if (!username || !filteredPosts.length) return;

    const worksheet = XLSX.utils.json_to_sheet(filteredPosts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Posts");
    XLSX.writeFile(workbook, `${username}-instagram-data.xlsx`);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const MediaPreview = ({ url, type }: { url: string; type: string }) => {
    const [isImageError, setIsImageError] = useState(false);

    return (
      <div className="relative w-[300px] h-[300px] bg-black/50 rounded-lg overflow-hidden">
        {isImageError ? (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            <ImageIcon className="w-8 h-8" />
            <span className="ml-2">Media not available</span>
          </div>
        ) : (
          <Image
            src={url}
            alt={`${type} preview`}
            fill
            className="object-cover"
            onError={() => setIsImageError(true)}
          />
        )}
      </div>
    );
  };

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
          <Card className="bg-black/50 border-white/10">
            <CardHeader>
              <div className="inline-block bg-primary/10 text-primary font-bold py-1 px-4 rounded-full animate-pulse w-fit">
                Analysis Dashboard
              </div>
              <CardTitle className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                @{username ?? "Unknown"}
              </CardTitle>
              {isLoading && (
                <CardDescription className="text-xl text-gray-400">
                  We&apos;re gathering insights and analyzing the Instagram
                  profile data...
                </CardDescription>
              )}
              {error && (
                <CardDescription className="text-xl text-red-400">
                  Error: {error}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select post type" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/10">
                      {uniqueTypes.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="text-white hover:bg-white/10"
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleDownloadExcel}
                  className="bg-primary hover:bg-primary/90"
                  disabled={isLoading || !filteredPosts.length}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Excel
                </Button>
              </div>

              <div className="rounded-lg border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-white/5 text-white">
                      <TableRow>
                        <TableHead className="text-white">Post ID</TableHead>
                        <TableHead className="text-white">Type</TableHead>
                        <TableHead className="text-white text-right">
                          Likes
                        </TableHead>
                        <TableHead className="text-white text-right">
                          Comments
                        </TableHead>
                        <TableHead className="text-white">
                          Description
                        </TableHead>
                        <TableHead className="text-white">Date</TableHead>
                        <TableHead className="text-white">
                          Top Comments
                        </TableHead>
                        <TableHead className="text-white text-right">
                          Views
                        </TableHead>
                        <TableHead className="text-white">Media</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-white">
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8">
                            <div className="flex items-center justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                              Loading data...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredPosts.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className="text-center py-8 text-gray-400"
                          >
                            No posts found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPosts.map((post) => (
                          <TableRow
                            key={post.post_id}
                            className="hover:bg-white/5"
                          >
                            <TableCell className="font-mono">
                              {post.post_id}
                            </TableCell>
                            <TableCell className="capitalize">
                              {post.type}
                            </TableCell>
                            <TableCell className="text-right">
                              {post.likes_count.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {post.comments_count.toLocaleString()}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {post.description}
                            </TableCell>
                            <TableCell>{formatDate(post.date_time)}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {post.top_comments.join(", ")}
                            </TableCell>
                            <TableCell className="text-right">
                              {post.views_count > 0
                                ? post.views_count.toLocaleString()
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-primary hover:text-primary/90"
                                  >
                                    <ImageIcon className="h-4 w-4" />
                                  </Button>
                                </HoverCardTrigger>
                                <HoverCardContent
                                  className="w-auto p-0 bg-black/90 border-white/10"
                                  side="left"
                                >
                                  <MediaPreview
                                    url={post.media_url}
                                    type={post.type}
                                  />
                                </HoverCardContent>
                              </HoverCard>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
