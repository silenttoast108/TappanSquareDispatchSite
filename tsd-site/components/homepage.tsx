'use client'

import { urlFor } from "@/app/sanity/sanityImageUrl";
import { Link } from "lucide-react";
import { SanityImageAssetDocument, PortableTextBlock, SanityDocument, PortableText } from "next-sanity";
// import { CardinalCurve } from "react-svg-curve";
// import * as motion from "motion/react"
import * as d3 from "d3"
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

export function HomePage({posts, fonts}: HPInput) {
    // console.log(posts)
    const l1ref = useRef<HTMLDivElement | null>(null);
    const l2ref = useRef<HTMLDivElement | null>(null);
    const l3ref = useRef<HTMLDivElement | null>(null);

    const refArr = [l1ref, l2ref, l3ref];

    const [posData, setPosData] = useState<[number, number][]>();
    const [ccData, setCcData] = useState<[number, number][][]>();

    const generatePath = (ind: number, tension: number) => {
        if (!ccData) return
        const lineGen = d3.line()
            .x(d => d[0])
            .y(d => d[1])
            .curve(d3.curveCardinal.tension(tension));

        return lineGen(ccData[ind]);
    }

    useLayoutEffect(() => {
        const updatePositions = () => {
            const newCoords: [number, number][] = []
            for (const ref of refArr) {
                let b = ref.current?.getBoundingClientRect()
                if (b) {
                    newCoords.push (
                        [
                            b.x + window.scrollX + (b.width)/2,
                            b.y + window.scrollY + (b.height)/3
                        ]
                    )
                }
            }

            if (JSON.stringify(newCoords) !== JSON.stringify(posData)) setPosData(newCoords)
        };

        // const calcIntermediateNode = (cord1: [number, number], cord2: [number, number], displacement: number = 60): [number, number] => {
        //     const [x1, y1] = cord1;
        //     const [x2, y2] = cord2;

        //     const midX = (x1 + x2) / 2;
        //     const midY = (y1 + y2) / 2;

        //     const dx = x2 - x1;
        //     const dy = y2 - y1;
        //     const angle = Math.atan2(dy, dx);

        //     const intermediateX = midX + displacement * Math.cos(angle + Math.PI / 2); //used to be sum of mid and displacement
        //     const intermediateY = midY + displacement * Math.sin(angle + Math.PI / 2);

        //     return [intermediateX, intermediateY];
        // };

        const calcIntermediateNodes = (cord1: [number, number], cord2: [number, number], leftToRight: boolean = false, bend: number = 1): [number, number][] => {
            const bendFactor = 1 + (bend % 1);

            const xArr = [cord1[0], cord2[0]].sort((a: number, b: number) => {
                return a - b
            });
            const yArr = [cord1[1], cord2[1]].sort((a: number, b: number) => {
                return a - b
            });
            
            const difX = xArr[1] - xArr[0];
            const difY = yArr[1] - yArr[0];

            const lowBoundX = xArr[0] + (difX/4);
            const lowBoundY = yArr[0] + (difY/4);
            const upBoundY = yArr[1] - (difY/4);
            const upBoundX = xArr[1] - (difX/4);

            const newdifX = upBoundX - lowBoundX;
            const newdifY = upBoundY - lowBoundY;
            
            const pointArr: [number, number][] = []

            // for (let i = 1; i < (3); i++) {
            //     var xMax;
            //     var xMin;
            //     var yMax;
            //     var yMin;
            //     var randX;
            //     var randY;
                    
            //     if (leftToRight) {
            //        xMin = upBoundX - (i * newdifX) / 2;
            //        xMax = upBoundX - ((i-1) * newdifX) / 2;
            //     } else {
            //         xMax = lowBoundX + (i * newdifX) / 2;
            //         xMin = lowBoundX + ((i-1) * newdifX) / 2;
            //     }
                
            //     const yMax = lowBoundY + (i * newdifY) / (2);
            //     const yMin = lowBoundY + ((i-1) * newdifY) / (2);
            //     const randX = Math.floor(Math.random() * (xMax - xMin) + xMin);
            //     const randY = Math.floor(Math.random() * (yMax - yMin) + yMin);
            //     pointArr[i-1] = [randX, randY];
            // }
                        
            var xMax;
            var xMin;
            var yMax;
            var yMin;
            var randX;
            var randY;
                
            if (leftToRight) {
                xMin = upBoundX - (newdifX / 2) * (bendFactor);
                xMax = upBoundX;
            } else {
                xMax = lowBoundX + newdifX / 2 * (bendFactor);
                xMin = lowBoundX;
            }
            
            yMax = lowBoundY + newdifY / 2;
            yMin = lowBoundY;
            randX = Math.floor(Math.random() * (xMax - xMin) + xMin);
            randY = Math.floor(Math.random() * (yMax - yMin) + yMin);
            pointArr.push([randX, randY]);

            if (leftToRight) {
                xMin = upBoundX - newdifX;
                xMax = upBoundX - newdifX / 2 * (1 - bendFactor);
            } else {
                xMax = lowBoundX + newdifX;
                xMin = lowBoundX +  newdifX / 2 * (1 - bendFactor);
            }
            
            yMax = lowBoundY + newdifY;
            yMin = lowBoundY + newdifY / (2);
            randX = Math.floor(Math.random() * (xMax - xMin) + xMin);
            randY = Math.floor(Math.random() * (yMax - yMin) + yMin);
            pointArr.push([randX, randY]);
            //pointArr[i-1] = [randX, randY];
        

            return pointArr;
        }

        const genPosData = () => {
            if (posData) {
                const pointArr1 = [posData[0]];
                const intermediateNodes1 = calcIntermediateNodes(posData[0], posData[1], false, 0.66); //seems to be an appropriate factor. Might need to vary dep on screen size

                intermediateNodes1.forEach((node) => {
                    pointArr1.push(node);
                });
                pointArr1.push(posData[1]);
                
                const pointArr2 = [posData[1]];
                const intermediateNodes2 = calcIntermediateNodes(posData[1], posData[2], true, 0.66); // remember to add spacing between orbs and text blocks

                intermediateNodes2.forEach((node) => {
                    pointArr2.push(node);
                });
                pointArr2.push(posData[2]);

                setCcData([
                    //[posData[0], calcIntermediateNode(posData[0], posData[1]), posData[1]],
                    //[posData[1], calcIntermediateNode(posData[0], posData[1]), posData[2]]
                    pointArr1,
                    pointArr2
                ]);
            }
        }

        updatePositions();
        genPosData();
        
        window.addEventListener('resize', updatePositions);
        return () => window.removeEventListener('resize', updatePositions);
    }, [posData]);

    const path1 = generatePath(0, 0);
    const path2 = generatePath(1, 0)

    return (
        <div className = "relative flex flex-col items-center min-h-screen bg-black">
            {
                (path1 && path2)?
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-1">
                    {/* The Glow/Blur Layer */}
                    {/* <path
                        d={path1}
                        stroke="rgba(168, 85, 247, 0.2)" 
                        strokeWidth="12"
                        fill="none"
                        className="blur-xl"
                    /> */}
                    
                    {/* The Main Visible Line */}
                    <path
                        d={path1}
                        stroke="url(#gradient)"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        //strokeDasharray="10 5" // Optional: Creates a dashed "mapped" look
                    />

                    {/* <path
                        d={path2}
                        stroke="rgba(168, 85, 247, 0.2)" 
                        strokeWidth="12"
                        fill="none"
                        className="blur-xl"
                    /> */}
                    
                    {/* The Main Visible Line */}
                    <path
                        d={path2}
                        stroke="url(#gradient)"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        //strokeDasharray="10 5" // Optional: Creates a dashed "mapped" look
                    />
                    {/* Gradient Definition */}
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#c084fc" />
                        </linearGradient>
                    </defs>
                </svg>
                : <></>
            }
            
            <div className='w-full flex items-center justify-center border-b border-b-1 border-b-slate-300 mb-4'>
                <h1 className={`${fonts[0]} pl-4 antialiased text-slate-300 text-[50px] my-4 text-start cursor-pointer`}>The Tappan Square Dispatch</h1>
            </div>
            <ul className="flex flex-col gap-y-4 mx-auto max-w">
                <li className="flex flex-row justify-between items-center py-[3%] px-[15%] gap-x-[15%]" key={posts[0].id}>
                    <span className={`text-center ${fonts[1]} antialiased text-slate-300 overflow-hidden z-2`}>
                        Oberlin College is a small undergraduate liberal arts college in northeast Ohio that is known for 
                        its uniquely strong music conservatory, arts and humanities programs, STEM programs, and progressive 
                        politics. Oberlin is the oldest coeducational college in the U.S., located in a historically liberal small town. 
                        The name of this podcast comes from the beautiful little square park where the town and college intersect. 
                    </span>
                    <div className='relative flex items-center justify-center flex-initial h-[150px] w-[150px] md:h-[300px] md:w-[300px] flex-shrink-0 rounded-full border border-1 border-slate-300 m-2'>
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
                    <div className='relative flex items-center justify-center flex-initial h-[150px] w-[150px] md:h-[300px] md:w-[300px] flex-shrink-0 rounded-full border border-1 border-slate-300 m-2'>
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
                    <span className={`text-center ${fonts[1]} antialiased text-slate-300 overflow-hidden z-2`}>
                        Oberlin's journalism students will use this podcast to feature audio content they have produced. In the past, there have been other Oberlin student news podcasts, 
                        such as The Weekly from our campus newspaper, The Oberlin Review, The Monday Morning Report from Oberlin's radio station, WOBC-FM (91.5), and Obercast, which was produced
                         during a 2020 Winter Term class on podcasting. In Fall 2022, third-year student Hazel Feldstein created The Tappan Square Dispatch (TSD) to cover both campus and local town news.
                    </span>
                </li>
                <li className="flex flex-row justify-between items-center py-[3%] px-[15%] gap-x-[15%]" key={posts[2].id}>
                    <span className={`${fonts[1]} text-center antialiased text-slate-300 overflow-hidden z-2`}>
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
        </div>
    )
}