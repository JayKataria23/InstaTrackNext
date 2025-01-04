"use client";

import { useSearchParams } from "next/navigation";
import AnimatedBackground from "@/components/animated-background";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const username = searchParams ? searchParams.get("username") : null;
  const router = useRouter();

  const handleClick = async (username: string) => {
    const a = await fetch("/api/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    console.log(await a.json());
  };

  

  useEffect(() => {
    handleClick(username as string);
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
            <p className="text-xl text-gray-400 max-w-2xl">
              We&apos;re gathering insights and analyzing the Instagram profile
              data. This process helps us provide you with comprehensive
              analytics and actionable insights.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Profile Overview</h3>
              <p className="text-gray-400">
                Comprehensive analysis of profile metrics and performance
                indicators.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Engagement Analysis</h3>
              <p className="text-gray-400">
                Deep dive into engagement rates and audience interaction
                patterns.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Growth Insights</h3>
              <p className="text-gray-400">
                Detailed examination of profile growth and development
                opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
