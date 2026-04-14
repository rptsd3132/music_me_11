import type { Metadata } from "next";
import {Figtree} from "next/font/google";
import  Sidebar from "../components/sidebar";
import "./globals.css";

const font = Figtree({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "music me",
  description: "A music streaming app built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${font.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Sidebar>
          {children}
        </Sidebar>
      </body>
    </html>
  );
}
