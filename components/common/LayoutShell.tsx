"use client";

import { usePathname } from "next/navigation";

import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { ChatWidget } from "@/components/common/ChatWidget";

interface LayoutShellProps {
  children: React.ReactNode;
  name: string;
  github: string;
  email: string;
}

export function LayoutShell({ children, name, github, email }: LayoutShellProps) {
  const pathname = usePathname();
  const isWishket = pathname.startsWith("/wishket");

  if (isWishket) {
    return (
      <>
        {children}
        <ChatWidget />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer name={name} github={github} email={email} />
      <ScrollToTop />
      <ChatWidget />
    </>
  );
}
