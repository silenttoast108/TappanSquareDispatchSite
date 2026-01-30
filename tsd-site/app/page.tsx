//import Image from "next/image";
import { Oleo_Script, Epilogue } from "next/font/google";
// import Link from "next/link";
import {type SanityDocument } from "next-sanity";
// import {urlFor} from "./sanity/sanityImageUrl";
import { HomePage, type collectionPost } from "../components/homepage"
import {client} from "./sanity/client";

const COLLECTIONS_QUERY = `*[
  _type == "collectionOrb"
  && defined(slug.current)
  ]|order(createdAt desc)[0...3]{_id, _updatedAt, title, slug, publishedAt, image, description}`; //fix range field

const STORY_QUERY = `*[
  _type == "story"
  && defined(slug.current)
  && !defined(AssociatedCollection)
  ]|order(createdAt desc){_id, _updatedAt, title, slug, publishedAt, "image": images[0], description}`;

const options = { next: { revalidate: 30 } };

const f1 = Oleo_Script({
    weight: "400",
    subsets: ["latin"]
});

const epilogue = Epilogue({
    subsets: ["latin"]
});

const sortPosts = (a: SanityDocument, b: SanityDocument) => {
  return new Date(b._updatedAt).getTime() - new Date(a._updatedAt).getTime()
}

export default async function Home() {
  const collections = await client.fetch<SanityDocument[]>(COLLECTIONS_QUERY, {}, options);
  const stories = await client.fetch<SanityDocument[]>(STORY_QUERY, {}, options);
  const posts = collections.concat(stories);
  // console.log(posts)
  const sortedPosts = posts.sort(sortPosts);
  // console.log(sortedPosts)
  var postArr: collectionPost[] = []
  sortedPosts.map((post: SanityDocument) => postArr.push({
    type: post._type,
    id: post._id,
    title: post.title,
    contributors: post.contributors,
    date: post._updatedAt,
    description: post.description,
    image: post.image,
    slug: post.slug.current
  }));

  return (
    <HomePage posts={postArr} fonts={[f1.className, epilogue.className]}/>
    // <div className = "flex flex-col items-center min-h-screen bg-black">
    //   <div className='w-full flex items-center justify-center border-b border-b-1 border-b-slate-300 mb-4'>
    //     <h1 className={`${f1.className} pl-4 antialiased text-slate-300 text-[50px] my-4 text-start cursor-pointer`}>The Tappan Square Dispatch</h1>
    //   </div>
    //   <ul className="flex flex-col gap-y-4 px-10 mx-auto max-w">
    //     {sortedPosts.map((post: SanityDocument) => (
    //       <li className="flex flex-row my-2" key={post._id}>
    //         <div className="flex flex-col flex-1 items-start">
    //           <Link className="hover:underline" href={`/${post.slug.current}`}>
    //             <h2 className="text-xl font-semibold">{post.title || "null"}</h2>
    //           </Link>
    //           {Array.isArray(post.description) && <PortableText value={post.description} />}
    //           <p>{new Date(post._updatedAt).toLocaleDateString()}</p>
    //           {/* {fix date eventually} */}
    //         </div>
    //         <img
    //           className="flex-shrink-0"
    //           src={urlFor(post.image)
    //             .width(200)
    //             .height(150)
    //             .url()}
    //           alt={post.image.alt || `Portrait of ${post.title}`}
    //         />
    //       </li>
    //     ))}
    //   </ul>
    // </div>
  )
}