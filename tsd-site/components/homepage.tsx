'use client'

import { urlFor } from "@/app/sanity/sanityImageUrl";
import { SanityImageAssetDocument, PortableTextBlock} from "next-sanity";
// import { CardinalCurve } from "react-svg-curve";
// import * as motion from "motion/react"
import * as d3 from "d3"
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

export interface HPInput {
    posts: collectionPost[],
    fonts: string[]
}

export type collectionPost = {
    type: string,
    id: string,
    title: string,
    contributors: string,
    date: string,
    description: PortableTextBlock,
    image: SanityImageAssetDocument,
    slug: string
}

export function HomePage({posts, fonts}: HPInput) {

    const refArr: RefObject<HTMLDivElement | null>[] = [];

    for (let i=0; i <posts.length; i++) {
        refArr.push(useRef<HTMLDivElement | null>(null));
    }

    const [posData, setPosData] = useState<[number, number][]>();
    const [ccData, setCcData] = useState<[number, number][][]>();
    const [hasMounted, setHasMounted] = useState<boolean>(false);

    const generatePath = (ind: number, tension: number) => {
        if (!ccData) return
        const lineGen = d3.line()
            .x(d => d[0])
            .y(d => d[1])
            .curve(d3.curveCardinal.tension(tension));

        return lineGen(ccData[ind]);
    }


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

        const lowBoundX = xArr[0] + (difX/3);
        const lowBoundY = yArr[0] + (difY/3);
        const upBoundY = yArr[1] - (difY/3);
        const upBoundX = xArr[1] - (difX/3);

        const newdifX = upBoundX - lowBoundX;
        const newdifY = upBoundY - lowBoundY;
        
        const pointArr: [number, number][] = []
                    
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
    
        return pointArr;
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

        const genPosData = () => {//should be better now...
            const toBeCcData: [number, number][][] = []

            if (posData) {
                for (let i=1; i<posData.length; i++) {
                    const boolArr = [true, false];
                    const points = [posData[i-1]];
        
                    calcIntermediateNodes(posData[i-1], posData[i], boolArr[i%2], 0.9).forEach((node) => {                    
                        points.push(node);
                    });

                    points.push(posData[i]);
                    toBeCcData.push(points);
                }
                console.log(toBeCcData);
                setCcData(toBeCcData);
            }
        }

        updatePositions();
        genPosData();
        
        window.addEventListener('resize', updatePositions);
        return () => window.removeEventListener('resize', updatePositions);
    }, [posData]);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const pathArr: (string | null | undefined)[] = []
    for (let i=0; i<posts.length-1; i++) {
        pathArr.push(generatePath(i, 0));
    }

    return (
        <div className = "relative flex flex-col items-center min-h-screen bg-black">
            <div className='w-full flex items-center justify-center border-b border-b-1 border-b-slate-300 mb-4'>
                <h1 className={`${fonts[0]} pl-4 antialiased text-slate-300 text-[50px] my-4 text-start cursor-pointer`}>The Tappan Square Dispatch</h1>
            </div>
            {
                hasMounted
                ? <svg className="absolute inset-0 w-full h-full pointer-events-none z-1">
                    {
                        pathArr.map((path, i) => (
                            path
                            ? <path
                                key={i}
                                d={path}
                                //stroke="url(#gradient)"
                                stroke = "#d8b4fe"
                                strokeWidth="4"
                                fill="none"
                                strokeLinecap="round"
                                //strokeDasharray="10 5" // Optional: Creates a dashed "mapped" look
                            />
                            : <div key={i}></div>
                        ))
                    }
                </svg>
                : <></>
            }
            
            <ul className="flex flex-col gap-y-4 mx-auto max-w">
            {
                posts.map((post, ind) => (
                    <div key = {ind}>
                        {
                        ind % 2 == 1?
                            <li className="flex flex-row justify-between items-center py-13 px-[5%] sm:px-[3%] gap-x-[20%]" key={post.id}>
                                {/* gap-x-[25%] sm:gap-x-[30%] */}
                                <div className='z-2 relative flex items-center justify-center flex-initial h-[350px] w-[350px] flex-shrink-0 rounded-full border border-1 border-slate-300 m-2 hover:border-[#f0bf4d] hover:border-2'>
                                    <img
                                        className="z-1 rounded-full transition-filter duration-500 group-hover:brightness-50"
                                        src={urlFor(post.image)
                                        .width(350)
                                        .height(350)
                                        .url()}
                                        alt={`Image for ${post.title}`}
                                    />
                                        {/* <div ref={l2ref} onClick={() => (handleRoute(posts[1]))} className="cursor-pointer opacity-0 hover:opacity-100 absolute inset-0 w-full h-full z-2 flex flex-col justify-center items-center text-center text-slate-300 overflow-hidden bg-slate-600/60 rounded-full duration-300 px-4 py-13"> */}
                                            {
                                            post.type != 'story'?
                                                <div ref={refArr[ind]} className="text-slate-300 cursor-pointer opacity-0 hover:opacity-100 absolute inset-0 w-full h-full z-2 overflow-hidden bg-slate-600/60 rounded-full duration-300">
                                                    <div className="flex flex-col justify-center items-center text-center relative gap-y-2 w-full h-full rounded-full px-[10%]">
                                                        <h2 className="text-xl">{post.title}</h2>
                                                        <hr className="w-full border border-slate-300 border-1 px-[10%]"/>
                                                        <h2 className="text-xl">{post.date}</h2>
                                                        <h2 className="text-lg">{post.contributors}</h2>
                                                        <a href={`/${post.slug}`} className="absolute w-full h-full top-0 left-0"></a>
                                                    </div>
                                                </div>
                                                 
                                            :   <div ref={refArr[ind]} className="cursor-pointer opacity-0 hover:opacity-100 absolute inset-0 w-full h-full z-2 flex flex-col justify-center items-center text-center text-slate-300 overflow-hidden bg-slate-600/60 rounded-full duration-300">
                                                    <div className="flex flex-col justify-center items-center text-center relative gap-y-2 w-full h-full rounded-full px-[10%]">
                                                        <h2 className="text-xl">{post.title}</h2>
                                                        <hr className="w-full border border-slate-300 border-1"/>
                                                        <h2 className="text-lg">{post.contributors}</h2>
                                                        <hr className="w-full border border-slate-300 border-1"/>
                                                        <h2 className="text-xl">{post.date}</h2>
                                                        <a href={`/${post.slug}`} className="absolute w-full h-full top-0 left-0"></a>
                                                    </div>
                                                </div>
                                            }
                                </div>
                                    {
                                    ind == 1?
                                        <span className={`text-center ${fonts[1]} antialiased text-slate-300 overflow-hidden z-2 max-w-[800px]`}>
                                            Oberlin's journalism students will use this podcast to feature audio content they have produced. In the past, 
                                            there have been other Oberlin student news podcasts, such as The Weekly from our campus newspaper, The Oberlin Review, 
                                            The Monday Morning Report from Oberlin's radio station, WOBC-FM (91.5), and Obercast, which was produced during a 2020 Winter 
                                            Term class on podcasting. In Fall 2022, third-year student Hazel Feldstein created The Tappan Square Dispatch (TSD) 
                                            to cover both campus and local town news.
                                        </span>
                                    : <></>
                                    }
                            </li>
                        :   <li className="flex flex-row justify-between items-center py-13 px-[5%] gap-x-[15%]" key={post.id}>
                                {
                                ind == 0?
                                    <div className={`text-center ${fonts[1]} antialiased text-slate-300 overflow-hidden max-w-[800px] z-2`}>
                                        <span className={`${fonts[1]} antialiased flex flex-row justify-center items-center text-[40px] my-3 text-purple-300`}>
                                            WHAT ARE WE?
                                        </span>
                                        <hr className="w-full border-slate-300 border-1 my-3"/>
                                        <div className="flex flex-row md:flex-col text-transparent bg-clip-text bg-gradient-to-b from-[#d1b919] to-[#e6e2ba]">
                                            <div className="flex flex-row justify-between items-center my-3 px-10 text-slate-300 text-start">
                                                <span className="text-[40px] bold mr-[10%] text-[#f0bf4d]">#1</span>
                                                <span className="text-[25px] text-slate-300">A bridge between the college and community</span>
                                            </div>
                                            <div className="flex flex-row justify-between items-center my-3 px-10 text-slate-300 text-start">
                                                <span className="text-[40px] bold mr-[10%] text-[#f0bf4d]">#2</span>
                                                <span className="text-[25px] text-slate-300">A showcase of Oberlin journalism students' audio work</span>
                                            </div>
                                        </div>
                                    </div>
                                : <></>
                                }
                                {
                                ind == 2?
                                    <span className={`text-center ${fonts[1]} antialiased text-slate-300 overflow-hidden z-2 max-w-[800px]`}>
                                        Oberlin College is a small undergraduate liberal arts college in northeast Ohio that is known for its uniquely strong music conservatory,
                                        arts and humanities programs, STEM programs, and progressive politics. Oberlin is the oldest coeducational college in the U.S., 
                                        located in a historically liberal small town. The name of this podcast comes from the beautiful little square park where the town and college intersect.
                                    </span>
                                : <></>
                                }
                                <div className='z-2 relative flex items-center justify-center flex-initial h-[350px] w-[350px] flex-shrink-0 rounded-full border border-1 border-slate-300 hover:border-[#f0bf4d] hover:border-2'>
                                    <img
                                        className="z-1 rounded-full transition-filter duration-500 group-hover:brightness-50"
                                        src={urlFor(post.image)
                                        .width(350)
                                        .height(350)
                                        .url()}
                                        alt={`Image for ${post.title}`}
                                    />
                                    {
                                    post.type != 'story'?
                                        <div ref={refArr[ind]} className="text-slate-300 cursor-pointer opacity-0 hover:opacity-100 absolute inset-0 w-full h-full z-2 flex flex-col justify-center items-center text-center overflow-hidden bg-slate-600/60 rounded-full duration-300">
                                            <div className="flex flex-col justify-center items-center text-center relative w-full h-full rounded-full px-[10%] gap-y-2">
                                                <h2 className="text-xl">{post.title}</h2>
                                                <hr className="w-full border border-slate-300 border-1"/>
                                                <h2 className="text-xl">{post.date}</h2>
                                                <h2 className="text-lg">{post.contributors}</h2>
                                                <a href={`/${post.slug}`} className="absolute w-full h-full top-0 left-0"></a>
                                            </div>
                                        </div>
                                            
                                    :   <div ref={refArr[ind]} className="cursor-pointer opacity-0 hover:opacity-100 absolute inset-0 w-full h-full z-2 flex flex-col justify-center items-center text-center text-slate-300 overflow-hidden bg-slate-600/60 rounded-full duration-300">
                                            <div className="flex flex-col justify-center items-center text-center relative w-full h-full rounded-full px-[10%] gap-y-2">
                                                <h2 className="text-xl">{post.title}</h2>
                                                    <hr className="w-full border border-slate-300 border-1"/>
                                                    <h2 className="text-lg">{post.contributors}</h2>
                                                    <hr className="w-full border border-slate-300 border-1"/>
                                                    <h2 className="text-xl">{post.date}</h2>
                                                <a href={`/${post.slug}`} className="absolute w-full h-full top-0 left-0"></a>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </li>
                        }
                    </div>
                ))
            }
            </ul>     
        </div>
    )
}