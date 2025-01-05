"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2, Github, Linkedin } from "lucide-react";
import Image from "next/image";
import { TeamMember, Feature, TypingConfig } from "@/types";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import ss from ".//ss.png";

const TYPING_CONFIG: TypingConfig = {
  speed: 150,
  deleteSpeed: 100,
  pauseDuration: 1000,
  words: ["Better", "Smarter", "Deeper"],
};

const FEATURES: Feature[] = [
  {
    title: "Track Competitors",
    description: "Create lists and keep track of your competitors' profiles",
  },
  {
    title: "Compare Insights",
    description: "Quickly compare profiles' insights over time",
  },
  {
    title: "Organize Lists",
    description: "Assign each list to a specific profile",
  },
];

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Jay Kataria",
    role: "Full Stack Developer",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQHWvMcBiAqVag/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1680287478048?e=1741824000&v=beta&t=rUOFFtmxCpWZwnN7QQGq2FoVlBSKQ5zbc84WWDSTzuQ",
    github: "https://github.com/JayKataria23",
    linkedin: "https://www.linkedin.com/in/jay-kataria-209929183/",
  },
  {
    name: "Isha Singla",
    role: "Data Analytics",
    image:
      "https://media.licdn.com/dms/image/v2/D5603AQEMA668YQ0Jmg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1677759147526?e=1741824000&v=beta&t=viYRNkQCaCNtZtcv2SUwqnDzJwr0-HtVnCNnFQ6_P8s",
    github: "https://github.com/courseraisha",
    linkedin: "https://www.linkedin.com/in/isha-singla16/",
  },
];

export default function Page(): JSX.Element {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [username, setUsername] = useState(""); // Added username state

  const router = useRouter();

  const handleAnalyze = async (): Promise<void> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    router.push(`/analysis?username=${encodeURIComponent(username)}`); // Updated handleAnalyze function
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const updateText = () => {
      const currentWord = TYPING_CONFIG.words[wordIndex];

      if (!isDeleting && displayText === currentWord) {
        timeout = setTimeout(
          () => setIsDeleting(true),
          TYPING_CONFIG.pauseDuration
        );
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % TYPING_CONFIG.words.length);
      } else {
        const nextText = isDeleting
          ? displayText.slice(0, -1)
          : currentWord.slice(0, displayText.length + 1);

        timeout = setTimeout(
          () => setDisplayText(nextText),
          isDeleting ? TYPING_CONFIG.deleteSpeed : TYPING_CONFIG.speed
        );
      }
    };

    updateText();
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex]);

  return (
    <main className="flex-1">
      <Navbar />
      <section
        id="get-started"
        className="relative min-h-screen flex items-center py-20 md:py-28 lg:py-32"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
        <div className="container relative px-8 md:px-16 mx-auto">
          <div className="grid gap-8 lg:grid-cols-[1fr_600px] lg:gap-16 xl:grid-cols-[1fr_800px]">
            <div className="flex flex-col justify-center space-y-8 w-full">
              <div className="flex flex-col space-y-8 w-full max-w-[600px] mx-auto lg:mx-0">
                <div className="inline-block self-start bg-primary/10 text-primary font-bold py-2 px-6 rounded-full animate-pulse">
                  AI Powered
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-black tracking-tighter sm:text-6xl xl:text-7xl text-white">
                    Track Smarter,{" "}
                    <span className="inline-block">
                      Engage{" "}
                      <span className="font-black relative">
                        <span className="opacity-0">Better</span>
                        <span
                          className="absolute left-0 border-r-2 border-primary text-primary"
                          style={{ width: "max-content" }}
                        >
                          {displayText}
                        </span>
                      </span>
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-300">
                    Your go-to Instagram analysis tool
                  </p>
                </div>
                <div className="w-full max-w-md space-y-4">
                  <Input
                    placeholder="@username"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                  />
                  <Button
                    className="w-full h-12 bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                    onClick={handleAnalyze}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Analyze Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center mb-20">
              <Image
                src={ss}
                alt="Description of the image"
                width={900}
                height={800}
                className="object-contain border-8 border-white rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="w-full py-16 md:py-24 lg:py-32 relative"
      >
        <div className="container px-4 md:px-6 mx-auto">
          <div className="space-y-16">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Analyze and verify any Instagram profile
              </h2>
              <p className="text-lg text-gray-300 max-w-xl mx-auto">
                Powerful tools to help you understand and grow your Instagram
                presence
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 justify-around">
              {FEATURES.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm p-8 rounded-xl transition-all duration-300 hover:bg-white/10 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed group-hover:text-white transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="w-full py-16 md:py-28 lg:py-32 relative">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="space-y-16">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Meet Our Team
              </h2>
              <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
                We are a group of passionate individuals dedicated to helping
                you understand and grow your Instagram presence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto px-4">
              {TEAM_MEMBERS.map((member) => (
                <div
                  key={member.name}
                  className="group bg-white/5 backdrop-blur-sm rounded-xl p-8 transition-all duration-300 hover:bg-white/10 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <div className="flex flex-col items-center space-y-6">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={128}
                        height={128}
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="text-center space-y-3">
                      <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-lg text-gray-400 group-hover:text-gray-300 transition-colors">
                        {member.role}
                      </p>
                    </div>
                    <div className="flex space-x-6">
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary transition-colors"
                      >
                        <Github className="h-6 w-6" />
                        <span className="sr-only">GitHub</span>
                      </a>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary transition-colors"
                      >
                        <Linkedin className="h-6 w-6" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-28 lg:py-32 relative">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-12 text-center">
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
                Ready to grow your Instagram?
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                Join thousands of creators and businesses using InstaTrack to
                optimize their Instagram strategy
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Button
                className="h-12 px-8 bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 text-lg font-medium"
                disabled={isLoading}
                onClick={() =>
                  document
                    .getElementById("get-started")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Get Started Free"
                )}
              </Button>
              <Button
                variant="outline"
                className="h-12 px-8 border-white/20 text-black hover:bg-white/10 hover:text-white transition-all duration-300 transform hover:scale-105 text-lg font-medium"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
