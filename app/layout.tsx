import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VTU Platform",
  description: "Virtual Top-Up Platform powered by Inlomax",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
