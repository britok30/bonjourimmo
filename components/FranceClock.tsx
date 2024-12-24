"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import moment from "moment-timezone";

export default function FranceClock() {
  const [time, setTime] = useState(moment().tz("Europe/Paris"));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(moment().tz("Europe/Paris"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <time dateTime={time.format()}>{time.format("HH:mm")}</time>
    </div>
  );
}
