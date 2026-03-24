import { FaInstagram, FaSpotify } from 'react-icons/fa';
import { Mail } from "lucide-react"

interface CInput {
    fonts: string[]
    slug: string
}

export default function contactPage({fonts, slug}: CInput) {
    if (slug == "con") {
        return (
            <main className="flex justify-center items-center min-h-screen bg-black">
                <div className="relative w-90 max-w-100 h-70">
                    <div className="grid grid-cols-7 gap-4 z-1 w-full h-full">
                        <span className="col-span-2 border-l-2 border-y-2 border-purple-300"></span>
                        <span className="col-span-3"></span>
                        <span className="col-span-2 border-r-2 border-y-2 border-purple-300"></span>
                    </div>
                    <div className={`${fonts[1]} absolute inset-0 flex flex-col items-center justify-center px-[14%] gap-y-2 h-70`}>
                        <h2 className={`${fonts[0]} font-bold text-[35px]`}>Contact Us!</h2>
                        <hr className="w-full border border-purple-300 border-0.5 mb-5"/>
                        <div className="flex flex-row gap-4">
                            <a href="https://www.instagram.com/thetappansquaredispatch">
                                <FaInstagram size={60} className="bg-gradient-to-b from-purple-500 to-[#E4405F] rounded-xl"/>
                            </a> 
                            <a href="https://open.spotify.com/show/4HTcyYEqPjS5P9m2gOUq81?si=074687073a46443a">
                                <FaSpotify size={60} color={'#1DB954'} className="rounded-xl"/>
                            </a> 
                            {/* bg-[#1DB954] */}
                            <a href="tappansquaredispatch@gmail.com">
                                {/* need to figure out gmail link */}
                                <Mail size={60} className="rounded-xl  bg-[#1DA1F2]"/>
                            </a> 
                        </div>
                    </div>
                </div>
            </main>
        )
    }
    if (slug == "atr") {
        return (
            <main className="flex justify-center items-center min-h-screen bg-black">
                <div className="relative w-90 max-w-100 h-75">
                    <div className="grid grid-cols-7 gap-4 z-1 w-full h-full">
                        <span className="col-span-2 border-l-2 border-y-2 border-purple-300"></span>
                        <span className="col-span-3"></span>
                        <span className="col-span-2 border-r-2 border-y-2 border-purple-300"></span>
                    </div>
                    <div className={`${fonts[1]} absolute inset-0 flex flex-col items-center justify-center px-[14%] gap-y-2 h-75`}>
                        {/* <div className="bg-transparent p-6 color-slate-300"> */}
                            <h2 className={`text-center`}>This website was created by Ben Giesen OC '26</h2>
                            <hr className="w-full border border-purple-300 border-0.5"/>
                            <p className="text-center">
                                The development of this website would not have been possible without the help of professor Jan Cooper. Thank you for the 40+ years of work you have dedicated to helping journalism students at Oberlin find their niche
                            </p>
                        {/* </div> */}
                    </div>
                </div>
            </main>
        )
    } else {
        return (
            <></>
        )
    }
}