"use client";

import { cn } from "@/lib/utils";

function Skeleton({}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent w-48 h-48 rounded-lg"
      )}
    >
      <span className="w-full h-full flex justify-center items-center text-center">
        ...
      </span>
    </div>
  );
}

export { Skeleton };
