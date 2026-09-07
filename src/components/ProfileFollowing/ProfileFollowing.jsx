import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { getUserProfile } from '../../api/GetUserProfile.api'
import ApiError from '../ApiError/ApiError'
import Loading from '../Loading/Loading'

const defaultAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'

export default function ProfileFollowing() {
  const { id: paramId } = useParams()
  const id = paramId || localStorage.getItem('userId')

  const { data: profileUser, isLoading, isError, error } = useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => getUserProfile(id),
    enabled: !!id,
    select: (response) => response?.data?.data?.user,
  })

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <ApiError error={error} />
  }

  const following = profileUser?.following || []

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-24 text-slate-900 transition-colors dark:bg-[#0b0e14] dark:text-slate-100 sm:px-6">
      <section className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-[#151b27] dark:shadow-black/20">
        <div className="border-b border-slate-200 px-5 py-6 sm:px-8 dark:border-slate-800">
          <Link
            className="mb-3 inline-flex items-center text-sm font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            to={id ? `/profile/${id}` : '/home'}
          >
            <span aria-hidden="true" className="mr-2 text-lg">&larr;</span>
            Back to profile
          </Link>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {profileUser?.name ? `${profileUser.name}'s following` : 'Following'}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {profileUser?.followingCount ?? following.length} following
          </p>
        </div>

        {following.length > 0 ? (
          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
            {following.map((person, index) => {
              const isObj = typeof person === 'object' && person !== null
              const personId = isObj ? (person._id || person.id) : person
              const personName = isObj ? (person.name || 'User') : 'User'
              const personPhoto = isObj && person.photo ? person.photo : defaultAvatar

              return (
                <Link
                  key={personId || index}
                  to={personId ? `/profile/${personId}` : '#'}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:hover:border-indigo-500/60"
                >
                  <img
                    className="h-14 w-14 rounded-full object-cover"
                    src={personPhoto}
                    alt={personName}
                    onError={(e) => {
                      e.currentTarget.src = defaultAvatar
                    }}
                  />
                  <span className="truncate font-semibold capitalize">{personName}</span>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="flex min-h-64 items-center justify-center px-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Not following anyone yet...
          </div>
        )}
      </section>
    </main>
  )
}
