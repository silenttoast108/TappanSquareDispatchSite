const Loading = ({ className }: { className?: string }) => {
  return (
    <div 
      className={`
        animate-pulse 
        rounded-md 
        bg-zinc-900 
        bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 
        bg-[length:200%_100%]
        ${className}
      `}
    />
  );
}

export default Loading;