'use client';
import { useState } from 'react';
import { Share2 } from 'lucide-react'

export default function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tappan Square Dispatch',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative inline-block">
      <button 
        onClick={handleShare}
        className="flex items-center gap-2 hover:cursor-pointer"
      >
        <Share2/>
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-white text-black p-4 rounded-lg shadow-xl z-50">
          <ul className="flex flex-col gap-2">
            <li className="hover:text-purple-600 cursor-pointer">Copy Link</li>
            <li className="hover:text-purple-600 cursor-pointer">Twitter/X</li>
            <li className="hover:text-purple-600 cursor-pointer">Email</li>
          </ul>
        </div>
      )}
    </div>
  );
}