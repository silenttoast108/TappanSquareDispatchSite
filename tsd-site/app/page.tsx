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
  // console.log(posts)
  const sortedPosts = posts.sort(sortPosts);
  // console.log(sortedPosts)
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