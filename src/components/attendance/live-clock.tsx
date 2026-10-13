"use client";

import { useEffect, useState } from "react";

export function LiveClock() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return <div className="h-14 animate-pulse bg-muted rounded-md" />;
  }

  return (
    <div className="flex flex-col">
      <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        {time}
      </span>
      <span className="text-xs text-muted-foreground mt-0.5">{date}</span>
    </div>
  );
}
