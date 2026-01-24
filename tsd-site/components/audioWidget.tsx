'use client'

import TextLoop from './textloop'
import { useState, useRef, useEffect } from "react";
// import Slider from '@mui/material/slider'
// import Math from "next"
import {
    RotateCcw,
    RotateCw,
    FastForward,
    PlayIcon,
    RewindIcon,
    PauseIcon,
} from "lucide-react";

interface AWInput {
    trackArr: audioTrack[],
    font: string,
    skip: boolean
}

export interface audioTrack {
    title: string,
    contributors: string,
    src: string
}


//might need to add upload handler somewhere???
export function AudioWidget({trackArr, font, skip}: AWInput) {

    //var trackArr: audioTrack[] = [];
    var startTrack: audioTrack | null = null;

    const [isPlaying, setIsPlaying] = useState(false)//might change this if there is a way to activate widget
    const [activeTrackInd, setActiveTrackInd] = useState(0); // this should correspond to start track
    const [trackTime, setTrackTime] = useState(0); //prob should format somewhere
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement|null>(null);
    //progress?
    //time?
    
    const playPause = () => {
        if (isPlaying) {
            setIsPlaying(false);
            audioRef.current?.pause();
        } else {
            setIsPlaying(true);
            audioRef.current?.play();
        }
    }

    const cleanDivide = (v1: number, v2: number) => {
        if (v1>0 && v2>0) {
            return Math.floor(v1/v2)
        } else {
            return 0
        }
    }

    const formatTime = (time: number, dur: number) => {
        const tMinutes = cleanDivide(time, 60);
        const tSeconds = Math.floor(time % 60);
        const dMinutes = cleanDivide(dur, 60);
        const dSeconds = Math.floor(dur % 60);
        
        return `${tMinutes}:${(tSeconds<10)? '0': ''}${tSeconds}/${dMinutes}:${(dSeconds<10)? '0': ''}${dSeconds}`
    }

    const handleSlider = (_e: Event, value: number) => {
        if (audioRef.current) {
            const prog = cleanDivide(value, 100);
            const newTime = prog*duration;
            audioRef.current.currentTime = prog*duration;
            setTrackTime(prog*duration);
            setProgress(prog);
        }
    }

    const handleTimeUpdate = () => {//update progress?
        if (audioRef.current) {
            setTrackTime(audioRef.current?.currentTime);
            setProgress(trackTime/duration || 0);
        };

    }

    const handleMetaData = () => {
        if (audioRef.current) setDuration(audioRef.current.duration)//
    }

    //configured these so that first skip goes to the end of the track. Second skip actually skips
    const skipForward = () => { 
        if ((trackTime > (duration-1)) && (activeTrackInd < (trackArr.length - 1))) {
            setActiveTrackInd(activeTrackInd + 1);
            setTrackTime(0);
        } else if (audioRef.current) {//might be a good solution
            audioRef.current.currentTime = duration;
            //audioRef.current.pause();
            setTrackTime(duration);
            //if (isPlaying) audioRef.current.play();
        }
    }

    const skipBackwards = () => {
        if (trackTime < 1 && activeTrackInd > 0) {
            setActiveTrackInd(activeTrackInd - 1)
        } else if (audioRef.current) {
            audioRef.current.currentTime = 0
            setTrackTime(0);
            audioRef.current.load();//necesary???
            if (isPlaying) audioRef.current.play()
        }
    }

    const hopForward = () => {
        const newTrackTime = trackTime+15;
        if ((newTrackTime > duration) && audioRef.current) {
            //console.log(audioRef.current.currentTime);
            setTrackTime(duration);
            audioRef.current.currentTime = duration;
        } else if (audioRef.current) {
            setTrackTime(newTrackTime)
            audioRef.current.currentTime = newTrackTime;
        }
    }

    const hopBackward = () => {
        const newTrackTime = trackTime-15;
        if ((newTrackTime < 0) && audioRef.current) {
            setTrackTime(0);
            audioRef.current.currentTime = 0;
        } else if (audioRef.current) {
            setTrackTime(newTrackTime);
            audioRef.current.currentTime = newTrackTime;
        }
    }

    useEffect(() => {//might need to set ref.current.currentTime to 0
        console.log('useEffect Invoked');
        if (audioRef.current) {       
            audioRef.current.pause();
            audioRef.current.src = trackArr[activeTrackInd].src;
            audioRef.current.load();
            audioRef.current.currentTime = 0; //right spot???
            if (isPlaying) audioRef.current?.play();
        }
    }, [trackArr, activeTrackInd]); //isPlaying

    //handleTimeUpdate!!
    //figure out how to add dragging capabiliyties with progress...
    //rember to initialize audioRef


    return (
        <div className="flex flex-col gap-y-4 py-4 w-full items-center justify-center mx-auto">  
            <div className="grid grid-cols-5 gap-x-4">
                {/* <h1 className={`col-span-2 text-xl whitespace-nowrap overflow-hidden ${font}`}>{trackArr[activeTrackInd].title}</h1> */}
                <TextLoop message = {trackArr[activeTrackInd].title} font={font} />       
                <h2 className={`justify-self-center bg-[#02021C]${font}`}>{formatTime(trackTime, duration)}</h2>
                <TextLoop message = {`${trackArr[activeTrackInd].contributors}`} font={font} />
                {/* <h1 className={`col-span-2 text-xl whitespace-nowrap overflow-hidden ${font}`}>{trackArr[activeTrackInd].contributors}</h1> */}
            </div>
            {/* solve at a later date <Slider size='small' aria-label="Volume" value={progress*100} onChange={handleSlider} /> */}
            <progress className="w-7/8 mx-40 h-[5px] [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-900 [&::-webkit-progress-value]:bg-slate-300 [&::-moz-progress-bar]:bg-purple-300" value={progress}></progress>
            <div className="flex flex-row gap-x-6 hover:cursor-pointer items-center">
                <div onClick={hopBackward} className="flex flex-row gap-x-2 text-sm select-none items-center">
                    <h2 className={`${font} text-m`}>15</h2>
                    <RotateCcw />
                </div>
                {skip? <h2 onClick={skipBackwards} className="text-md"><RewindIcon /></h2> : <></>}
                <div className="p-4 rounded-full bg-[#F8E663]">
                    <h2 onClick={playPause} className="text-lg font-bold">{isPlaying? <PauseIcon className='text-black strokeWidth-[3]'/>: <PlayIcon className='text-black strokeWidth-[3]'/>}</h2>
                </div>
                {skip? <h2 onClick={skipForward} className="text-md"><FastForward /></h2> : <></>}
                <div onClick={hopForward} className="flex flex-row gap-x-2 text-sm select-none items-center">
                    <RotateCw />
                    <h2 className={`${font} text-m`}>15</h2>
                </div>
                <audio ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleMetaData}>
                </audio>
            </div>
        </div>
    )
}