"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  ArrowLeft,
  Download,
  Filter,
  ImageIcon,
  Loader2,
  Eye,
  EyeOff,
  BadgeCheck,
} from "lucide-react";
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
import { useRouter } from "next/navigation";
import { LineChart, PieChart } from "lucide-react"; // Add these
import { Input } from "@/components/ui/input"; // Add this
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  Pie,
  Cell,
  BarChart as BChart
} from "recharts";

interface ProfileData {
  profile_pic_url: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  biography: string;
  is_private: boolean;
  is_verified: boolean;
}

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
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10; // Number of posts to display per page
  const [isChartsVisible, setIsChartsVisible] = useState(true);
  const [query, setQuery] = useState("");
  const [insights, setInsights] = useState<{ [key: string]: string }>({
    engagement: "",
    postTypes: "",
    timing: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
      const usernameFromParams = params.get("username");

      if (!usernameFromParams) {
        setIsLoading(false);
        setError("No username provided");
        return;
      }

      setUsername(usernameFromParams);
      setIsLoading(true);
      setError(null);

      try {
        // Fetch both data and profile in parallel
        const [dataResponse, profileResponse] = await Promise.all([
          fetch(`/api/data?username=${usernameFromParams}`),
          fetch(`/api/profile?username=${usernameFromParams}`),
        ]);

        // Check for errors
        if (!dataResponse.ok) {
          throw new Error(`Data API error! status: ${dataResponse.status}`);
        }
        if (!profileResponse.ok) {
          throw new Error(
            `Profile API error! status: ${profileResponse.status}`
          );
        }

        // Parse responses
        const [postsData, profileData] = await Promise.all([
          dataResponse.json(),
          profileResponse.json(),
        ]);

        setPosts(postsData.posts);
        setProfileData(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Calculate the index of the last post on the current page
  const indexOfLastPost = currentPage * postsPerPage;
  // Calculate the index of the first post on the current page
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // Get the current posts
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Calculate total pages
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Function to handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen text-white relative ">
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-8 ">
        <Button
          variant="ghost"
          className="text-white hover:text-primary mb-8"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="relative z-10 space-y-8 ">
          <Card className="bg-black/50 border-white/10 ">
            <CardHeader>
              <div className="inline-block bg-primary/10 text-primary font-bold py-1 px-4 rounded-full animate-pulse w-fit">
                Analysis Dashboard
              </div>
              <CardTitle className="text-4xl md:text-6xl font-bold tracking-tighter text-white ">
                {profileData && (
                  <Image
                    src={profileData.profile_pic_url}
                    alt={`${username}'s profile`}
                    className="w-16 h-16 rounded-full mr-4 inline-block align-middle border-2 border-primary"
                    width={60}
                    height={60}
                  />
                )}
                @{username ?? "Unknown"}
                {profileData && (
                  <>
                    {profileData.is_verified && (
                      <span
                        className="text-blue-500 ml-2"
                        title="Verified Account"
                      >
                        <BadgeCheck className="inline w-16 h-16" />
                      </span>
                    )}
                  </>
                )}
              </CardTitle>
              <div className="h-4"></div>
              {isLoading && (
                <CardDescription className="text-xl text-gray-400">
                  We&apos;re gathering insights and analyzing the Instagram
                  profile data...
                </CardDescription>
              )}
              {!isLoading && profileData && (
                <>
                  <CardDescription className="text-xl text-gray-400">
                    {posts.length} post(s) loaded...
                  </CardDescription>
                  <div className="flex items-center mt-4">
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        {profileData.biography}
                      </h2>
                      <p className="text-gray-400">
                        Followers: {profileData.followers_count} | Following:{" "}
                        {profileData.following_count} | Posts:{" "}
                        {profileData.posts_count}
                      </p>
                    </div>
                  </div>
                </>
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
                          {type.startsWith("Graph")
                            ? type.slice(5).trim()
                            : type.charAt(0).toUpperCase() + type.slice(1)}
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
                <Button
                  onClick={() => setIsTableVisible(!isTableVisible)}
                  variant="outline"
                  className="border-white/20 text-white bg-black hover:bg-white/10 hover:text-white"
                >
                  {isTableVisible ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide Table
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Show Table
                    </>
                  )}
                </Button>
              </div>

              <div
                className={`rounded-lg border border-white/10 overflow-hidden transition-all duration-300 ${
                  isTableVisible ? "max-h-screen" : "max-h-0 overflow-hidden"
                }`}
              >
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
                              Loading data, can take a couple of minutes...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : currentPosts.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className="text-center py-8 text-gray-400"
                          >
                            No posts found
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentPosts.map((post) => (
                          <TableRow
                            key={post.post_id}
                            className="hover:bg-white/5"
                          >
                            <TableCell className="font-mono">
                              {post.post_id}
                            </TableCell>
                            <TableCell className="capitalize">
                              {post.type.startsWith("Graph")
                                ? post.type.slice(5).trim()
                                : post.type}
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
                              {post.top_comments}
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
                <div className={`flex justify-between mt-4 `}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-primary text-white px-4 py-2 rounded"
                  >
                    Previous
                  </button>
                  <span className="text-white">
                    Page {currentPage} of {totalPages} | Showing{" "}
                    {indexOfFirstPost + 1} -{" "}
                    {Math.min(indexOfLastPost, filteredPosts.length)} of{" "}
                    {filteredPosts.length} posts
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-primary text-white px-4 py-2 rounded"
                  >
                    Next
                  </button>
                </div>
              </div>
              {/* Data Visualization Section */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-primary" />
                    <h2 className="text-xl font-bold">Data Visualization</h2>
                  </div>
                  <Button
                    onClick={() => setIsChartsVisible(!isChartsVisible)}
                    variant="outline"
                    className="border-white/20 text-white bg-black hover:bg-white/10"
                  >
                    {isChartsVisible ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Hide Charts
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Show Charts
                      </>
                    )}
                  </Button>
                </div>

                {/* Query Input */}
                <div className="mb-6">
                  <Input
                    placeholder="Ask a question about the data..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                {/* Charts Section */}
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 ${
                    isChartsVisible ? "block" : "hidden"
                  }`}
                >
                  {/* Engagement Over Time Chart */}
                  <Card className="bg-black/50 border-white/10">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          Engagement Over Time
                        </CardTitle>
                        <Button
                          onClick={() => {
                            // Add your insight generation logic here
                            setInsights({
                              ...insights,
                              engagement: "Analyzing engagement patterns...",
                            });
                          }}
                          size="sm"
                          className="bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          Generate Insights
                        </Button>
                      </div>
                      {insights.engagement && (
                        <CardDescription className="text-sm mt-2">
                          {insights.engagement}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={posts.map((post) => ({
                            date: new Date(
                              post.date_time * 1000
                            ).toLocaleDateString(),
                            engagement: post.likes_count + post.comments_count,
                          }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="date" stroke="#fff" />
                          <YAxis stroke="#fff" />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="engagement"
                            stroke="#8B5CF6"
                            fill="#8B5CF6"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Post Types Distribution */}
                  <Card className="bg-black/50 border-white/10">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          Content Distribution
                        </CardTitle>
                        <Button
                          onClick={() => {
                            setInsights({
                              ...insights,
                              postTypes: "Analyzing content patterns...",
                            });
                          }}
                          size="sm"
                          className="bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          Generate Insights
                        </Button>
                      </div>
                      {insights.postTypes && (
                        <CardDescription className="text-sm mt-2">
                          {insights.postTypes}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={Array.from(
                              posts.reduce((acc, post) => {
                                const type = post.type.startsWith("Graph")
                                  ? post.type.slice(5).trim()
                                  : post.type;
                                acc.set(type, (acc.get(type) || 0) + 1);
                                return acc;
                              }, new Map()),
                              ([name, value]) => ({ name, value })
                            )}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8B5CF6"
                          >
                            {posts.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={`hsl(${
                                  (index * 360) / posts.length
                                }, 70%, 50%)`}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Performance Metrics */}
                  <Card className="bg-black/50 border-white/10">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          Performance Metrics
                        </CardTitle>
                        <Button
                          onClick={() => {
                            setInsights({
                              ...insights,
                              timing: "Analyzing performance metrics...",
                            });
                          }}
                          size="sm"
                          className="bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          Generate Insights
                        </Button>
                      </div>
                      {insights.timing && (
                        <CardDescription className="text-sm mt-2">
                          {insights.timing}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BChart
                          data={posts.slice(-10).map((post) => ({
                            id: post.post_id,
                            likes: post.likes_count,
                            comments: post.comments_count,
                            views: post.views_count,
                          }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="id" stroke="#fff" />
                          <YAxis stroke="#fff" />
                          <Tooltip />
                          <Bar dataKey="likes" fill="#8B5CF6" />
                          <Bar dataKey="comments" fill="#EC4899" />
                          <Bar dataKey="views" fill="#10B981" />
                        </BChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
