import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { RoleProvider } from "@/lib/auth-context";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "Fixora - Book Trusted Local Repairs",
  description:
    "Fixora connects you with trusted local service professionals for plumbing, electrical, AC repair, and more. Book in minutes.",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-sans antialiased">
          <RoleProvider>
            {children}
            <Toaster richColors position="top-right" />
          </RoleProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
