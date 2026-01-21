'use client';
import { useState } from "react";
import { PortableText, type SanityDocument } from "next-sanity";
import { urlFor } from "@/app/sanity/sanityImageUrl";



const Accordion = (post: SanityDocument) => {
    console.log(post.title)
    const [stateOpen, setState] = useState(false);
    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-row w-full">
                <button onClick={() => {setState(!stateOpen)}}>
                    {stateOpen? <span>-</span>:<span>+</span>}
                </button>
                <h1 className="text-xl font-semibold">{post.title}</h1>
                <h2>{post.contributors}</h2>
                <h2>{post.audioURL}</h2>
            </div>
            {Array.isArray(post.description) && <PortableText value={post.description} />}
            <div className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                stateOpen? 'grid-[fr1] opacity-100' : 'grid-[fr0] opacity-0'
            }`}>
                {Array.isArray(post.script) && <PortableText value={post.script} />}
            </div>
        </div>
    )
}
{/* <Accordion 
                    post={post} 
                    _id={post._id}
                     _rev={post._rev} 
                     _type={post._type} 
                     _createdAt={post._createdAt}
                     _updatedAt={post._updatedAt}
                     title={post.title}
                     audioURL={post.audioURL}
                     contributors={post.contributors}
                     script={post.script}
                     images={post.images}
                /> */}
export default Accordion