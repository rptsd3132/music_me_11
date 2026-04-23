import type { Metadata } from "next";
import {Figtree} from "next/font/google";
import  Sidebar from "../components/sidebar";
import "./globals.css";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProider";
import getSongsByUserId from "@/actions/getSongByUserId";
import Player from "@/components/Player";

const font = Figtree({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "music me",
  description: "A music streaming app built with Next.js and Tailwind CSS.",
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const userSongs = await getSongsByUserId();


  return (
    <html
      lang="en"
    >
      <body className={`${font.className} h-full antialiased`}>
        <ToasterProvider/>
        <SupabaseProvider>
          <UserProvider>
              <ModalProvider/>
              
                  <Sidebar songs={userSongs}>
                  {children}
                  </Sidebar>
                  <Player />
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
