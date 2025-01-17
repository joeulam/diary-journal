import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calico",
  description: "A cute cat themed fiscal tracker",
};

// app/layout.jsx
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { LayoutProps } from "@/.next/types/app/layout";


export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
    <UserProvider>
      <body>{children}</body>
    </UserProvider>
    </html>
  );
}
