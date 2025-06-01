// app/providers/SessionProviderWrapper.jsx
"use client"; // ← important to mark it as Client Component

import { SessionProvider } from "next-auth/react";

import { ReactNode } from "react";

export default function SessionProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
