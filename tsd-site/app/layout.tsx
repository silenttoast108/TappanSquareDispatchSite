import type { Metadata } from "next";
import { Epilogue, Oleo_Script } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import BackButton from "@/components/backButton";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const epilogue = Epilogue({
    //variable: "--font-epilogue",
    subsets: ["latin"]
})

const f1 = Oleo_Script({
    //variable: "--font-epilogue",
    weight: "400",
    subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "The Tappan Square Dispatch Official Website",
  description: "Created by Ben Giesen, OC 26",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className = 'w-full h-full bg-black'>
          <header className={`${epilogue.className} antialiased flex flex-row justify-center py-4 sm:px-6 text-purple-300 text-[30px] bg-black w-full border-b border-b-1 border-b-slate-300`}>
            <div className="flex flex-0 justify-start ml-5">
              <BackButton />
            </div>
            <div className="flex flex-1 justify-center">
              <Link className="hover:text-purple-50" href="/">Home</Link>
              <div className="mx-4 h-9 w-0.75 bg-purple-300"></div>
              <Link className="hover:text-purple-50" href="/abt">About TSD</Link>
              <div className="mx-4 h-9 w-0.75 bg-purple-300"></div>
              <Link className="hover:text-purple-50" href="/contact">Contact Us</Link>
            </div>
          </header>
          {children}
        </div>
      
      </body>
    </html>
  );
}
