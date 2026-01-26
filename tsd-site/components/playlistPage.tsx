'use client'
import { PortableText, PortableTextBlock, SanityImageAssetDocument } from "next-sanity"
import { AudioWidget, audioTrack} from "./audioWidget"
import { useState, useRef, useEffect, use } from "react";
import Link from "next/link";
import { urlFor } from "@/app/sanity/sanityImageUrl";

interface PLPInput {
    storyPosts: storyPost[],
    fonts: string[],
    slug: string,
}

export type storyPost = {
    collection: string,
    title: string,
    contributors: string,
    date: string,
    description: PortableTextBlock,
    spotifyURL: string,
    images: SanityImageAssetDocument[],
    audioURL: string,
    script: PortableTextBlock,
    storySlug: string
}

export default function PlaylistPage({
    storyPosts,
    fonts,
    slug}: PLPInput) {

    const[widgetOpen, setWidgetOpen] = useState(false);
    const[trackInd, setTrackInd] = useState(0);

    const handleStorySelect = (i: number) => {
            setWidgetOpen(true);
            setTrackInd(i);
        //    console.log(widgetOpen);
        //    console.log(trackInd)
    }

    const handleClose = () => {
        setWidgetOpen(false);
    }

    const trackArr: audioTrack[] = [] //might make more sense to pass individual track to widget & rerender on skip...
    storyPosts.map((post) => {
        trackArr.push({
            title: post.title,
            contributors: post.contributors,
            src: post.audioURL
        });
    });

    return (
        <main className="flex flex-col min-h-screen bg-black items-start">
            <div className="flex flex-row items-center justify-center w-full text-center">
                {/* <Link href={`/${slug}`} className = {`${fonts[0]} antialiased text-purple-100 text-[50px] my-8`}>
                    {storyPosts[0].collection}
                </Link> */}
                <div className='px-20 w-full flex items-center justify-center border-b border-b-1 border-b-slate-300'>
                    <h1 className={`${fonts[0]} pl-4 antialiased text-slate-300 text-[50px] my-4 text-start`}>{storyPosts[0].collection}</h1>
                </div>
            </div>
            <ul className="gap-y-4 px-20 mx-auto w-full mb-50">
                {storyPosts.map((post: storyPost, i) => (
                <li className="my-2" key={i}>
                    <div className={`${fonts[1]} z-1 group antialiased flex flex-row p-2 my-2 justify-between items-center`}>
                        <Link href={`/${slug}/${post.storySlug}`}>
                            <div className="flex flex-col gap-y-2">
                                <h2 className="group-hover:underline text-xl font-semibold">{post.title || "null"}</h2>
                            <p className='text-m'>{`By ${post.contributors}`}</p>
                                <div className='italic'>
                                    {Array.isArray(post.description) && <PortableText value={post.description} />}
                                </div>               
                            </div>
                        </Link>
                        <button onClick={(e) => {handleStorySelect(i)}} className="relative w-[150px] h-[150px] flex-shrink-0 rounded-full overflow-hidden cursor-pointer appearance-none border-none bg-gray-200">
                            <img
                                className="rounded-full transition-filter duration-300 group-hover:brightness-50"
                                src={urlFor(post.images[0])
                                .width(300)
                                .height(300)
                                .url()}
                                alt={`Image for ${post.title}`}
                            />

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full border border-white/50">
                                <svg 
                                    className="w-8 h-8 text-white fill-current" 
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                </div>
                            </div>
                        </button>
                    </div>
                    <hr className="border border-solid border-slate-300"></hr>
                </li>
                ))}
            </ul>
            <AudioWidget onClose={(handleClose)} trackArr={trackArr} font={fonts[1]} skip={true} open={widgetOpen} startTrackInd={trackInd || 0} playing={widgetOpen}/>
        </main>);
}