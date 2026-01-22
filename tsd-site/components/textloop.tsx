import { useRef, useState, useLayoutEffect } from "react";

interface TLInput {
    message: string,
    font: string,
}
// [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]
export default function TextLoop({message, font}: TLInput) {
  const [isOverflowing, setIsOverflowing] = useState(false);//not sure if this is allowed
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (textRef.current && containerRef.current) {
      setIsOverflowing(textRef.current?.offsetWidth > containerRef.current.offsetWidth)
    }
  }, [message]);

  return (
    <div ref={containerRef} className={`group flex ${font} col-span-2 h-[1.5em] [mask-image:linear-gradient(to_right,transparent,black_5%,black_90%,transparent)]`}>
      { isOverflowing
      ? <div className={`group-hover:animate-text-slide flex flex-row items-start leading-[1.5em] bg-[#02021C]`}>
          <span ref={textRef} className='ml-6 whitespace-nowrap'>{message}</span>
          <span className='ml-6 whitespace-nowrap'>{message}</span>  
        </div>
      : <div className="pl-[30%] flex w-full jusitfy-center items-center">
        {/* {find better fix for this} */}
          <span ref={textRef} className='whitespace-nowrap'>{message}</span>
        </div> }
    </div>
  );
}