'use client'

import { usePathname } from 'next/navigation'
import Link from "next/link";

export default function BackButton() {
    const pathname = usePathname()
    const pathArr = pathname.split('/');
    if (pathArr.length == 3) { //used to have other condition  && pathArr[2]=='expanded'
        return <Link className="hover:text-purple-50" href={`/${pathArr[0]}`}>←</Link>
    }
    if (pathArr.length == 2 && pathArr[1] != '') {
        return <Link className="hover:text-purple-50" href='/'>←</Link>
    }
    return <p className='opacity-0'>←</p>
}
