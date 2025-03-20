"use client"
import NavbarWrapper from "@/components/server/navbar-wrapper";
import FooterWrapper from "@/components/server/footer-wrapper";
import ClientProvider from "@/components/client/ClientProvider";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import "./globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin"); // ตรวจสอบว่าอยู่ใน `/admin`

  return (
    <html lang="en">
      <UserProvider>
        <body>
          <ClientProvider>
            {!isAdmin && <NavbarWrapper />}
            <main>{children}</main>
            {!isAdmin && <FooterWrapper />}
          </ClientProvider>
        </body>
      </UserProvider>
    </html>
  );
}
