import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/layout/NavBar";
import Container from "@/components/layout/Container";
import SocketProvider from "@/providers/SocketProvider";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";


const inter = Inter({
  variable: "--font-inter", // Define custom variable for Inter font
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VidChat",
  description: "Video calling application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon1.ico" />
        </head>
        <body className={cn(inter.className, "relative")}>
          <SocketProvider>
            <main className="flex flex-col min-h-screen bg-secondary">
              <NavBar></NavBar>

              <Container>{children}</Container>
              <Footer />
            </main>
          </SocketProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
