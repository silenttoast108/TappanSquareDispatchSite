interface TLInput {
    message: string,
    font: string
}
// [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]
export default function TextLoop({message, font}: TLInput) {
  return (
    <div className={`group flex ${font} col-span-2 h-[1.5em] [mask-image:linear-gradient(to_right,transparent,black_5%,black_90%,transparent)]`}>
      <div className={`group-hover:animate-text-slide flex flex-row items-start leading-[1.5em] bg-[#02021C]`}>
        <span className='ml-6 whitespace-nowrap'>{message}</span>
        <span className='ml-6 whitespace-nowrap'>{message}</span>  
      </div>
      {/* <div className="group-hover:animate-loop-scroll flex whitespace-nowrap" aria-hidden="true">
        <span className='ml-6 whitespace-nowrap'>{message}</span>
        <span className='ml-6 whitespace-nowrap'>{message}</span> 
      </div> */}
    </div>
  );
}