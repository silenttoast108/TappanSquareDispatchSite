import { useState } from "react";
import { usePathname } from "next/navigation";
import { Oleo_Script } from "next/font/google";

const f1 = Oleo_Script({
    //variable: "--font-epilogue",
    weight: "400",
    subsets: ["latin"]
});

export default function transcriptPage() {
    return (
        <main className='flex flex-col min-h-screen bg-black items-start'>
            <div className='w-full items-center'>
                <title className={`${f1.className} antialiased text-purple-100 text-[50px] my-8 w-full`}>Title</title>
            </div>
        </main>
    )
}