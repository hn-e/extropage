"use client";

import { Badge } from "@/once-ui/components";
import { useEffect, useState } from "react";

interface StoreBadgeProps {
  title: string;
  icon?: string; // optional icon name
  children?: React.ReactNode;
  effect?: boolean;
}

export default function StoreBadge({
  title,
  icon,
  children,
  effect = true,
}: StoreBadgeProps) {
  const [storeLink, setStoreLink] = useState<string>("");

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isAppleDevice = /iPhone|iPad|iPod|Macintosh/.test(userAgent);

    const appStoreLink = "https://apps.apple.com/us/app/extrowurts/id6746046462";
    const playStoreLink = "https://play.google.com/store/apps/details?id=com.pro.nubpack";

    setStoreLink(isAppleDevice ? appStoreLink : playStoreLink);
  }, []);

  if (!storeLink) return null; // or a loading state if you want

  return (
    <Badge
      title={title}
      icon={icon as any}
      effect={effect}
      href={storeLink}
      arrow={false} // optional, your call
    >
      {children}
    </Badge>
  );
}
