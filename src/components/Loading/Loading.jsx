import React from 'react'

export default function Loading({ message = 'Loading your space...' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-lvh w-full flex-col items-center justify-center gap-5 px-4 text-center"
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        <span className="absolute h-20 w-20 animate-ping rounded-full bg-purple-500/15" />
        <span className="absolute h-16 w-16 rounded-full border-2 border-purple-200 dark:border-purple-500/25" />
        <span className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500 border-r-purple-500 dark:border-slate-700 dark:border-t-indigo-400 dark:border-r-pink-400" />
        <span className="absolute h-3 w-3 rounded-full bg-linear-to-br from-indigo-500 to-pink-500 shadow-lg shadow-purple-500/40" />
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{message}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Just a moment while we get things ready.</p>
      </div>
      <span className="sr-only">Loading</span>
    </div>
  )
}
