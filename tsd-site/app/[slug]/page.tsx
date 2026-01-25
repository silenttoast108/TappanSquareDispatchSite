import { PortableText, type SanityDocument } from "next-sanity";
import { client } from "../sanity/client";
import Link from "next/link";
import { Epilogue, Oleo_Script } from "next/font/google";

import TranscriptPage, {TPInput} from "@/components/transcriptPage";
import PlaylistPage, {storyPost} from "@/components/playlistPage";
import { title } from "process";

const epilogue = Epilogue({
    subsets: ["latin"]
})

//used for obtaining all stories in a collection
const STORIES_QUERY = `*[
 _type == "story" && AssociatedCollection->slug.current == $slug
 ]|order(_updatedAt desc) {_id, title, description, contributors, spotifyURL, images, "audioURL": audioFile.asset->url, "collection": AssociatedCollection->title, slug}`; //hopefully connection field is correctly defd

 //used for obtaining singular story that is not in a collection
const STORY_QUERY = `*[
 _type == "story" && slug.current == $slug
] {_id, _updatedAt, title, description, contributors, spotifyURL, images, "audioURL": audioFile.asset->url, script}`

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
    const collectionPosts = await client.fetch<SanityDocument>(STORIES_QUERY, await params, options);
    const story = await client.fetch<SanityDocument>(STORY_QUERY, await params, options);
    // console.log(story);
    const slug = (await params).slug

    if (!(collectionPosts.length == 0)) {//logic for clicking on a collection of stories
      var storyArr: storyPost[] = []
      collectionPosts.map((post: SanityDocument) => {
        storyArr.push({
          collection: post.collection,
          title: post.title,
          contributors: post.contributors,
          date: post._updatedAt,
          description: post.description,
          spotifyURL: post.spotifyURL,
          images: post.images,
          audioURL: post.audioURL,
          script: post.script,
          storySlug: post.slug.current
        });
      });
      return (
        <PlaylistPage 
          storyPosts={storyArr} 
          fonts={[f1.className, epilogue.className]} 
          slug={slug}        
        />
      )
    } else {//logic for clicking on a singular story
      return (
        <TranscriptPage 
          title={story[0].title} 
          date={story[0]._updatedAt} 
          script={story[0].script} 
          contributors={story[0].contributors} 
          description={story[0].description} 
          spotifyURL={story[0].spotifyURL} 
          images={story[0].images} 
          audioURL={story[0].audioURL}
        />
      )
    }
}