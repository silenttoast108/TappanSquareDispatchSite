import { type SanityDocument } from "next-sanity";
import { client } from "../../sanity/client";
import {audioTrack} from "@/components/audioWidget";
import TranscriptPage from "@/components/transcriptPage";

const STORIES_QUERY = `*[
 _type == "story" && AssociatedCollection->slug.current == $slug
 ]|order(date desc) {_id, date, title, contributors, "audioURL": audioFile.asset->url}`;

const STORY_QUERY = `*[
 _type == "story" && slug.current == $slug2
] {_id, date, title, description, contributors, spotifyURL, image, "audioURL": audioFile.asset->url, script}`

const options = { next: { revalidate: 30 } };

export default async function storiesPage({
  params,
}: {
  params: Promise<{ slug2: string }>;
}) {
    const collectionPosts = await client.fetch<SanityDocument>(STORIES_QUERY, await params, options);
    const story = await client.fetch<SanityDocument>(STORY_QUERY, await params, options);
    // console.log(story);
    // const slug2 = (await params).slug2

      var trackArr: audioTrack[] = [];
      collectionPosts.map((post: SanityDocument) => {
        trackArr.push({
          title: post.title,
          contributors: post.contributors,
          src: post.audioURL
        });
      });
      
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
    }