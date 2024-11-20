import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// import { ThemeProvider } from "@/components/providers/theme-provider";
import Navbar from "@/components/shared/Navbar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import UserProvider from "@/components/providers/context-provider";

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
  title: "Idealy",
  description: "App For Startup Ideas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased sm:w-[96%] w-full flex flex-col items-center mx-auto max-w-screen-2xl  h-full bg-[#f8f4f9]  text-[#1d1e18ff]`}
      >
        {/* <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          > */}
        <UserProvider>
          <Navbar />
          {children}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </UserProvider>

        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
