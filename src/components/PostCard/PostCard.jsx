import dayjs from 'dayjs'
import React, { useState } from 'react'
import relativeTime from 'dayjs/plugin/relativeTime'
import { FaRegComment } from 'react-icons/fa'
import { BiLike } from 'react-icons/bi'
import { TbShare3 } from 'react-icons/tb'
import Comment from '../Comment/Comment'
import { Link } from 'react-router-dom'
import CommentCreation from '../CommentCreation/CommentCreation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likePost } from '../../api/likePost.api'
import { AiFillLike } from "react-icons/ai";
import { bookMarked } from '../../api/Bookmarked.api'
import { FaRegBookmark } from "react-icons/fa6";
import { IoBookmark, IoGlobeOutline } from "react-icons/io5";
import { Bounce, toast } from 'react-toastify'
import { deletePost } from '../../api/DeletePost.api'
import { BsThreeDots } from "react-icons/bs";
import { FaTrashCan } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";
import { Button, Modal } from "@heroui/react";
import { IoMdImages, IoIosCloseCircle } from "react-icons/io";
import { MdVerified } from "react-icons/md";
import { updatePost } from '../../api/UpdatePost.api'
import { sharePost } from '../../api/SharePost.api'
import Swal from 'sweetalert2'

dayjs.extend(relativeTime)

export default function PostCard({ post, isDetails, comments, isProfile, userData }) {
    if (!post) return null

    const id = post.id || post._id
    const body = post.body || ''
    const image = post.image || null
    const sharedPost = post.sharedPost || post.originalPost || post.repostOf || null
    const sharedPostId = sharedPost?.id || sharedPost?._id
    const sharedBody = sharedPost?.body || sharedPost?.content || ''
    const sharedImage = sharedPost?.image || null
    const sharedUser = sharedPost?.user || sharedPost?.author || {}
    const sharedUserName = sharedUser?.name || 'User'
    const sharedUserPhoto = sharedUser?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    const sharedCreatedAt = sharedPost?.createdAt
    const createdAt = post.createdAt || new Date().toISOString()
    const likes = post.likes || []
    const likesCount = post.likesCount !== undefined ? post.likesCount : (likes?.length || 0)
    const commentsCount = post.commentsCount !== undefined ? post.commentsCount : (comments?.length || 0)
    const sharesCount = post.sharesCount !== undefined ? post.sharesCount : 0
    const bookmarked = post.bookmarked || false
    const topComment = post.topComment || null
    const postUser = post.user || {}
    const name = postUser.name || 'User'
    const photo = postUser.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    const postUserId = postUser._id || postUser.id
    const sharePreviewBody = sharedPost ? sharedBody : body
    const sharePreviewImage = sharedPost ? sharedImage : image
    const sharePreviewUserName = sharedPost ? sharedUserName : name
    const sharePreviewUserPhoto = sharedPost ? sharedUserPhoto : photo
    const sharePreviewCreatedAt = sharedPost ? sharedCreatedAt : createdAt

    const isLiked = likes?.includes(localStorage.getItem('userId'))
    const queryClient = useQueryClient()

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [imgIsUploaded, setImgIsUploaded] = useState(false)
    const [bodyText, setBodyText] = useState('')
    const [imgFile, setImgFile] = useState(null)
    const [isShareOpen, setIsShareOpen] = useState(false)
    const [shareBody, setShareBody] = useState('')

    const { mutate: mutateLike } = useMutation({
        mutationFn: () => likePost(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['postDetails', id] })
            queryClient.invalidateQueries({ queryKey: ['profilePosts'] })
            queryClient.invalidateQueries({ queryKey: ['homeFeeds'] })
            queryClient.invalidateQueries({ queryKey: ['bookmarkes'] })
        }
    })

    const { mutate: BMmutate } = useMutation({
        mutationFn: () => bookMarked(id),
        onSuccess: (response) => {
            const data = response?.data
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['postDetails', id] })
            queryClient.invalidateQueries({ queryKey: ['profilePosts'] })
            queryClient.invalidateQueries({ queryKey: ['homeFeeds'] })
            queryClient.invalidateQueries({ queryKey: ['bookmarkes'] })
            toast.success(`${data?.message || 'Post saved'} 👍!`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            setIsMenuOpen(false)
        },
        onError: () => {
            toast.error('Failed to bookmark post!', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        }
    })

  const { mutate: DeleteMutate } = useMutation({
    mutationFn: async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        })

        if (!result.isConfirmed) {
            throw new Error('CANCELLED')
        }

        return deletePost(id)
    },
    onSuccess: (response) => {
        const data = response?.data
        queryClient.invalidateQueries({ queryKey: ['allPosts'] })
        queryClient.invalidateQueries({ queryKey: ['postDetails', id] })
        queryClient.invalidateQueries({ queryKey: ['profilePosts'] })
        queryClient.invalidateQueries({ queryKey: ['homeFeeds'] })
        queryClient.invalidateQueries({ queryKey: ['bookmarkes'] })
        toast.success(`${data?.message || 'Post deleted'} 👍!`, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
        setIsMenuOpen(false)
    },
    onError: (error) => {
        if (error?.response?.data?.message === 'CANCELLED') return 
    }
})

    const { mutate: updatedMutate, isPending: updatedIsPending } = useMutation({
        mutationFn: (formData) => updatePost(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['postDetails', id] })
            queryClient.invalidateQueries({ queryKey: ['profilePosts'] })
            queryClient.invalidateQueries({ queryKey: ['homeFeeds'] })
            queryClient.invalidateQueries({ queryKey: ['bookmarkes'] })
            setIsEditOpen(false)
            toast.success('Post updated successfully! 👍', {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
                hideProgressBar: true ,
                transition: Bounce,
            });
        }
    })

    const { mutate: shareMutate, isPending: shareIsPending } = useMutation({
        mutationFn: () => sharePost(id, { body: shareBody.trim() }),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['postDetails', id] })
            queryClient.invalidateQueries({ queryKey: ['profilePosts'] })
            queryClient.invalidateQueries({ queryKey: ['homeFeeds'] })
            queryClient.invalidateQueries({ queryKey: ['bookmarkes'] })
            setIsShareOpen(false)
            setShareBody('')
            toast.success(`${response?.data?.message || 'Post shared'} 👍!`, {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                theme: 'dark',
                transition: Bounce,
            })
        },
        onError: () => {
            toast.error('Failed to share post!', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                theme: 'dark',
                transition: Bounce,
            })
        }
    })

    function closeImage() {
        setImgIsUploaded(false)
        setImgFile(null)
    }

    function handleImgPreview(e) {
        if (e.target.files && e.target.files[0]) {
            const path = URL.createObjectURL(e.target.files[0])
            setImgIsUploaded(path)
            setImgFile(e.target.files[0])
        }
    }

    function openEditModal() {
        setIsEditOpen(true)
        setBodyText(body)
        setImgIsUploaded(image)
        setImgFile(null)
        setIsMenuOpen(false)
    }

    function handleUpdate() {
        if (!bodyText.trim() && !imgFile) return
        const formData = new FormData()
        formData.append('body', bodyText)
        if (imgFile) {
            formData.append('image', imgFile)
        }
        updatedMutate(formData)
    }

    const renderFormattedBody = (text) => {
        if (!text) return null
        const parts = text.split(/(\s+)/)
        return parts.map((part, index) => {
            if (part.startsWith('#')) {
                return (
                    <span key={index} className="text-[#38BDF8] font-medium hover:underline cursor-pointer mr-1">
                        {part}
                    </span>
                )
            }
            return part
        })
    }

    const isAuthor = postUserId === localStorage.getItem('userId')

    return (
        <>
            <div className={`w-full bg-white dark:bg-[#151B27] border border-slate-200 dark:border-[#222B3E] rounded-2xl shadow-xs transition-all duration-200 overflow-hidden ${!isProfile && 'my-2'}`}>
                <div className={isDetails ? 'flex flex-col lg:flex-row' : 'flex flex-col'}>
                    <div className={isDetails ? 'lg:w-7/12 flex flex-col' : 'w-full flex flex-col'}>
                        {/* Header: Author + Options */}
                        <div className="flex items-center justify-between p-4 pb-2">
                            <div className="flex items-center gap-3">
                                <Link to={`/profile/${postUserId}`}>
                                    <img
                                        className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700/60"
                                        src={photo}
                                        alt={name}
                                    />
                                </Link>
                                <div className="flex flex-col text-left">
                                    <div className="flex items-center gap-1">
                                        <Link to={`/profile/${postUserId}`} className="font-semibold text-sm text-slate-900 dark:text-white capitalize hover:underline">
                                            {name}
                                        </Link>
                                        <MdVerified className="text-[#38BDF8] text-base" />
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                        <span>{dayjs(createdAt).fromNow()}</span>
                                        <span>•</span>
                                        <IoGlobeOutline className="text-xs" />
                                    </div>
                                </div>
                            </div>

                            {/* Dropdown Options */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    aria-label="Options"
                                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E2638] transition cursor-pointer"
                                >
                                    <BsThreeDots className="text-lg" />
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-1 w-44  dark:bg-[#161D2B] bg-white border  dark:border-[#232D42] border-slate-200 rounded-xl shadow-2xl p-1 z-30 flex flex-col gap-0.5">
                                        <button
                                            onClick={() => BMmutate()}
                                            className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs  dark:text-slate-300 text-slate-600 hover:text-slate-900 dark:hover:text-white  dark:hover:bg-[#20293D] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                        >
                                            {bookmarked ? <IoBookmark className="text-purple-400 text-sm" /> : <FaRegBookmark className="text-sm" />}
                                            <span>{bookmarked ? 'Remove Saved' : 'Save post'}</span>
                                        </button>

                                        {isAuthor && (
                                            <>
                                                <button
                                                    onClick={openEditModal}
                                                    className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs  dark:text-slate-300 text-slate-600 hover:text-slate-900 dark:hover:text-white  dark:hover:bg-[#20293D] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                                >
                                                    <FaPencilAlt className="text-xs text-amber-400" />
                                                    <span>Edit post</span>
                                                </button>
                                                <button
                                                    onClick={() => DeleteMutate()}
                                                    className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs text-rose-400 hover:text-rose-700 hover:bg-rose-950/30 rounded-lg transition cursor-pointer"
                                                >
                                                    <FaTrashCan className="text-xs" />
                                                    <span>Delete post</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Post Caption Body */}
                        {body && (
                            <Link to={`/postdetails/${id}`}>
                                <div className="px-4 py-2 text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line text-left">
                                    {renderFormattedBody(body)}
                                </div>
                            </Link>
                        )}

                        {sharedPost && (
                            <Link
                                to={`/postdetails/${sharedPostId || id}`}
                                className="mx-4 my-2  block overflow-hidden rounded-xl border border-slate-200 dark:border-[#2A3448] hover:border-gray-300 dark:hover:border-purple-900 transition"
                            >
                                <div className="flex items-center gap-2.5 px-3 py-2.5">
                                    <img
                                        src={sharedUserPhoto}
                                        alt={sharedUserName}
                                        className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                                    />
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs font-semibold capitalize text-slate-900 dark:text-white">
                                            {sharedUserName}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                                            {sharedCreatedAt && <span>{dayjs(sharedCreatedAt).fromNow()}</span>}
                                            {sharedCreatedAt && <span>•</span>}
                                            <IoGlobeOutline />
                                        </div>
                                    </div>
                                </div>
                                {sharedBody && (
                                    <div className="px-3 py-2 text-sm leading-relaxed whitespace-pre-line text-left text-slate-800 dark:text-slate-200">
                                        {renderFormattedBody(sharedBody)}
                                    </div>
                                )}
                                {sharedImage && (
                                    <img
                                        src={sharedImage}
                                        alt={sharedBody || 'Shared post image'}
                                        className="w-full max-h-115 object-cover"
                                    />
                                )}
                            </Link>
                        )}

                        {/* Post Image */}
                        {image && (
                            <div className="px-4 py-1">
                                {isDetails ? (
                                    <img
                                        src={image}
                                        alt={body || 'Post image'}
                                        className="w-full max-h-115 object-cover rounded-xl"
                                    />
                                ) : (
                                    <Link to={`/postdetails/${id}`}>
                                        <img
                                            src={image}
                                            alt={body || 'Post image'}
                                            className="w-full max-h-115 object-cover rounded-xl hover:opacity-95 transition"
                                        />
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* Reactions & Engagement Summary Row */}
                        <div className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400">
                            {/* Left: Reaction Emojis Stack + Count */}
                            <div className="flex items-center gap-1.5">

                                <div className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-[10px] ring-2 ring-white dark:ring-[#151B27]">
                                    👍
                                </div>

                                <span className="font-medium text-slate-700 dark:text-slate-300 ml-0.5">
                                    {likesCount > 0 ? (likesCount >= 1000 ? `${(likesCount / 1000).toFixed(1)}K` : likesCount) : (0)}
                                </span>
                            </div>

                            {/* Right: Comments and Shares */}
                            <div className="flex items-center gap-3">
                                <span>{commentsCount > 0 ? `${commentsCount} Comments` : ('0 Comments')}</span>
                                <span>{sharesCount > 0 ? `${sharesCount} Shares` : ('0 Shares')}</span>
                            </div>
                        </div>

                        {/* Action Buttons Bar */}
                        <div className="grid grid-cols-4 border-t border-slate-200 dark:border-[#1E2536] px-2 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                            {/* Like Action */}
                            <div
                                onClick={() => mutateLike()}
                                className={`flex items-center justify-center gap-2 py-2 rounded-xl transition cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1C2333] ${isLiked ? 'text-[#38BDF8] font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                {isLiked ? <AiFillLike className="text-lg text-[#38BDF8]" /> : <BiLike className="text-lg" />}
                                <span>Like</span>
                            </div>

                            {/* Comment Action */}
                            {isDetails ? (
                                <div className="flex items-center justify-center gap-2 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1C2333] transition cursor-pointer">
                                    <FaRegComment className="text-base" />
                                    <span>Comment</span>
                                </div>
                            ) : (
                                <Link
                                    to={`/postdetails/${id}`}
                                    className="flex items-center justify-center gap-2 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1C2333] transition"
                                >
                                    <FaRegComment className="text-base" />
                                    <span>Comment</span>
                                </Link>
                            )}

                            {/* Share Action */}
                            <div
                                onClick={() => setIsShareOpen(true)}
                                className="flex items-center justify-center gap-2 py-2 rounded-xl text-gray-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1C2333] transition cursor-pointer"
                            >
                                <TbShare3 className="text-lg" />
                                <span>Share</span>
                            </div>

                            {/* Save Action */}
                            <div
                                onClick={() => BMmutate()}
                                className={`flex items-center justify-center gap-2 py-2 rounded-xl transition cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1C2333] ${bookmarked ? 'text-purple-500 dark:text-purple-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                {bookmarked ? <IoBookmark className="text-base text-purple-500 dark:text-purple-400" /> : <FaRegBookmark className="text-base" />}
                                <span>Save</span>
                            </div>
                        </div>
                    </div>

                    {/* Details View / Comments Area */}
                    {isDetails && (
                        <div className="lg:w-5/12 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-[#1E2536] p-4 flex flex-col gap-3 bg-slate-50/90 dark:bg-[#111622]/60">
                            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-[#20293D]">
                                Discussion ({comments?.length || 0})
                            </h3>
                            <CommentCreation id={id} />
                            <div className="flex flex-col gap-2 max-h-150 overflow-y-auto pr-1">
                                {comments?.map((comment) => (
                                    <Comment key={comment._id} postId={id} comment={comment} isDetails />
                                ))}
                                {(!comments || comments.length === 0) && (
                                    <p className="text-center py-6 text-xs  dark:text-slate-400 text-slate-500">
                                        No comments yet. Be the first to comment!
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {!isDetails && topComment && (
                    <div className="px-4 pb-3 border-t  dark:border-[#1E2536]/60 border-slate-200/80 pt-2">
                        <Comment postId={id} comment={topComment} />
                    </div>
                )}
            </div>

            {/* Edit Post Modal */}
            <Modal>
                <Button className="hidden" aria-hidden="true" />
                <Modal.Backdrop isOpen={isEditOpen} onOpenChange={setIsEditOpen}>
                    <Modal.Container>
                        <Modal.Dialog className="sm:max-w-110  dark:bg-[#151B27] bg-white border  dark:border-[#232D42] border-slate-200  dark:text-slate-100 text-slate-900 rounded-2xl shadow-2xl p-5">
                            <Modal.CloseTrigger className="text-slate-400  dark:hover:text-white hover:text-slate-800" />
                            <h3 className="text-base font-bold text-center  dark:text-white text-slate-900 pb-3 border-b  dark:border-slate-800 border-slate-200">
                                Edit Post
                            </h3>

                            <Modal.Header className="pt-3 pb-2 px-0">
                                <div className="flex items-center gap-3">
                                    <img className="w-10 h-10 rounded-full object-cover border border-purple-500/40" src={userData?.photo || photo} alt={userData?.name || name} />
                                    <div className="flex flex-col text-left">
                                        <h4 className="text-sm font-semibold capitalize  dark:text-white text-slate-900">{userData?.name || name}</h4>
                                        <span className="text-[11px] text-slate-400">Public</span>
                                    </div>
                                </div>
                            </Modal.Header>

                            <Modal.Body className="px-0 py-2">
                                <textarea
                                    value={bodyText}
                                    onChange={(e) => setBodyText(e.target.value)}
                                    rows={4}
                                    className="w-full  dark:bg-[#111622] bg-slate-50 border  dark:border-[#222B3E] border-slate-300 p-3 resize-none focus:outline-none focus:border-indigo-500 rounded-xl text-sm  dark:text-slate-100 text-slate-800 placeholder-slate-500"
                                    placeholder="What's on your mind...?"
                                />
                                {imgIsUploaded && (
                                    <div className="relative mt-3 rounded-xl overflow-hidden border border-[#222B3E]">
                                        <img
                                            alt="Preview"
                                            className="w-full max-h-60 object-cover"
                                            src={imgIsUploaded}
                                        />
                                        <button
                                            type="button"
                                            onClick={closeImage}
                                            className="absolute top-2 right-2 text-2xl text-white bg-black/60 hover:bg-black rounded-full p-0.5 cursor-pointer transition"
                                        >
                                            <IoIosCloseCircle />
                                        </button>
                                    </div>
                                )}
                            </Modal.Body>

                            <Modal.Footer className="flex items-center justify-between pt-3 px-0 border-t  dark:border-slate-800 border-slate-200">
                                <label
                                    className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer p-2 rounded-lg  dark:hover:bg-[#1E2638] hover:bg-slate-100 transition"
                                    htmlFor="editPostPhoto"
                                >
                                    <IoMdImages className="text-2xl text-emerald-400" />
                                    <span>Change Photo</span>
                                </label>
                                <input
                                    onChange={handleImgPreview}
                                    id="editPostPhoto"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                />

                                <button
                                    disabled={updatedIsPending}
                                    onClick={handleUpdate}
                                    className="px-6 py-2 rounded-xl bg-linear-to-r from-[#4F46E5] via-[#8B5CF6] to-[#EC4899] text-white text-sm font-semibold hover:opacity-95 disabled:opacity-50 transition cursor-pointer"
                                >
                                    {updatedIsPending ? 'Updating...' : 'Update'}
                                </button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>

            {/* Share Post Modal */}
            <Modal>
                <Button className="hidden" aria-hidden="true" />
                <Modal.Backdrop isOpen={isShareOpen} onOpenChange={setIsShareOpen}>
                    <Modal.Container>
                        <Modal.Dialog className="w-[calc(100vw-2rem)] max-w-110 max-h-[90vh] overflow-y-auto bg-white text-slate-900 dark:bg-[#151B27] dark:text-slate-100 border border-slate-200 dark:border-[#232D42] rounded-2xl shadow-2xl p-4 sm:p-5">
                            <Modal.CloseTrigger className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" />
                            <h3 className="text-base font-bold text-center text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
                                Share Post
                            </h3>
                            <Modal.Header className="pt-3 pb-2 px-0">
                                <div className="flex items-center gap-3">
                                    <img className="w-10 h-10 rounded-full object-cover border border-purple-500/40" src={userData?.photo || photo} alt={userData?.name || name} />
                                    <div className="flex flex-col text-left">
                                        <h4 className="text-sm font-semibold capitalize text-slate-900 dark:text-white">{userData?.name || name}</h4>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Public</span>
                                    </div>
                                </div>
                            </Modal.Header>
                            <Modal.Body className="px-0 pb-4">
                                <textarea
                                    value={shareBody}
                                    onChange={(e) => setShareBody(e.target.value)}
                                    rows={4}
                                    autoFocus
                                    className="w-full bg-slate-50 text-slate-900 dark:bg-[#111622] dark:text-slate-100 border border-slate-300 dark:border-[#222B3E] p-3 resize-none focus:outline-none focus:border-indigo-500 rounded-xl text-sm placeholder-slate-500"
                                    placeholder="Say something about this..."
                                />
                                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-[#2A3448] dark:bg-[#151B27]">
                                    <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-slate-200 dark:border-[#2A3448]">
                                        <img
                                            src={sharePreviewUserPhoto}
                                            alt={sharePreviewUserName}
                                            className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                                        />
                                        <div className="flex flex-col text-left">
                                            <span className="text-xs font-semibold capitalize text-slate-800 dark:text-slate-100">
                                                {sharePreviewUserName}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                                                {sharePreviewCreatedAt && <span>{dayjs(sharePreviewCreatedAt).fromNow()}</span>}
                                                {sharePreviewCreatedAt && <span>•</span>}
                                                <IoGlobeOutline />
                                            </div>
                                        </div>
                                    </div>
                                    {sharePreviewBody && (
                                        <div className="px-3 py-2 text-sm leading-relaxed whitespace-pre-line text-left text-slate-800 dark:text-slate-200">
                                            {renderFormattedBody(sharePreviewBody)}
                                        </div>
                                    )}
                                    {sharePreviewImage && (
                                        <img
                                            src={sharePreviewImage}
                                            alt={sharePreviewBody || 'Post image'}
                                            className="w-full max-h-60 object-cover"
                                        />
                                    )}
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="flex justify-end gap-2 pt-3 px-0 border-t dark:border-slate-800 border-slate-200">
                                <button
                                    onClick={() => setIsShareOpen(false)}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E2638] transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={shareIsPending}
                                    onClick={() => shareMutate()}
                                    className="px-5 py-2 rounded-xl bg-[#38BDF8] text-white text-sm font-semibold hover:bg-sky-500 disabled:opacity-50 transition cursor-pointer"
                                >
                                    {shareIsPending ? 'Sharing...' : 'Share'}
                                </button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </>
    )
}
