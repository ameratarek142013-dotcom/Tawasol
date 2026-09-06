import React from 'react'

export default function ApiError({error}) {
  const message = typeof error === 'string' ? error : error?.message

  return (
    <div role="alert" className="flex h-lvh w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-rose-200 bg-white shadow-xl shadow-rose-950/5 dark:border-rose-500/20 dark:bg-[#151B27] dark:shadow-black/20">
        <div className="h-1.5 bg-linear-to-r from-rose-500 via-pink-500 to-purple-500" />
        <div className="flex flex-col items-center px-6 py-8 text-center sm:px-9">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-3xl font-bold text-rose-500 ring-8 ring-rose-50/70 dark:bg-rose-500/10 dark:ring-rose-500/5">
            !
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Something went wrong</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {message || "We couldn't load this content. Please check your connection and try again."}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:scale-[1.02] hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-[#151B27]"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )
}
