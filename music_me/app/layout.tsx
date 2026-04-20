import type { Metadata } from "next";
import {Figtree} from "next/font/google";
import  Sidebar from "../components/sidebar";
import "./globals.css";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProider";

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
    >
      <body className={`${font.className} h-full antialiased`}>
        <SupabaseProvider>
          <UserProvider>
              <ModalProvider/>
              <ToasterProvider/>
                  <Sidebar>
                  {children}
                  </Sidebar>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
