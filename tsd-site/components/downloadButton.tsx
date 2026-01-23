'use client'

import { Download } from 'lucide-react'
import Link from 'next/link'

const handleClick = () => {

}

export default function DownloadButton(audioURL: string) {

    return (
        <Link href={audioURL}>{`${Download} Download MP3`}</Link>
    )
}