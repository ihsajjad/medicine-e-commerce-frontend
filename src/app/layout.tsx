import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import ReduxProvider from "@/components/ReduxProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        <div className="min-h-screen">
          <ReduxProvider> {children}</ReduxProvider>
        </div>
        <Footer />
      </body>
    </html>
  );
}
