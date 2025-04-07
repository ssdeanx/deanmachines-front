import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { NavBar } from "@/components/layout/NavBar";

export const metadata: Metadata = {
  title: "Mastra AI - Build Intelligent AI Agents",
  description: "Create, deploy, and scale AI agents with our powerful platform.",
  metadataBase: new URL("https://mastra.ai"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html lang="en" suppressHydrationWarning className={GeistSans.variable}>
  <body className="min-h-screen font-sans antialiased">
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="relative flex min-h-screen flex-col">
        <NavBar />
        <main className="flex-1">{children}</main>
      </div>
      <Footer /> {/* Added Footer component */}
      <Toaster />
    </ThemeProvider>
  </body>
    </html>
  );
}
