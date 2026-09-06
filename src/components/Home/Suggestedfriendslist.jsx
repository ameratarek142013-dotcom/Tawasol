import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import { FaSpinner } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { followUsers } from '../../api/FollowUsers.api'
import { getFollowSuggetions } from '../../api/GetFollowSuggetions.api'

export default function SuggestedFriendsList({ limit, showSeeAll = true, title = 'Suggested Friends' }) {
  const queryClient = useQueryClient()
  const [dismissedIds, setDismissedIds] = useState([])

  const { data, isLoading, isError } = useQuery({
    queryKey: ['suggestions'],
    queryFn : getFollowSuggetions ,
    select: (data) => data?.data?.data?.suggestions
  })

  const visibleSuggestions = data
    ?.filter((friend) => !dismissedIds.includes(friend._id))
    ?.slice(0, limit)

  const { isPending, mutate, variables } = useMutation({
    mutationFn: (userId) => followUsers(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] })
    }
  })

  function handleDismiss(friendId) {
    setDismissedIds((prev) => [...prev, friendId])
  }

  return (
    <div className="bg-white dark:bg-[#141A26] border border-slate-200 dark:border-[#222B3E] rounded-2xl p-4 flex flex-col gap-3.5 shadow-xs transition-colors duration-200">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">{title}</h3>
        {showSeeAll && (
          <Link
            to={'/followsuggetions'}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition cursor-pointer"
          >
            See All
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {isLoading && (
          <p className="text-xs text-slate-400 text-center py-2">Loading suggestions...</p>
        )}

        {isError && (
          <p className="text-xs text-rose-400 text-center py-2">Couldn't load suggestions.</p>
        )}

        {visibleSuggestions?.map((friend) => (
          <div key={friend._id} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={friend.photo}
                alt={friend.name}
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700/60"
              />
              <div className="flex flex-col truncate text-left">
                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">{friend.name}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{friend.followersCount} followers</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => mutate(friend._id)}
                disabled={isPending && variables === friend._id}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50 ${
                  friend.isAdded
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    : 'bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs'
                }`}
              >
                {isPending && variables === friend._id ? <FaSpinner className="animate-spin" /> : 'Follow'}
              </button>
              <button
                onClick={() => handleDismiss(friend._id)}
                aria-label="Dismiss friend suggestion"
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-[#1E2638] transition cursor-pointer"
              >
                <IoCloseOutline className="text-base" />
              </button>
            </div>
          </div>
        ))}

        {!isLoading && !isError && visibleSuggestions?.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-2">No suggestions right now.</p>
        )}
      </div>
    </div>
  )
}