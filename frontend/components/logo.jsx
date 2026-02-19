"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Logo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // prevents hydration mismatch

  const logoSrc =
    resolvedTheme === "dark"
      ? "/logo-light.png"
      : "/logo-dark.png";

  return (
    <Image
      src={logoSrc}
      alt="Fixora Logo"
      width={180}
      height={60}
      priority
    />
  );
}
