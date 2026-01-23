import { useState } from "react";
import { usePathname } from "next/navigation";
import { Oleo_Script } from "next/font/google";
import { PortableText, type SanityDocument } from "next-sanity";
import Link from "next/link";

const f1 = Oleo_Script({
    //variable: "--font-epilogue",
    weight: "400",
    subsets: ["latin"]
});

export default function TranscriptPage() {
    return (
        <main className='flex flex-col min-h-screen bg-black items-start'>
            <div className='w-full items-center'>
                <title className={`${f1.className} antialiased text-purple-100 text-[50px] my-8 w-full`}>Title</title>
            </div>
            <hr className="border border-solid border-slate-300"></hr>
            <div className = 'flex jusitfy-start gap-y-2'>
                <p className='text-xs text-slate-600'>date</p>
                <p className='text-m'>{`By post.contributors`}</p>
                <div className='italic'>
                    {/* {Array.isArray("post.description") && <PortableText value={"post.description"} />} */}
                </div>               
            </div>
            <hr className="border border-solid border-slate-300"></hr>
            <div className="flex flex-1 justify-center">
                <Link className="hover:text-purple-50" href="/">Share</Link>
                <div className="mx-4 h-9 w-0.75 bg-purple-300"></div>
                <Link className="hover:text-purple-50" href="/abt">
                    Spotify
                    <svg width="15" height="12" viewBox="0 0 15 12">
                        <path d="M14.277 2.13A18.575 18.575 0 0 0 5.653.032c-1.57 0-3.14.2-4.668.588-.5.13-.81.763-.684 1.284.124.52.635.839 1.135.71a16.906 16.906 0 0 1 4.223-.528c2.732 0 5.344.632 7.782 1.888a.88.88 0 0 0 .408.104c.353 0 .686-.295.853-.64.225-.478.04-1.068-.425-1.31zM5.653 8.282c-1.27 0-2.522.198-3.725.58-.374.121-.584.945-.466 1.326a.7.7 0 0 0 .885.486 10.634 10.634 0 0 1 3.306-.521c1.885 0 3.755.494 5.392 1.44l.342.086c.25 0 .494-.14.618-.382.184-.346.066-1.204-.276-1.404a12.343 12.343 0 0 0-6.076-1.61zm7.303-2.14a15.433 15.433 0 0 0-7.297-1.846c-1.419 0-2.83.19-4.182.579-.443.122-.701.903-.575 1.353.117.46.568.728 1.01.597 1.21-.346 2.48-.52 3.747-.52 2.307 0 4.51.555 6.547 1.656.117.069.25.095.376.095.3 0 .583-.477.727-.763a.874.874 0 0 0-.353-1.151z" fill="#FFF" fill-rule="evenodd">
                        </path>
                    </svg>
                </Link>
                <div className="mx-4 h-9 w-0.75 bg-purple-300"></div>
                <Link className="hover:text-purple-50" href="/contact">Download</Link>
            </div>
        </main>
    )
}