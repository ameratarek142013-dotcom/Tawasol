import React from 'react'
import PostCard from '../PostCard/PostCard'
import { useQuery } from '@tanstack/react-query'
import { getPostDetails } from '../../api/getPostDetails.api'
import { useParams, Link } from 'react-router-dom'
import Loading from '../Loading/Loading'
import ApiError from '../ApiError/ApiError'
import { getAllComments } from '../../api/getPostComments.api'
import { IoArrowBack } from 'react-icons/io5'

export default function PostDetails() {
    const { id } = useParams()

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['postDetails', id],
        queryFn: () => getPostDetails(id),
        select: (data) => data?.data?.data?.post
    })

    const { data: comments, isLoading: commentsIsLoading } = useQuery({
        queryKey: ['allComments', id],
        queryFn: () => getAllComments(id),
        select: (comments) => comments?.data?.data?.comments
    })

    if (isLoading) {
        return (
            <div className="min-h-screen  dark:bg-[#0B0E14] bg-slate-100 flex items-center justify-center">
                <Loading />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="min-h-screen  dark:bg-[#0B0E14] bg-slate-100 flex items-center justify-center p-4">
                <ApiError error={error.message} />
            </div>
        )
    }

    return (
        <div className="min-h-screen dark:bg-[#0B0E14] bg-slate-100  dark:text-slate-100 text-slate-900 pt-20 pb-12 px-4 sm:px-6 transition-colors duration-200">
            <div className="max-w-5xl mx-auto">
                {/* Back to Home Button */}
                <div className="mb-4">
                    <Link
                        to="/home"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl  dark:bg-[#151B27] bg-white border border-[#222B3E] dark:border-[#222B3E] border-slate-200 text-indigo-400 hover:text-indigo-300 font-semibold text-xs sm:text-sm shadow-xs transition"
                    >
                        <IoArrowBack className="text-base" />
                        <span>Back to Feed</span>
                    </Link>
                </div>

                {/* Main Post Card with Details & Comments */}
                {data && (
                    <PostCard
                        post={data}
                        isDetails
                        comments={comments}
                    />
                )}
            </div>
        </div>
    )
}
