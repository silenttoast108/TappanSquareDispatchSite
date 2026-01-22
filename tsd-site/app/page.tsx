//import Image from "next/image";
import { Oleo_Script } from "next/font/google";
import Link from "next/link";
import {PortableText, type SanityDocument } from "next-sanity";
import {urlFor} from "./sanity/sanityImageUrl";

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
    //variable: "--font-epilogue",
    weight: "400",
    subsets: ["latin"]
});

const sortPosts = (a: SanityDocument, b: SanityDocument) => {
  return new Date(b._updatedAt).getTime() - new Date(a._updatedAt).getTime()
}

export default async function Home() {
  const collections = await client.fetch<SanityDocument[]>(COLLECTIONS_QUERY, {}, options);
  const stories = await client.fetch<SanityDocument[]>(STORY_QUERY, {}, options);
  const posts = collections.concat(stories);
  console.log(posts)
  const sortedPosts = posts.sort(sortPosts);
  console.log(sortedPosts)
  return (
    <div className = "flex flex-col items-center min-h-screen bg-black">
      <Link href='/' className = {`${f1.className} my-8 antialiased text-purple-100 text-[50px]`}>
        The Tappan Square Dispatch
      </Link>
      <ul className="flex flex-col gap-y-4 px-10 mx-auto max-w">
        {sortedPosts.map((post: SanityDocument) => (
          <li className="flex flex-row my-2" key={post._id}>
            <div className="flex flex-col flex-1 items-start">
              <Link className="hover:underline" href={`/${post.slug.current}`}>
                <h2 className="text-xl font-semibold">{post.title || "null"}</h2>
              </Link>
              {Array.isArray(post.description) && <PortableText value={post.description} />}
              <p>{new Date(post._updatedAt).toLocaleDateString()}</p>
              {/* {fix date eventually} */}
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
        ))}
      </ul>
    </div>
  )
}

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }
