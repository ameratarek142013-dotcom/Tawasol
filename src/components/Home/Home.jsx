import { useQuery } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllPosts } from '../../api/getAllPosts.api'
import PostCard from '../PostCard/PostCard'
import Loading from '../Loading/Loading'
import ApiError from '../ApiError/ApiError'
import PostCreation from '../PostCreation/PostCreation'
import { getProfile } from '../../api/GetProfile.api'
import LeftSidebar from './LeftSidebar'
import TopHeader from './TopHeader'
import StoriesSection from './StoriesSection'
import RightSidebar from './RightSidebar'
import { getHomeFeeds } from '../../api/GetHomeFeed.api'
import { getBookMarkes } from '../../api/GetBookmarkes.api'

export default function Home() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedFeed, setSelectedFeed] = useState('home') // 'home' | 'feeds'

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['allPosts'],
    queryFn: getAllPosts,
    select: (data) => data?.data?.data?.posts
  })

  console.log(data);
  

  const { data: userData } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    select: (data) => data?.data?.data?.user
  })

  const { data: feedsData } = useQuery({
    queryKey: ['homeFeeds'],
    queryFn: () => getHomeFeeds(),
    select: (data) => data?.data?.data?.posts
  })

  console.log(feedsData);


  const {data : dataBookmarks} = useQuery({
    queryKey : ['bookmarkes'],
    queryFn : getBookMarkes,
    select: (data) => data?.data?.data?.bookmarks
  })
  console.log(dataBookmarks);
  
  

  const currentPosts = useMemo(() => {
    if (selectedFeed === 'feeds') {
      return feedsData
    }
    if (selectedFeed === 'saved') {
      return dataBookmarks
    }
    else return data
  }, [selectedFeed, data, feedsData ,dataBookmarks])

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) return currentPosts

    return currentPosts.filter((post) => {
      const searchableContent = [
        post?.body,
        post?.user?.name,
        post?.user?.username,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableContent.includes(normalizedQuery)
    })
  }, [currentPosts, normalizedQuery])

  const matchingPeople = useMemo(() => {
    if (!normalizedQuery) return []

    const people = new Map()

    currentPosts.forEach((post) => {
      const user = post?.user
      const userId = user?._id || user?.id
      const userName = user?.name || user?.username

      if (userId && userName?.toLowerCase().includes(normalizedQuery)) {
        people.set(userId, user)
      }
    })

    return Array.from(people.values()).slice(0, 6)
  }, [currentPosts, normalizedQuery])

  if (isLoading) {
    return (
      <div className="min-h-screen dark:bg-[#0B0E14] bg-slate-100 flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-[#0B0E14] dark:text-slate-100">
        <TopHeader userData={userData} onOpenCreatePost={() => {}} />
        <main className="flex min-h-screen items-center justify-center p-4">
          <ApiError error={error.message} />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0B0E14] text-slate-900 dark:text-slate-100 flex font-sans antialiased selection:bg-purple-600 selection:text-white transition-colors duration-200">
      <LeftSidebar
        userData={userData}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={() => setIsSidebarOpen(false)}
        setSelectedFeed={setSelectedFeed}
      />

      <div className="flex-1 flex flex-col min-w-0 max-w-full overflow-hidden">
        <TopHeader
          userData={userData}
          onOpenCreatePost={() => setIsCreatePostOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsSidebarOpen={() => setIsSidebarOpen(true)}
        />

        <div className="flex-1 w-full flex justify-center items-start gap-6 px-3 sm:px-6 xl:px-8 py-3 overflow-y-auto overflow-x-hidden min-w-0">
          <main className="w-full max-w-155 2xl:max-w-165 min-w-0 flex flex-col gap-4 shrink">
            {!normalizedQuery && (
              <>
                <PostCreation
                  userData={userData}
                  isOpenProp={isCreatePostOpen}
                  onOpenChangeProp={setIsCreatePostOpen}
                />

                <StoriesSection />
              </>
            )}

            <div className="flex flex-col w-full min-w-0">
              {normalizedQuery && (
                <div className="mb-3 flex items-center justify-between px-1">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Search results for <span className="text-indigo-600 dark:text-purple-400">"{searchQuery.trim()}"</span>
                  </p>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{matchingPeople.length + filteredPosts.length} found</span>
                </div>
              )}

              {matchingPeople.length > 0 && (
                <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-[#222B3E] dark:bg-[#151B27]">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">People</h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{matchingPeople.length} matching</span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {matchingPeople.map((person) => {
                      const personId = person._id || person.id
                      const personName = person.name || person.username

                      return (
                        <Link
                          key={personId}
                          to={`/profile/${personId}`}
                          className="flex items-center gap-3 rounded-xl border border-slate-200 p-2.5 transition hover:border-purple-300 hover:bg-purple-50/60 dark:border-slate-700 dark:hover:border-purple-500/40 dark:hover:bg-purple-500/10"
                        >
                          <img
                            src={person.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                            alt={personName}
                            className="h-10 w-10 rounded-full border border-purple-500/30 object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold capitalize text-slate-800 dark:text-white">{personName}</p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">View profile</p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )}

              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id || post._id}
                  post={post}
                  userData={userData}
                />
              ))}

              {normalizedQuery && filteredPosts.length === 0 && matchingPeople.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-[#151B27]">
                  <p className="text-base font-semibold text-slate-800 dark:text-white">No matching posts or people</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try a different post word or author name.</p>
                </div>
              )}
            </div>
          </main>

          <RightSidebar />
        </div>
      </div>
    </div>
  )
}