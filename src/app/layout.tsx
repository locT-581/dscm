import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Web3Provider from "@/layouts/Web3Provider";
import { Web3StoreProvider } from "@/stores/storeProvider";
import DefaultLayout from "@/layouts/DefaultLayout";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.min.css";
import AuthLayout from "@/layouts/AuthLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Quản lý chuỗi cung ứng bền vững phi tập trung",
  description: "Quản lý chuỗi cung ứng bền vững phi tập trung",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          color: "#023047",
        }}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer />
        <Web3StoreProvider>
          <Web3Provider>
            <AuthLayout>
              <DefaultLayout>{children}</DefaultLayout>
            </AuthLayout>
          </Web3Provider>
        </Web3StoreProvider>
      </body>
    </html>
  );
}
