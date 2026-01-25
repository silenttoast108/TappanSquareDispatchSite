import { useRef, useState, useLayoutEffect } from "react";
import { useWindowSize } from '@/utils/updateWindowHook';
//should update animation automatically... output is not meant to affect styling attributes of dive container

interface TLInput {
    message: string,
    font: string,
}
export default function TextLoop({message, font}: TLInput) {
  const [isOverflowing, setIsOverflowing] = useState(false);//not sure if this is allowed
  const [_size, setSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const sizeStr = useWindowSize();
  // setSize(useWindowSize());

  useLayoutEffect(() => {
    if (textRef.current && containerRef.current) {
      setIsOverflowing(textRef.current?.offsetWidth > containerRef.current.offsetWidth)
    }
    setSize(sizeStr)
  }, [message, sizeStr]); //used to have size dep. took away from too many re-renders


  return (
    <div ref={containerRef} className={`group flex ${font} col-span-2 h-[1.5em] ${isOverflowing
      ? '[mask-image:linear-gradient(to_right,transparent,black_5%,black_90%,transparent)] justify-start'
      : 'justify-center'}`}>
      { isOverflowing
      ? <div className={`group-hover:animate-text-slide flex flex-row items-start leading-[1.5em] bg-[#02021C]`}>
          <span ref={textRef} className='ml-6 whitespace-nowrap'>{message}</span>
          <span className='ml-6 whitespace-nowrap'>{message}</span>  
        </div>
      : <div className="">
          <span ref={textRef} className={`whitespace-nowrap`}>{message}</span>
        </div> 
        }
    </div>
  );
}