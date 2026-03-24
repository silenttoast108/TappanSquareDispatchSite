import { type SanityDocument } from "next-sanity";
import { client } from "../sanity/client";
import { Epilogue, Oleo_Script } from "next/font/google";

import TranscriptPage, {TPInput} from "@/components/transcriptPage";
import PlaylistPage, {storyPost} from "@/components/playlistPage";
import Contact from "@/components/contact";

//used for obtaining all stories in a collection
const STORIES_QUERY = `*[
 _type == "story" && AssociatedCollection->slug.current == $slug
 ]|order(date desc) {_id, title, description, contributors, spotifyURL, image, "audioURL": audioFile.asset->url, "collection": AssociatedCollection->title, slug, date}`; //hopefully connection field is correctly defd

 //used for obtaining singular story that is not in a collection
const STORY_QUERY = `*[
 _type == "story" && slug.current == $slug
] {_id, title, description, contributors, spotifyURL, image, "audioURL": audioFile.asset->url, script, date}`

const options = { next: { revalidate: 30 } };

const f1 = Oleo_Script({
  weight: "400",
  subsets: ["latin"]
});

const epilogue = Epilogue({
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

    if (collectionPosts.length != 0) {//logic for clicking on a collection of stories
      var storyArr: storyPost[] = []
      collectionPosts.map((post: SanityDocument) => {
        storyArr.push({
          collection: post.collection,
          title: post.title,
          contributors: post.contributors,
          date: new Date(post.date).toLocaleDateString(),
          description: post.description,
          spotifyURL: post.spotifyURL,
          image: post.image,
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
    } else if (story.length != 0) {//logic for clicking on a singular story
      return (
        <TranscriptPage 
          title={story[0].title} 
          date={new Date(story[0].date).toLocaleDateString()} 
          script={story[0].script} 
          contributors={story[0].contributors} 
          description={story[0].description} 
          spotifyURL={story[0].spotifyURL} 
          image={story[0].image} 
          audioURL={story[0].audioURL}
        />
      )
    } else {
      return(
        <Contact slug={slug} fonts={[f1.className, epilogue.className]} />
      )
    }
}