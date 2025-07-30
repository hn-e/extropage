"use client";

import { Badge } from "@/once-ui/components";
import { useEffect, useCallback } from "react";

interface StoreBadgeProps {
  title: string;
  icon?: string;
  children?: React.ReactNode;
  effect?: boolean;
}

export default function StoreBadge({
  title,
  icon,
  children,
  effect = true,
}: StoreBadgeProps) {

    const appStoreLink = "https://apps.apple.com/us/app/extrowurts/id6746046462";
    const playStoreLink = "https://play.google.com/store/apps/details?id=com.pro.nubpack";

    const deeplink = "extrowurts://";

  const handleClick = useCallback(() => {
    const userAgent = navigator.userAgent;
    const isAppleDevice = /iPhone|iPad|iPod|Macintosh/.test(userAgent);
    const storeLink = isAppleDevice ? appStoreLink : playStoreLink;

    window.location.href = deeplink;

    setTimeout(() => {
      window.location.href = storeLink;
    }, 2000);
  }, []);

  return (
    <Badge
      title={title}
      icon={icon as any}
      effect={effect}
      arrow={false}
      onClick={handleClick}
    >
      {children}
    </Badge>
  );
}
