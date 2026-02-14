"use client";

import { useEffect } from "react";

export default function ForceLightMode() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return null;
}
