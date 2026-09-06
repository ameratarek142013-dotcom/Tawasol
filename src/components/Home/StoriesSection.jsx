import React, { useRef } from 'react'
import { IoAdd, IoChevronForward } from 'react-icons/io5'

export default function StoriesSection() {
  const scrollRef = useRef(null)

 const stories = [
  {
    id: 1,
    name: 'Hana Ali',
    time: '2h ago',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bgImage: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    name: 'Omar Tarek',
    time: '4h ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    name: 'Salma Mohamed',
    time: '6h ago',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    bgImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    name: 'Youssef Maher',
    time: '8h ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    name: 'Mariam Hassan',
    time: '10h ago',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    bgImage: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    name: 'Ahmed Khaled',
    time: '12h ago',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80',
    bgImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 7,
    name: 'Nour Adel',
    time: '14h ago',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80',
    bgImage: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 8,
    name: 'Karim Mostafa',
    time: '16h ago',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    bgImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 9,
    name: 'Laila Samir',
    time: '18h ago',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80',
    bgImage: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 10,
    name: 'Adam Ehab',
    time: '20h ago',
    avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=200&q=80',
    bgImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
  },
];


  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto  scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Create Story Card */}
        <div className="relative shrink-0 w-28 sm:w-32 h-44 sm:h-52 rounded-2xl overflow-hidden cursor-pointer group shadow-md transition-transform duration-200 hover:scale-[1.02] bg-linear-to-b from-[#2563EB] via-[#6366F1] to-[#A855F7] p-3 flex flex-col justify-between">
          <div className="flex-1 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/95 text-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <IoAdd className="text-2xl font-bold" />
            </div>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-white text-center drop-shadow-sm pb-1">
            Create Story
          </span>
        </div>

        {/* Friend Story Cards */}
        {stories.map((story) => (
          <div
            key={story.id}
            className="relative shrink-0 w-28 sm:w-32 h-44 sm:h-52 rounded-2xl overflow-hidden cursor-pointer group shadow-md transition-transform duration-200 hover:scale-[1.02] border  dark:border-[#222B3E] border-slate-200"
          >
            {/* Background Scenery Image */}
            <img
              src={story.bgImage}
              alt={story.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-90"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/85" />

            {/* Top Centered Avatar with Purple Ring */}
            <div className="absolute top-3 inset-x-0 flex justify-center z-10">
              <div className="relative w-9 h-9 rounded-full p-0.5 bg-linear-to-tr from-purple-500 to-fuchsia-500 shadow-lg">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-full h-full rounded-full object-cover border border-[#0B0E14]"
                />
              </div>
            </div>

            {/* Bottom Author Info */}
            <div className="absolute bottom-2.5 inset-x-2 z-10 flex flex-col text-left">
              <span className="text-xs sm:text-sm font-semibold text-white drop-shadow-md truncate">
                {story.name}
              </span>
              <span className="text-[10px] text-slate-300 font-medium drop-shadow-xs">
                {story.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Right Arrow Button */}
      <button
        onClick={handleScrollRight}
        aria-label="Next stories"
        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full  dark:bg-[#161D2B]/90 bg-white/90 hover:bg-slate-600  dark:text-white text-slate-800 border  dark:border-[#222B3E] border-slate-300 flex items-center justify-center shadow-xl transition-all hover:scale-105 cursor-pointer backdrop-blur-xs hover:text-white"
      >
        <IoChevronForward className="text-base" />
      </button>
    </div>
  )
}
