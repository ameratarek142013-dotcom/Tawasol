import React from 'react'
import { Link } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import SuggestedFriendsList from '../Home/SuggestedFriendsList'

export default function FollowerSuggetions() {
  return (
    <div className="h-lvh bg-slate-100 dark:bg-[#0B0E14] text-slate-900 dark:text-slate-100 flex justify-center px-4 py-6 transition-colors duration-200">
      <div className="w-full max-w-lg flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Link
            to="/home"
            aria-label="Back"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#1E2638] transition"
          >
            <IoArrowBack className="text-lg" />
          </Link>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Suggested Friends</h1>
        </div>

        <SuggestedFriendsList title="All Suggestions" showSeeAll={false} />
      </div>
    </div>
  )
}