"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Volume2, VolumeX, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";

//! Mock API call
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockApiCall = (query: string) =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          audioUrl: "https://example.com/audio.mp3",
          images: Array(7)
            .fill(null)
            .map((_, i) => `https://picsum.photos/400/300?random=${i}`),
        }),
      1000
    )
  );

//! Final API Call:

export default function Home() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { theme, setTheme } = useTheme();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await mockApiCall(query);
      setAudioUrl(result.audioUrl);
      setImages(result.images);
      setCurrentImageIndex(0);
      if (audioRef.current) {
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Implement error handling here
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-black/75 dark:to-black/75 flex flex-col items-center justify-center p-4 transition-colors duration-200">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white/80 dark:bg-black/25 dark:border dark:border-white/75 backdrop-blur-sm shadow-xl rounded-xl">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Music & Images
          </h1>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
        <form onSubmit={handleSearch} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Search for music..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>
        {audioUrl && (
          <div className="flex items-center space-x-2">
            <audio ref={audioRef} src={audioUrl} className="w-full" controls />
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </Card>

      {images.length > 0 ? (
        <div className="mt-8 flex flex-row flex-wrap gap-4 justify-center items-center">
          {images.map((image, index) => (
            <Card
              key={index}
              className={`overflow-hidden transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-lg hover:brightness-100 ${
                index === currentImageIndex ? "brightness-75" : "brightness-90"
              }`}
            >
              <CardContent className="p-0">
                <img
                  src={image}
                  alt={`Related to ${query}`}
                  className="w-full h-48 object-cover"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <></>
      )}

      {isLoading && (
        <div className="mt-8 flex flex-row flex-wrap gap-4 justify-center items-center">
          {Array(7)
            .fill(null)
            .map((_, index) => (
              <Skeleton key={index} />
            ))}
        </div>
      )}
    </div>
  );
}
