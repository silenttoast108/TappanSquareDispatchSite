import { Oleo_Script, Epilogue } from "next/font/google";
import {type SanityDocument } from "next-sanity";
import { HomePage, type collectionPost } from "../components/homepage"
import {client} from "./sanity/client";

const COLLECTIONS_QUERY = `*[
  _type == "collectionOrb"
  && defined(slug.current)
  ]|order(date desc)[0...3]{_id, title, slug, image, description, contributors, _type, date}`; //fix range field

const STORY_QUERY = `*[
  _type == "story"
  && defined(slug.current)
  && !defined(AssociatedCollection)
  ]|order(date desc){_id, title, slug, image, description, contributors, _type, date}`;

const options = { next: { revalidate: 30 } };

const f1 = Oleo_Script({
    weight: "400",
    subsets: ["latin"]
});

const epilogue = Epilogue({
    subsets: ["latin"]
});

const sortPosts = (a: SanityDocument, b: SanityDocument) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime()
}

export default async function Home() {
  const collections = await client.fetch<SanityDocument[]>(COLLECTIONS_QUERY, {}, options);
  const stories = await client.fetch<SanityDocument[]>(STORY_QUERY, {}, options);
  const posts = collections.concat(stories);
  // console.log(posts)
  const sortedPosts = posts.sort(sortPosts);
  // console.log(sortedPosts)
  var postArr: collectionPost[] = []
  sortedPosts.map((post: SanityDocument) => {
    //console.log(post._type);
    postArr.push({
    type: post._type,
    id: post._id,
    title: post.title,
    contributors: post.contributors,
    date: new Date(post.date).toLocaleDateString(),
    description: post.description,
    image: post.image,
    slug: post.slug.current
  })});

  return (
    <HomePage posts={postArr} fonts={[f1.className, epilogue.className]}/>
  )
}