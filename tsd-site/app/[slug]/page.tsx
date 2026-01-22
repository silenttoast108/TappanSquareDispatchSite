import { PortableText, type SanityDocument } from "next-sanity";
// import imageUrlBuilder from "@sanity/image-url";
import { client } from "../sanity/client";
import Link from "next/link";
import { Epilogue, Oleo_Script } from "next/font/google";
import { urlFor } from "../sanity/sanityImageUrl";
import {AudioWidget, audioTrack} from "@/components/audioWidget";
// import Accordion from "@/components/accordion";
const epilogue = Epilogue({
    //variable: "--font-epilogue",
    subsets: ["latin"]
})
//might want to move queries to a different file
const STORY_QUERY = `*[
 _type == "story" && AssociatedCollection->slug.current == $slug
 ]|order(_updatedAt desc) {_id, title, description, contributors, spotifyURL, images, "audioURL": audioFile.asset->url, "collection": AssociatedCollection->title}`;

const options = { next: { revalidate: 30 } };
//var startTrackInd = 0;

const f1 = Oleo_Script({
    //variable: "--font-epilogue",
    weight: "400",
    subsets: ["latin"]
});


export default async function storiesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
    const posts = await client.fetch<SanityDocument>(STORY_QUERY, await params, options);
    const slug = (await params).slug

    var trackArr: audioTrack[] = [];
    posts.map((post: SanityDocument) => {
      trackArr.push({
        title: post.title,
        contributors: post.contributors,
        src: post.audioURL
      })
    });
  return (
    <main className="flex flex-col min-h-screen bg-black items-start">
      <div className="flex flex-row items-center justify-center w-full text-center">
        <Link href={`/${slug}`} className = {`${f1.className} antialiased text-purple-100 text-[50px] my-8`}>
          {posts[0].collection}
        </Link>
      </div>
        <ul className="gap-y-4 px-10 mx-auto w-7/8 mb-50">
          {posts.map((post: SanityDocument) => (
            <li className="my-2" key={post._id}>
              <div className={`${epilogue.className} group antialiased flex flex-row p-2 my-2 justify-between items-center`}>
                <Link href={`/${slug}`}>
                  <div className="flex flex-col gap-y-2">
                      <h2 className="group-hover:underline text-xl font-semibold">{post.title || "null"}</h2>
                    <p className='text-m'>{`By ${post.contributors}`}</p>
                    <div className='italic'>
                      {Array.isArray(post.description) && <PortableText value={post.description} />}
                    </div>               
                  </div>
                </Link>
                  <Link href={post.spotifyURL} className="relative w-[150px] flex-shrink-0 rounded-full">
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
                  </Link>
              </div>
              <hr className="border border-solid border-slate-300"></hr>
            </li>
          ))}
        </ul>
      <footer className="border-t fixed bottom-0 w-full py-2 px-5 border-slate-300 bg-[#02021C]">
        <AudioWidget trackArr={trackArr} font={epilogue.className} skip={true}/>
        {/* {changing type to be audiotrack []}. Think abt maybe passing starting track */}
      </footer>
    </main>
  )
}