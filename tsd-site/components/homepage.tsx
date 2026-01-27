'use client'

import { urlFor } from "@/app/sanity/sanityImageUrl";
import { Link } from "lucide-react";
import { SanityImageAssetDocument, PortableTextBlock, SanityDocument, PortableText } from "next-sanity";
import { CardinalCurve } from "react-svg-curve";
import * as motion from "motion/react"
import { use, useLayoutEffect, useRef, useState } from "react";

export interface HPInput {
    posts: collectionPost[],
    fonts: string[]
}

export type collectionPost = {
    id: string,
    title: string,
    contributors: string,
    date: string,
    description: PortableTextBlock,
    image: SanityImageAssetDocument,
    slug: string
}

const handleRoute = (post: collectionPost) => {//temp solution
    window.open(`/${post.slug}`);
}

// function Range({ min = 0, max = 1, step = 0.01, value, setValue, label }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center"
//       }}
//     >
//       <label>{label}: </label>
//       <div style={{ width: 50 }}>{value}</div>
//       <input
//         type="range"
//         step={step}
//         min={min}
//         max={max}
//         value={value}
//         onChange={e => setValue(+e.target.value)}
//       />
//     </div>
//   );
// }

export function HomePage({posts, fonts}: HPInput) {
    // console.log(posts)\
    const l1ref = useRef<HTMLDivElement | null>(null);
    const l2ref = useRef<HTMLDivElement | null>(null);
    const l3ref = useRef<HTMLDivElement | null>(null);

    const [posData, setPosData] = useState<[number, number][]>();
    const [ccData, setCcData] = useState<[number, number][][]>();

    useLayoutEffect(() => {
        const updatePositions = () => {
            if (!l1ref.current || !l2ref.current || !l3ref.current) return;

            const newCoords: [number, number][] = [
                [l1ref.current.getBoundingClientRect().x, l1ref.current.getBoundingClientRect().y],
                [l2ref.current.getBoundingClientRect().x, l2ref.current.getBoundingClientRect().y],
                [l3ref.current.getBoundingClientRect().x, l3ref.current.getBoundingClientRect().y]
            ];

            if (JSON.stringify(newCoords) !== JSON.stringify(posData)) setPosData(newCoords)
        };

        const calcIntermediateNode = (cord1: [number, number], cord2: [number, number], displacement: number = 40): [number, number] => {
            const [x1, y1] = cord1;
            const [x2, y2] = cord2;

            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            const dx = x2 - x1;
            const dy = y2 - y1;
            const angle = Math.atan2(dy, dx);

            const intermediateX = midX + displacement * Math.cos(angle + Math.PI / 2);
            const intermediateY = midY + displacement * Math.sin(angle + Math.PI / 2);

            return [intermediateX, intermediateY];
        };

        const renderCardinalCurves = () => {
            if (posData) {
                setCcData([
                    [posData[0], calcIntermediateNode(posData[0], posData[1]), posData[1]],
                    [posData[1], calcIntermediateNode(posData[0], posData[1]), posData[2]]
                ])
            }
        }

        updatePositions();
        renderCardinalCurves();
        
        window.addEventListener('resize', updatePositions);
        return () => window.removeEventListener('resize', updatePositions);
    }, [posData]);

    return (

        <div className = "relative flex flex-col items-center min-h-screen bg-black">
            <div className='w-full flex items-center justify-center border-b border-b-1 border-b-slate-300 mb-4'>
                <h1 className={`${fonts[0]} pl-4 antialiased text-slate-300 text-[50px] my-4 text-start cursor-pointer`}>The Tappan Square Dispatch</h1>
            </div>
            <ul className="flex flex-col gap-y-4 mx-auto max-w">
                <li className="flex flex-row justify-between items-center py-[3%] px-[15%] gap-x-[15%]" key={posts[0].id}>
                    <span className={`text-center ${fonts[1]} antialiased text-slate-300 overflow-hidden`}>
                        Oberlin College is a small undergraduate liberal arts college in northeast Ohio that is known for 
                        its uniquely strong music conservatory, arts and humanities programs, STEM programs, and progressive 
                        politics. Oberlin is the oldest coeducational college in the U.S., located in a historically liberal small town. 
                        The name of this podcast comes from the beautiful little square park where the town and college intersect. 
                    </span>
                    <div className='relative flex items-center justify-center flex-initial h-[150px] w-[150px] md:h-[300px] md:w-[300px] flex-shrink-0 rounded-full border border-1 border-slate-300'>
                        <img
                            className="z-1 rounded-full transition-filter duration-300 group-hover:brightness-50"
                            src={urlFor(posts[0].image)
                            .width(300)
                            .height(300)
                            .url()}
                            alt={`Image for ${posts[0].title}`}
                        />
                            <div ref={l1ref} onClick={() => (handleRoute(posts[0]))} className="cursor-pointer opacity-0 hover:opacity-100 absolute inset-0 w-full h-full z-2 flex flex-col justify-center items-center text-center text-slate-300 overflow-hidden bg-slate-600/60 rounded-full duration-300 px-4 py-13">
                                <h2 className="text-md">{posts[0].title}</h2>
                                <div className="text-sm overflow-hidden">
                                    {Array.isArray(posts[0].description) && <PortableText value={posts[0].description} />}
                                </div>
                            </div>
                    </div>
                </li>
                <li className="flex flex-row justify-between items-center py-[3%] px-[15%] gap-x-[15%]" key={posts[1].id}>
                    <div className='relative flex items-center justify-center flex-initial h-[150px] w-[150px] md:h-[300px] md:w-[300px] flex-shrink-0 rounded-full border border-1 border-slate-300'>
                        <img
                            className="z-1 rounded-full transition-filter duration-300 group-hover:brightness-50"
                            src={urlFor(posts[1].image)
                            .width(300)
                            .height(300)
                            .url()}
                            alt={`Image for ${posts[1].title}`}
                        />
                            <div ref={l2ref} onClick={() => (handleRoute(posts[1]))} className="cursor-pointer opacity-0 hover:opacity-100 absolute inset-0 w-full h-full z-2 flex flex-col justify-center items-center text-center text-slate-300 overflow-hidden bg-slate-600/60 rounded-full duration-300 px-4 py-13">
                                <h2 className="text-md">{posts[1].title}</h2>
                                <div className="text-sm overflow-hidden">
                                    {Array.isArray(posts[1].description) && <PortableText value={posts[1].description} />}
                                </div>
                            </div>
                    </div>
                    <span className={`text-center ${fonts[1]} antialiased text-slate-300 overflow-hidden`}>
                        Oberlin's journalism students will use this podcast to feature audio content they have produced. In the past, there have been other Oberlin student news podcasts, 
                        such as The Weekly from our campus newspaper, The Oberlin Review, The Monday Morning Report from Oberlin's radio station, WOBC-FM (91.5), and Obercast, which was produced
                         during a 2020 Winter Term class on podcasting. In Fall 2022, third-year student Hazel Feldstein created The Tappan Square Dispatch (TSD) to cover both campus and local town news.
                    </span>
                </li>
                <li className="flex flex-row justify-between items-center py-[3%] px-[15%] gap-x-[15%]" key={posts[2].id}>
                    <span className={`${fonts[1]} text-center antialiased text-slate-300 overflow-hidden`}>
                        Oberlin College is a small undergraduate liberal arts college in northeast Ohio that is known for 
                        its uniquely strong music conservatory, arts and humanities programs, STEM programs, and progressive 
                        politics. Oberlin is the oldest coeducational college in the U.S., located in a historically liberal small town. 
                        The name of this podcast comes from the beautiful little square park where the town and college intersect. 
                    </span>
                    <div className='relative flex items-center justify-center flex-initial h-[150px] w-[150px] md:h-[300px] md:w-[300px] flex-shrink-0 rounded-full border border-1 border-slate-300'>
                        <img
                            className="z-1 rounded-full transition-filter duration-300 group-hover:brightness-50"
                            src={urlFor(posts[2].image)
                            .width(300)
                            .height(300)
                            .url()}
                            alt={`Image for ${posts[2].title}`}
                        />
                            <div ref={l3ref} onClick={() => (handleRoute(posts[2]))} className="cursor-pointer opacity-0 hover:opacity-100 absolute inset-0 w-full h-full z-2 flex flex-col justify-center items-center text-center text-slate-300 overflow-hidden bg-slate-600/60 rounded-full duration-300 px-4 py-13">
                                <h2 className="text-md">{posts[2].title}</h2>
                                <div className="text-sm overflow-hidden">
                                    {Array.isArray(posts[2].description) && <PortableText value={posts[2].description} />}
                                </div>
                            </div>
                    </div>
                </li>
                {/* {posts.map((post: collectionPost, i) => (
                <li className="flex flex-row my-2" key={post.id}>
                    <div className="flex flex-col flex-1 items-start">
                    <Link className="hover:underline" href={`/${post.slug}`}>
                        <h2 className="text-xl font-semibold">{post.title || "null"}</h2>
                    </Link>
                    {Array.isArray(post.description) && <PortableText value={post.description} />}
                    <p>{new Date(post.date).toLocaleDateString()}</p>
                    </div>
                    <img
                    className="flex-shrink-0"
                    src={urlFor(post.image)
                        .width(200)
                        .height(150)
                        .url()}
                    alt={post.image.alt || `Portrait of ${post.title}`}
                    />
                </li>

                ))} */}
            </ul>
            {/* <div className="z-10 bg-white"> */}
                {/* <h3>
                    <code children="<CardinalCurve />" />
                </h3>
                {ccData?
                    <svg height='auto' width='auto' xmlns="http://www.w3.org/2000/svg">
                        <CardinalCurve data={ccData[0]} tension={0} />
                    </svg>
                : <></>
                } */}
                
                {/* <h3>
                    <code children="<CardinalCurve />" />
                </h3>
                <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg"> */}
                {/* {ccData? 
                    <><CardinalCurve data={ccData[0]} tension={20} /><Range
                        label="tension"
                        max={1}
                        value={0}
                        setValue={0} /></>
                    
                : <></>} */}
                    
                {/* </svg>
                <Range
                    label="tension"
                    max={1}
                    value={cardinalTension}
                    setValue={setCardinalTension}
                /> */}
            {/* </div> */}
        </div>
    )
}