import { Inter } from "next/font/google";
import ".//globals.css";
import { ScrollToTop } from "@/components/scroll-to-top";
import AnimatedBackground from "@/components/animated-background";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "InstaTrack - Track Smarter, Engage Better",
  description:
    "Your go-to Instagram analysis tool for content creators, influencers, and businesses.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AnimatedBackground />
        <ScrollToTop />
        <div className="flex min-h-screen flex-col relative">{children}</div>
      </body>
    </html>
  );
}
