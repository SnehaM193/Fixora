import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { RoleProvider } from "@/lib/role-context";
import "./globals.css";

export const metadata = {
  title: "Fixora",
  description: "Book trusted local repair services",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen bg-background text-foreground antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <RoleProvider>
              {children}
              <Toaster position="top-right" richColors />
            </RoleProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
