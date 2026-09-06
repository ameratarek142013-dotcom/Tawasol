import React from 'react'
import SuggestedFriendsList from './SuggestedFriendsList'

export default function RightSidebar() {

  const events = [
    {
      id: 1,
      month: 'MAY',
      day: '24',
      title: 'React Summit 2024',
      date: 'May 24 - May 26',
      location: 'Cairo, Egypt',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 2,
      month: 'JUN',
      day: '10',
      title: 'Design Thinking Workshop',
      date: 'June 10 - June 11',
      location: 'Online Event',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 3,
      month: 'JUN',
      day: '18',
      title: 'Tech Talk: AI Revolution',
      date: 'June 18, 7:00 PM',
      location: 'Alexandria, Egypt',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=200&q=80',
    },
  ]

  const trends = [
    {
      tag: '# ReactJS',
      posts: '12.5K posts',
      color: '#8B5CF6',
      path: 'M2 18 C 12 18, 20 6, 32 14 C 44 20, 52 4, 68 2',
    },
    {
      tag: '# WebDevelopment',
      posts: '8.7K posts',
      color: '#38BDF8',
      path: 'M2 16 C 14 16, 22 8, 34 10 C 46 12, 54 4, 68 4',
    },
    {
      tag: '# UI/UXDesign',
      posts: '6.3K posts',
      color: '#10B981',
      path: 'M2 17 C 16 17, 24 11, 36 12 C 48 13, 56 6, 68 3',
    },
    {
      tag: '# ArtificialIntelligence',
      posts: '5.2K posts',
      color: '#F59E0B',
      path: 'M2 19 C 14 18, 24 13, 36 15 C 48 16, 56 7, 68 2',
    },
  ]

  return (
    <aside className="w-72 2xl:w-80 shrink-0 hidden lg:flex flex-col gap-4 select-none">
      {/* 1. Suggested Friends Card */}
      <SuggestedFriendsList limit={6} />

      {/* 2. Upcoming Events Card */}
      <div className="bg-white dark:bg-[#141A26] border border-slate-200 dark:border-[#222B3E] rounded-2xl p-4 flex flex-col gap-3.5 shadow-xs transition-colors duration-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Upcoming Events</h3>
          <button className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition cursor-pointer">
            See All
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between gap-3">
              {/* Calendar Date Block */}
              <div className="bg-slate-100 dark:bg-[#1C2333] border border-slate-200 dark:border-[#273248] rounded-xl px-2.5 py-1.5 flex flex-col items-center justify-center shrink-0 min-w-12.5 shadow-xs">
                <span className="text-[10px] font-bold text-rose-500 tracking-wider leading-tight">
                  {event.month}
                </span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white leading-none mt-0.5">
                  {event.day}
                </span>
              </div>

              {/* Event Details */}
              <div className="flex-1 flex flex-col truncate text-left">
                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">{event.title}</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate">{event.date}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-500 truncate">{event.location}</span>
              </div>

              {/* Event Image */}
              <img
                src={event.image}
                alt={event.title}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700/60"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Trending Topics Card */}
      <div className="bg-white dark:bg-[#141A26] border border-slate-200 dark:border-[#222B3E] rounded-2xl p-4 flex flex-col gap-3.5 shadow-xs transition-colors duration-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Trending Topics</h3>
          <button className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition cursor-pointer">
            See All
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {trends.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <div className="flex flex-col text-left">
                <span
                  style={{ color: item.color }}
                  className="text-xs font-semibold hover:underline cursor-pointer tracking-wide"
                >
                  {item.tag}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.posts}</span>
              </div>

              {/* Sparkline Neon Chart */}
              <div className="w-18 h-6 flex items-center justify-end">
                <svg width="70" height="24" viewBox="0 0 70 24" fill="none" className="overflow-visible">
                  <path
                    d={item.path}
                    stroke={item.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-sm"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}