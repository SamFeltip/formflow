import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { Navbar } from "@/components/layout/navbar";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Formflow",
  description:
    "Build, share, and manage forms with approval workflows and timelines",
};

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextThemesProvider
          attribute="class"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar user={user} />
            <main className="flex-1 py-6 md:py-10">
              <div className="container px-4 mx-auto max-w-7xl">{children}</div>
            </main>
            <footer className="border-t py-6">
              <div className="container px-4 mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">FormFlow</span>
                    <span className="text-sm text-muted-foreground">
                      © {new Date().getFullYear()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Form building and approval workflow management
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </NextThemesProvider>
      </body>
    </html>
  );
}
