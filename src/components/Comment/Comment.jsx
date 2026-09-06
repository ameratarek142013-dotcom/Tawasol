import dayjs from 'dayjs'
import React, { useState } from 'react'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Link } from 'react-router-dom'
import { AiFillLike } from 'react-icons/ai'
import { BiLike } from 'react-icons/bi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { likeComment } from '../../api/LikeComment.api'
import { BsThreeDots } from "react-icons/bs";
import { FaCamera, FaPencilAlt, FaReply } from 'react-icons/fa'
import { FaTrashCan } from 'react-icons/fa6'
import { deleteComment } from '../../api/DeleteComment.api'
import { IoIosCloseCircle } from 'react-icons/io'
import { ImSpinner6 } from 'react-icons/im'
import { RiSendInsFill } from 'react-icons/ri'
import { updateComment } from '../../api/UpdateComment.api'
import { getCommentReplies } from '../../api/GetCommentReplayes.api'
import { createCommentRepley } from '../../api/CreateCommentRepley.api'
import { useTheme } from '../../Context/ThemeContext'

dayjs.extend(relativeTime)

export default function Comment({ postId, comment, isDetails }) {
    if (!comment) return null

    const { commentCreator, createdAt, content, image, likes, _id: commentId, repliesCount } = comment
    const photo = commentCreator?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    const name = commentCreator?.name || 'User'
    const userId = commentCreator?._id

    const isLiked = likes?.includes(localStorage.getItem('userId'))
    const queryClient = useQueryClient()
    const { isDark } = useTheme()

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [editPreview, setEditPreview] = useState(false)
    const [replyPreview, setReplyPreview] = useState(false)

    const [isEditing, setIsEditing] = useState(false)
    const [isReplying, setIsReplying] = useState(false)

    const [commentInput, setCommentInput] = useState('')
    const [imgInput, setImgInput] = useState(null)

    const [replyInput, setReplyInput] = useState('')
    const [replyImgInput, setReplyImgInput] = useState(null)

    const [showingReplies, setShowingReplies] = useState(false)

    const { data: commentReplies, isLoading: isRepliesLoading } = useQuery({
        queryKey: ['commentReplies', commentId],
        queryFn: () => getCommentReplies(postId, commentId),
        select: (data) => data?.data?.data?.replies,
        enabled: repliesCount > 0
    })

    const { mutate: likeMutate } = useMutation({
        mutationFn: () => likeComment(postId, commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allComments', postId] })
            queryClient.invalidateQueries({ queryKey: ['profilePosts'] })
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['commentReplies'] })
            queryClient.invalidateQueries({ queryKey: ['bookmarkes'] })
            queryClient.invalidateQueries({ queryKey: ['homeFeeds'] })
        }
    })

    const { mutate: deleteMutate } = useMutation({
        mutationFn: () => deleteComment(postId, commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allComments', postId] })
            queryClient.invalidateQueries({ queryKey: ['profilePosts'] })
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['commentReplies'] })
            queryClient.invalidateQueries({ queryKey: ['bookmarkes'] })
            queryClient.invalidateQueries({ queryKey: ['homeFeeds'] })
            setIsMenuOpen(false)
        }
    })

    const { isPending: updatePending, mutate: updateMutate } = useMutation({
        mutationFn: (formData) => updateComment(postId, commentId, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allComments', postId] })
            queryClient.invalidateQueries({ queryKey: ['profilePosts'] })
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['commentReplies'] })
            queryClient.invalidateQueries({ queryKey: ['bookmarkes'] })
            queryClient.invalidateQueries({ queryKey: ['homeFeeds'] })
            setIsEditing(false)
            setCommentInput('')
            setImgInput(null)
            setEditPreview(false)
        }
    })

    const { isPending: replyPending, mutate: replyMutate } = useMutation({
        mutationFn: (formData) => createCommentRepley(postId, commentId, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['commentReplies'] })
            queryClient.invalidateQueries({ queryKey: ['allComments', postId] })
            queryClient.invalidateQueries({ queryKey: ['profilePosts'] })
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['postDetails'] })
            queryClient.invalidateQueries({ queryKey: ['bookmarkes'] })
            queryClient.invalidateQueries({ queryKey: ['homeFeeds'] })

            setIsReplying(false)
            setReplyInput('')
            setReplyImgInput(null)
            setReplyPreview(false)
            setShowingReplies(true)
        },
        onError: (err) => {
            console.log('reply failed ❌', err?.response?.data || err.message)
        }
    })

    function handleReply() {
        if (!replyInput.trim() && !replyImgInput) return
        const formData = new FormData()
        if (replyInput.trim()) formData.append('content', replyInput.trim())
        if (replyImgInput) formData.append('image', replyImgInput)
        replyMutate(formData)
    }

    function handleImgPreview(e) {
        if (e.target.files?.[0]) {
            const imgPath = URL.createObjectURL(e.target.files[0])
            setEditPreview(imgPath)
            setImgInput(e.target.files[0])
        }
    }

    function handleReplyImagePreview(e) {
        if (e.target.files?.[0]) {
            const imgPath = URL.createObjectURL(e.target.files[0])
            setReplyPreview(imgPath)
            setReplyImgInput(e.target.files[0])
        }
    }

    function closeEditImage() {
        setEditPreview(false)
        setImgInput(null)
    }

    function closeReplyImage() {
        setReplyPreview(false)
        setReplyImgInput(null)
    }

    function startEdit() {
        setIsEditing(true)
        setCommentInput(content || '')
        setImgInput(null)
        setEditPreview(image || false)
        setIsMenuOpen(false)
    }

    function handleEditComment() {
        if (!commentInput.trim() && !imgInput) return
        const formData = new FormData()
        if (commentInput.trim()) formData.append('content', commentInput.trim())
        if (imgInput) formData.append('image', imgInput)
        updateMutate(formData)
    }

    const isAuthor = userId === localStorage.getItem('userId')

    return (
        <div className={`group rounded-2xl transition-all duration-200 p-3.5 mb-2 ${
            repliesCount > 0 
                ? 'bg-slate-100-80 dark:bg-[#111722]/90 bg-slate-100/80 border border-slate-200 dark:border-[#1E2536] ' 
                : 'bg-slate-50 dark:bg-[#141A26]  border  dark:border-[#20293D] border-slate-200 shadow-xs'
        }`}>
            {/* Top Row: User Avatar, Name, Time, Menu */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <img
                        className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-700/60"
                        src={photo}
                        alt={name}
                    />
                    <div className="flex flex-col text-left">
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-xs sm:text-sm dark:text-white text-slate-900 capitalize">
                                {name}
                            </h4>
                            <span className="text-[11px] dark:text-slate-400 text-slate-500">
                                {dayjs(createdAt).fromNow()}
                            </span>
                        </div>

                        {/* Comment Body */}
                        {isDetails ? (
                            content && (
                                <p className="text-xs sm:text-sm dark:text-slate-200 text-slate-700 mt-1 leading-relaxed">
                                    {content}
                                </p>
                            )
                        ) : (
                            <Link to={`/postdetails/${postId}`}>
                                {content && (
                                    <p className="text-xs sm:text-sm  dark:text-slate-200 text-slate-700 mt-1 leading-relaxed hover:text-indigo-400 transition">
                                        {content}
                                    </p>
                                )}
                            </Link>
                        )}
                    </div>
                </div>

                {/* 3-dots dropdown menu for comment author */}
                {isAuthor && (
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Options"
                            className="p-1 rounded-lg text-slate-400  dark:hover:text-white hover:text-slate-800  dark:hover:bg-[#1F2739] hover:bg-slate-200 transition cursor-pointer"
                        >
                            <BsThreeDots className="text-base" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-1 w-36  dark:bg-[#161D2B] bg-white border  dark:border-[#232D42] border-slate-200 rounded-xl shadow-2xl p-1 z-30 flex flex-col gap-0.5">
                                <button
                                    onClick={startEdit}
                                    className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-xs  dark:text-slate-300 text-slate-700 hover:text-yellow-500 dark:hover:text-white  dark:hover:bg-[#20293D] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                >
                                    <FaPencilAlt className="text-amber-400 text-[10px]" />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={() => deleteMutate()}
                                    className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:text-rose-600 hover:bg-rose-200/30 rounded-lg transition cursor-pointer"
                                >
                                    <FaTrashCan className="text-[10px]" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Attached Image */}
            {image && (
                <div className="ml-12 mt-2">
                    <img
                        className="w-44 max-h-48 object-cover rounded-xl border border-slate-700/50"
                        src={image}
                        alt="Comment attachment"
                    />
                </div>
            )}

            {/* Actions: Like & Reply */}
            <div className="flex items-center gap-4 ml-12 mt-2 text-xs font-semibold">
                <button
                    onClick={() => likeMutate()}
                    className={`flex items-center gap-1.5 transition cursor-pointer py-1 ${
                        isLiked 
                            ? 'text-indigo-400 dark:text-indigo-400 font-bold' 
                            : 'text-slate-500 dark:text-slate-400  hover:text-indigo-400'
                    }`}
                >
                    {isLiked ? <AiFillLike className="text-base text-indigo-400" /> : <BiLike className="text-base" />}
                    <span>{likes?.length > 0 ? likes.length : 'Like'}</span>
                </button>

                {repliesCount >= 0 && (
                    <button
                        type="button"
                        onClick={() => setIsReplying((prev) => !prev)}
                        className="flex items-center gap-1  dark:text-slate-400 text-slate-500 hover:text-indigo-400 transition cursor-pointer py-1"
                    >
                        <FaReply className="text-[10px]" />
                        <span>Reply</span>
                    </button>
                )}
            </div>

            {/* Reply Input Box */}
            {isReplying && (
                <div className="ml-12 mt-3 p-3  dark:bg-[#10151F] bg-slate-100 rounded-xl border  dark:border-[#20293D] border-slate-200">
                    <div className="flex items-center gap-1">
                        <input
                            type="text"
                            value={replyInput}
                            onChange={(e) => setReplyInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleReply(); }}
                            placeholder={`Reply to ${name}...`}
                            className="flex-1 bg-transparent  dark:text-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none py-1"
                        />

                        {/* Image upload icon */}
                        <label
                            className="cursor-pointer text-emerald-400 hover:text-emerald-300 transition p-1"
                            htmlFor={`reply-image-${commentId}`}
                        >
                            <FaCamera className="text-sm" />
                        </label>
                        <input
                            type="file"
                            id={`reply-image-${commentId}`}
                            accept="image/*"
                            className="hidden"
                            onChange={handleReplyImagePreview}
                        />

                        {/* Submit Reply */}
                        {replyPending ? (
                            <ImSpinner6 className="animate-spin text-indigo-400 text-sm" />
                        ) : (
                            <button
                                type="button"
                                onClick={handleReply}
                                disabled={!replyInput.trim() && !replyImgInput}
                                className="text-indigo-400 hover:text-indigo-300 hover:scale-120 transition cursor-pointer p-1"
                            >
                                <RiSendInsFill className="text-base" />
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => setIsReplying(false)}
                            className="text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
                        >
                            <IoIosCloseCircle className="text-lg" />
                        </button>
                    </div>

                    {/* Reply image preview */}
                    {replyPreview && (
                        <div className="relative mt-2 inline-block">
                            <img
                                alt="reply preview"
                                className="w-16 h-16 rounded-xl object-cover border border-slate-700"
                                src={replyPreview}
                            />
                            <button
                                onClick={closeReplyImage}
                                className="absolute -top-1 -right-1 bg-black/70 hover:bg-black text-white rounded-full text-base cursor-pointer"
                            >
                                <IoIosCloseCircle />
                            </button>
                        </div>
                    )}
                </div>
            )}

             {/* Edit Comment Box */}

             {isEditing && (
                <div className="ml-12 mt-3 p-3  dark:bg-[#10151F] bg-slate-100 rounded-xl border  dark:border-[#20293D] border-slate-200">
                    <div className="flex items-center gap">
                        <input
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleEditComment(); }}
                            placeholder="Edit comment..."
                            className="flex-1 bg-transparent  dark:text-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none py-1"
                        />

                        <label
                            className="cursor-pointer text-emerald-400 hover:text-emerald-300 transition p-1"
                            htmlFor={`comment-image-${commentId}`}
                        >
                            <FaCamera className="text-sm" />
                        </label>
                        <input
                            onChange={handleImgPreview}
                            type="file"
                            id={`comment-image-${commentId}`}
                            accept="image/*"
                            className="hidden"
                        />

                        {updatePending ? (
                            <ImSpinner6 className="animate-spin text-indigo-400 text-sm" />
                        ) : (
                            <button
                                type="button"
                                onClick={handleEditComment}
                                className="text-indigo-400 hover:text-indigo-300 hover:scale-120 transition cursor-pointer p-1"
                            >
                                <RiSendInsFill className="text-base" />
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="text-slate-500 hover:text-slate-700 p-0.5 cursor-pointer hover:scale-120 transition"
                        >
                            <IoIosCloseCircle className="text-lg" />
                        </button>
                    </div>

                    {editPreview && (
                        <div className="relative mt-2 inline-block">
                            <img
                                alt="preview"
                                className="w-16 h-16 rounded-xl object-cover border border-slate-700"
                                src={editPreview}
                            />
                            <button
                                onClick={closeEditImage}
                                className="absolute -top-1 -right-1 bg-black/70 hover:bg-black text-white rounded-full text-base cursor-pointer"
                            >
                                <IoIosCloseCircle />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* View Replies toggle */}
            {repliesCount > 0 && (
                <div className="ml-12 mt-2">
                    <button
                        onClick={() => setShowingReplies((prev) => !prev)}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition cursor-pointer"
                    >
                        <span className="w-4 h-0.5 bg-indigo-500/50 inline-block" />
                        <span>{showingReplies ? 'Hide replies' : `View ${repliesCount} ${repliesCount === 1 ? 'reply' : 'replies'}`}</span>
                    </button>
                </div>
            )}

            {/* Replies Thread */}
            {showingReplies && commentReplies?.length > 0 && (
                <div className="ml-8 sm:ml-12 mt-3 pl-3 border-l-2 rounded-xl border-indigo-500/30 space-y-2">
                    {commentReplies.map((reply) => (
                        <Comment
                            key={reply._id}
                            postId={postId}
                            comment={reply}
                            isDetails={isDetails}
                            
                        />
                    ))}
                </div>
            )}

           
           
        </div>
    )
}
