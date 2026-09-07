import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../Context/UserContext'
import { useTheme } from '../../Context/ThemeContext'
import {
  IoHome,
  IoCompassOutline,
  IoChatbubbleEllipsesOutline,
  IoNotificationsOutline,
  IoFlagOutline,
  IoEllipsisHorizontalCircleOutline,
  IoSunnyOutline,
  IoMoon,
  IoAdd,
  IoClose
} from 'react-icons/io5'
import { HiOutlineUsers, HiOutlineUserGroup, HiOutlineBuildingStorefront } from 'react-icons/hi2'
import { BsCalendarEvent, BsThreeDots } from 'react-icons/bs'
import { FaRegBookmark, FaUser } from 'react-icons/fa6'

export default function LeftSidebar({
  userData,
  onOpenCreatePost,
  isSidebarOpen,
  setIsSidebarOpen,
  setSelectedFeed
}) {
  const { setUserToken } = useContext(UserContext)
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [activeItem, setActiveItem] = useState('Home')

  function handleSignOut() {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userId')
    if (setUserToken) setUserToken(null)
    navigate('/login')
  }

  const navItems = [
    { label: 'Home', value: 'home', icon: <IoHome className="text-xl text-indigo-400" />, to: '/home' },
    { label: 'Feeds', value: 'feeds', icon: <IoCompassOutline className="text-xl" />, to: '/home' },
    { label: 'Saved', value: 'saved', icon: <FaRegBookmark className="text-lg" />, to: '/home' },
    { label: 'Follow suggetions', value: 'follow', icon: <FaUser className="text-lg" />, to: '/followsuggetions' },
    { label: 'Events', value: 'events', icon: <BsCalendarEvent className="text-lg" />, to: '/home' },
  ]

  const userName = userData?.name || 'Amira N.'
  const userHandle = `@${(userData?.name || 'amira.n').toLowerCase().replace(/\s+/g, '')}`
  const userPhoto = userData?.photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'

  return (
    <>
      {isSidebarOpen && (
        <div
          onClick={setIsSidebarOpen}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      <aside
        className={`bg-white w-64 shrink-0 flex flex-col justify-between lg:-mt-18 h-screen fixed lg:sticky top-0 z-40 lg:z-10 px-4 py-5 border-r border-slate-200 dark:border-[#1E2536] dark:bg-[#151B27]  text-slate-900 dark:text-slate-100 select-none transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col gap-5 overflow-y-auto pr-1">
          <div className="flex items-center justify-between px-2 py-1">
            <Link to="/home" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
                <span className="text-white font-black text-xl tracking-tighter">T</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-[tajawal]">
                Tawasol
              </span>
            </Link>

            <button
              onClick={setIsSidebarOpen}
              aria-label="Close menu"
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161D2B] transition"
            >
              <IoClose className="text-lg" />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item, idx) => {
              return (
                <Link
                  key={idx}
                  to={item.to}
                  onClick={() => {
                    setActiveItem(item.label)
                    if (setSelectedFeed) setSelectedFeed(item.value)
                    if (setIsSidebarOpen) setIsSidebarOpen()
                  }}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${activeItem === item.label
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs dark:bg-linear-to-r dark:from-indigo-950/70 dark:via-purple-950/60 dark:to-purple-900/40 dark:text-white dark:border-purple-500/30 dark:shadow-purple-900/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161D2B]/80'
                    }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={activeItem === item.label ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}>
                      {item.icon}
                    </span>
                    <span className={activeItem === item.label ? 'text-indigo-900 dark:text-white font-semibold' : ''}>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`${item.badgeColor} text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t border-slate-200 dark:border-[#1A2234] mt-3">
          <div className="relative">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#141A26] border border-slate-200 dark:border-[#222B3E] hover:border-slate-400 dark:hover:border-slate-600 transition">
              <Link to={`/profile/${userData?.id || userData?._id}`} className="flex items-center gap-3 overflow-hidden">
                <img
                  src={userPhoto}
                  alt={userName}
                  className="w-9 h-9 rounded-full object-cover shrink-0 border border-purple-500/30"
                />
                <div className="flex flex-col truncate text-left">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white truncate capitalize">{userName}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{userHandle}</span>
                </div>
              </Link>

              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-[#1E2638] transition cursor-pointer"
              >
                <BsThreeDots className="text-base" />
              </button>
            </div>

            {showProfileMenu && (
              <div className="absolute bottom-14 left-0 right-0 bg-white dark:bg-[#161D2B] border border-slate-200 dark:border-[#232D42] rounded-xl p-2 shadow-2xl z-30 flex flex-col gap-1">
                <Link
                  to={`/profile/${userData?.id || userData?._id}`}
                  onClick={() => setShowProfileMenu(false)}
                  className="px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#20293D] rounded-lg transition"
                >
                  View Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 text-slate-400 pb-1">
            <IoSunnyOutline className={`text-base transition-colors ${!isDark ? 'text-amber-500 font-bold' : 'text-slate-500'}`} />
            <button
              onClick={toggleTheme}
              className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors duration-200 cursor-pointer ${isDark ? 'bg-[#6366F1] justify-end' : 'bg-slate-300 justify-start'
                }`}
              aria-label="Toggle theme"
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
            <IoMoon className={`text-sm transition-colors ${isDark ? 'text-purple-400 font-bold' : 'text-slate-400'}`} />
          </div>
        </div>
      </aside>
    </>
  )
}