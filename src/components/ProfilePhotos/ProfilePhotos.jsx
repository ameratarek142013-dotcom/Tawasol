import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { getProfilePosts } from '../../api/GetProfilePosts.api'
import { getUserProfile } from '../../api/GetUserProfile.api'
import ApiError from '../ApiError/ApiError'
import Loading from '../Loading/Loading'

export default function ProfilePhotos() {
  const { id: paramId } = useParams()
  const id = paramId || localStorage.getItem('userId')

  const { data: profileUser, isLoading: isProfileLoading, isError: isProfileError, error: profileError } = useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => getUserProfile(id),
    enabled: !!id,
    select: (response) => response?.data?.data?.user,
  })

  const { data: profilePosts, isLoading: arePostsLoading, isError: arePostsError, error: postsError } = useQuery({
    queryKey: ['profilePosts', id],
    queryFn: () => getProfilePosts(id),
    enabled: !!id,
    select: (response) => response?.data?.data?.posts || [],
  })

  if (isProfileLoading || arePostsLoading) {
    return <Loading />
  }

  if (isProfileError) {
    return <ApiError error={profileError} />
  }

  if (arePostsError) {
    return <ApiError error={postsError} />
  }

  const photos = profilePosts.filter((post) => post.image)

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-24 text-slate-900 transition-colors dark:bg-[#0b0e14] dark:text-slate-100 sm:px-6">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-[#151b27] dark:shadow-black/20">
        <div className="flex flex-col gap-6 border-b border-slate-200 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 dark:border-slate-800">
          <div>
            <Link
              className="mb-3 inline-flex items-center text-sm font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              to={id ? `/profile/${id}` : '/home'}
            >
              <span aria-hidden="true" className="mr-2 text-lg">&larr;</span>
              Back to profile
            </Link>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {profileUser?.name ? `${profileUser.name}'s photos` : 'Photos'}
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
            </p>
          </div>
          <img
            className="h-16 w-16 rounded-2xl border-2 border-white object-cover shadow-lg dark:border-slate-700"
            src={profileUser?.photo}
            alt={profileUser?.name}
          />
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:gap-3 sm:p-5 lg:grid-cols-4">
            {photos.map((post) => (
              <img
                key={post._id}
                className="aspect-square w-full rounded-xl object-cover transition duration-300 hover:scale-[1.02] hover:shadow-lg"
                src={post.image}
                alt={`${profileUser?.name}'s post`}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-64 items-center justify-center px-6 text-center text-sm text-slate-500 dark:text-slate-400">
            No photos yet...
          </div>
        )}
      </section>
    </main>
  )
}
