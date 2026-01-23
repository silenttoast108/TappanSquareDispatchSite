// import { useState } from "react";
// import { usePathname } from "next/navigation";
import { Oleo_Script, Epilogue } from "next/font/google";
import {SanityImageAssetDocument, PortableText, PortableTextBlock, type SanityDocument } from "next-sanity";
import Link from "next/link";
import { Download, Share2 } from 'lucide-react'
import { urlFor } from "@/app/sanity/sanityImageUrl";
import { AudioWidget, audioTrack } from "./audioWidget";

const f2 = Epilogue({
    subsets: ["latin"]
})

const f1 = Oleo_Script({
    weight: "400",
    subsets: ["latin"]
});

export interface TPInput {
    title: string,
    contributors: string,
    date: string,
    description: PortableTextBlock,
    spotifyURL: string, //might be correct,
    images: SanityImageAssetDocument[],
    audioURL: string,
    script: PortableTextBlock,

}

export default function TranscriptPage({title, contributors, date, description, spotifyURL, images, audioURL, script}: TPInput) {
    // console.log(title);
    // console.log(contributors);
    // console.log(description);
    // console.log(spotifyURL);
    // console.log(images);
    // console.log(audioURL);
    return (
        <main className='pl-2  flex flex-col items-center min-h-screen bg-black'>
            <div className='w-full flex justify-center items-center border-b border-b-1 border-b-slate-300'>
                <h1 className={`${f1.className} antialiased text-purple-100 text-[50px] my-4 text-center`}>{title}</h1>
            </div>
            {/* <hr className="w-full h-[1] "/> */}
            <div className = {`${f2.className} antialiased flex flex-col jusitfy-start gap-y-2 border-b border-b-1 border-b-slate-300 pt-2 pb-4 mb-2`}>
                <p className='text-xs text-slate-600'>{new Date(date).toISOString()}</p>
                <p className='text-m text-slate-300'>{`By ${contributors}`}</p>
                <div className='italic text-slate-300'>
                    {Array.isArray(description) && <PortableText value={description} />}
                </div>               
            </div>
            {/* <hr className="border border-solid border-slate-300"/> */}
            <div className={`${f2.className} antialiased w-full flex flex-row justify-start text-purple-300 text-lg gap-x-4`}>
                <Link className="hover:text-purple-50" href="/">
                    <div className="flex flex-row items-center justify-center gap-x-3 border rounded-xl border-purple-300 hover:border-slate-300 px-2">
                        <Share2/>
                        <span>Download MP3</span>
                    </div>
                </Link>
                <Link className="hover:text-purple-50" href={spotifyURL}>
                    <div className="flex flex-row items-center justify-center gap-x-3 border rounded-xl border-purple-300 hover:border-slate-300 px-2">
                        <svg width="15" height="12" viewBox="0 0 15 12">
                            <path d="M14.277 2.13A18.575 18.575 0 0 0 5.653.032c-1.57 0-3.14.2-4.668.588-.5.13-.81.763-.684 1.284.124.52.635.839 1.135.71a16.906 16.906 0 0 1 4.223-.528c2.732 0 5.344.632 7.782 1.888a.88.88 0 0 0 .408.104c.353 0 .686-.295.853-.64.225-.478.04-1.068-.425-1.31zM5.653 8.282c-1.27 0-2.522.198-3.725.58-.374.121-.584.945-.466 1.326a.7.7 0 0 0 .885.486 10.634 10.634 0 0 1 3.306-.521c1.885 0 3.755.494 5.392 1.44l.342.086c.25 0 .494-.14.618-.382.184-.346.066-1.204-.276-1.404a12.343 12.343 0 0 0-6.076-1.61zm7.303-2.14a15.433 15.433 0 0 0-7.297-1.846c-1.419 0-2.83.19-4.182.579-.443.122-.701.903-.575 1.353.117.46.568.728 1.01.597 1.21-.346 2.48-.52 3.747-.52 2.307 0 4.51.555 6.547 1.656.117.069.25.095.376.095.3 0 .583-.477.727-.763a.874.874 0 0 0-.353-1.151z" fill="currentColor" fillRule="evenodd">
                            </path>
                        </svg>
                        <span>Spotify</span>
                    </div>
                    
                </Link>
                <Link className="hover:text-purple-50" href={audioURL}>
                    <div className="flex flex-row items-center justify-center gap-x-3 border rounded-xl border-purple-300 hover:border-slate-300 px-2">
                        <Download/>
                        <span>Download MP3</span>
                    </div>
                </Link>
            </div>
            <div className="w-full flex flex-row justify-start">
                {images.map((image, i) => (
                        <img
                            key={i}
                            className=""
                            src={urlFor(image)
                            .width(200)
                            .height(150)
                            .url()}
                            alt={`Image for ${title}`}
                        />
                ))}
            </div>
            <div className={`${f2.className} antialiased`}>
                {Array.isArray(script) && <PortableText value={script} />}
            </div>
            <footer className="border-t fixed bottom-0 w-full py-2 px-5 border-slate-300 bg-[#02021C]">
                <AudioWidget trackArr={[{
                    title: title,
                    contributors: contributors,
                    src: audioURL
                }]} font={f2.className} skip={false}/>
            </footer>
        </main>
    )
}