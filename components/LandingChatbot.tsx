"use client";

import dynamic from "next/dynamic";

const ClientChatbot = dynamic(() => import("@/components/ClientChatbot"), { ssr: false });

export default function LandingChatbot() {
  return (
    <ClientChatbot />
  );
}
