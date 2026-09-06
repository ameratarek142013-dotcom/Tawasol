import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../Context/UserContext'
import { useTheme } from '../../Context/ThemeContext'
import { 
  IoSearchOutline, 
  IoAdd, 
  IoChatbubblesOutline, 
  IoNotificationsOutline, 
  IoChevronDown,
  IoClose,
  IoSunnyOutline,
  IoMoon
} from 'react-icons/io5'
import { RiMenuSearchLine } from 'react-icons/ri'

export default function TopHeader({ userData, onOpenCreatePost, searchQuery, setSearchQuery, setIsSidebarOpen }) {
  const { setUserToken } = useContext(UserContext)
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  function handleSignOut() {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userId')
    if (setUserToken) setUserToken(null)
    navigate('/login')
  }

  const userName = userData?.name || 'Amira T.'
  const userPhoto = userData?.photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'

  return (
    <header className="sticky top-0 z-20 h-18 px-4 sm:px-6 flex items-center justify-between border-b border-slate-200 dark:border-[#1E2536] bg-white/90 dark:bg-[#0B0E14]/90 backdrop-blur-md transition-colors duration-200">
       {/*toggle menu*/}
        <button
          onClick={setIsSidebarOpen}
          aria-label="toggle menu"
          className="w-9 h-9 rounded-xl me-2 lg:hidden  dark:bg-[#141A26] bg-slate-100 border  dark:border-[#222B3E] border-slate-200  dark:text-slate-300 text-slate-700  dark:hover:text-white hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
        >
          <RiMenuSearchLine className="text-xl" />
          
        </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center">
          <IoSearchOutline className="absolute left-4 text-lg text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts or people..."
            className="w-full  dark:bg-[#131926] bg-slate-100  dark:text-slate-200 text-slate-800 placeholder-slate-400 text-sm rounded-full pl-11 pr-11 py-2.5 border  dark:border-[#222B3E] border-slate-200 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-[#222B3E] dark:hover:text-white"
            >
              <IoClose className="text-lg" />
            </button>
          )}
        </div>
      </div>

      {/* Right Header Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Quick Theme Toggle Button (Mobile / Header) */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-9 h-9 rounded-full ms-2  dark:bg-[#141A26] bg-slate-100 border  dark:border-[#222B3E] border-slate-200  dark:text-slate-300 text-slate-700  dark:hover:text-white hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
        >
          {isDark ? (
            <IoSunnyOutline className="text-lg text-amber-400" />
          ) : (
            <IoMoon className="text-base text-purple-600" />
          )}
        </button>

        {/* Quick Create Post Plus Button */}
        <button
          onClick={onOpenCreatePost}
          aria-label="Create Post"
          className="w-9 h-9 hidden md:flex rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white  items-center justify-center shadow-md shadow-purple-950/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <IoAdd className="text-xl" />
        </button>

       
        {/* Notifications Button */}
        <button
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-full  dark:bg-[#141A26] bg-slate-100 border  dark:border-[#222B3E] border-slate-200  dark:text-slate-300 text-slate-700  dark:hover:text-white hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
        >
          <IoNotificationsOutline className="text-lg" />
          <span className="absolute -top-1 -right-1 bg-[#DB2777] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ring-2  dark:ring-[#0B0E14] ring-white">
            9+
          </span>
        </button>

        {/* User Profile Badge with Dropdown */}
        <div className="relative ml-1 sm:ml-2">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 rounded-full  dark:hover:bg-[#151C2A] hover:bg-slate-100 transition cursor-pointer"
          >
            <img
              src={userPhoto}
              alt={userName}
              className="w-8 h-8 rounded-full object-cover border border-purple-500/40"
            />
            <span className="hidden sm:inline-block text-sm font-medium  dark:text-white text-slate-900 capitalize max-w-25 truncate">
              {userName}
            </span>
            <IoChevronDown className="text-xs text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48  dark:bg-[#161D2B] bg-white border  dark:border-[#232D42] border-slate-200 rounded-xl py-2 shadow-2xl z-30 flex flex-col gap-1">
              <div className="px-3 py-1.5 border-b  dark:border-slate-800 border-slate-200 text-xs text-slate-400">
                Signed in as <span className=" dark:text-white text-slate-900 font-medium capitalize">{userName}</span>
              </div>
              <Link
                to={`/profile/${userData?.id || userData?._id}`}
                onClick={() => setShowUserMenu(false)}
                className="px-3 py-2 text-xs  dark:text-slate-300 text-slate-700  dark:hover:text-white hover:text-slate-900  dark:hover:bg-[#20293D] hover:bg-slate-100 transition"
              >
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-500  dark:hover:bg-red-950/30 hover:bg-red-100 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}