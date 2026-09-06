import React, { useRef, useState } from 'react'
import { Button, Modal } from "@heroui/react";
import { IoIosCloseCircle } from "react-icons/io";
import { IoImageOutline, IoHappyOutline, IoLocationOutline, IoVideocamOutline, IoEllipsisHorizontal } from "react-icons/io5";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../../api/CreatePost.api';
import { Bounce, toast } from 'react-toastify'
import { Link } from 'react-router-dom';

export default function PostCreation({ isProfile, userData, isOpenProp, onOpenChangeProp }) {
    const [bodyText, setBodyText] = useState('')
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: () => createPost(prepareFormData()),
        onSuccess: (response) => {
            const data = response?.data
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['profilePosts'] })
            toast.success(`${data?.message || 'Post created'} 👍!`, {
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
            setImgIsUploaded(false)
            setBodyText('')
            handleModalClose()
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to create post!', {
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

    const [internalIsOpen, setInternalIsOpen] = useState(false)
    const isModalOpen = isOpenProp !== undefined ? isOpenProp : internalIsOpen

    const handleModalOpen = () => {
        if (onOpenChangeProp) onOpenChangeProp(true)
        else setInternalIsOpen(true)
    }

    const handleModalClose = () => {
        if (onOpenChangeProp) onOpenChangeProp(false)
        else setInternalIsOpen(false)
    }

    const [imgIsUploaded, setImgIsUploaded] = useState(false)
    const bodyInput = useRef(null)
    const imgInput = useRef(null)

    function handleImgPreview(e) {
        if (e.target.files && e.target.files[0]) {
            const path = URL.createObjectURL(e.target.files[0])
            setImgIsUploaded(path)
        }
    }

    function closeImage() {
        setImgIsUploaded(false)
        if (imgInput.current) imgInput.current.value = ''
    }

    function prepareFormData() {
        if (!bodyText.trim() && (!imgInput.current?.files || !imgInput.current.files[0])) {
            return
        }

        const formData = new FormData()
        if (bodyText.trim()) {
            formData.append('body', bodyText.trim())
        }
        if (imgInput.current?.files && imgInput.current.files[0]) {
            formData.append('image', imgInput.current.files[0])
        }
        return formData
    }

    const userName = userData?.name || 'Amira'
    const firstName = userName.split(' ')[0]
    const userPhoto = userData?.photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'

    return (
        <>
            {/* Post Creation Box in Feed */}
            <div className={`w-full  dark:bg-[#151B27] bg-white border  dark:border-[#222B3E] border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col gap-3.5 transition-colors duration-200 ${isProfile ? '' : 'mb-3'}`}>
                {/* Top: Avatar + Pill Input */}
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${userData?.id || userData?._id}`} className="shrink-0">
                        <img
                            src={userPhoto}
                            alt={userName}
                            className="w-10 h-10 rounded-full object-cover border border-purple-500/30"
                        />
                    </Link>

                    <button
                        onClick={handleModalOpen}
                        className="flex-1 text-left  dark:bg-[#1C2333] bg-slate-100  dark:hover:bg-[#222B3E] hover:bg-slate-200  dark:text-slate-400 text-slate-600 text-sm font-normal py-2.5 px-5 rounded-full border  dark:border-[#273248] border-slate-200 transition cursor-pointer"
                    >
                        What's on your mind, {firstName}?
                    </button>
                </div>

                {/* Bottom Row: Quick Action Media Buttons */}
                <div className="hidden md:flex items-center justify-between pt-1 border-t  dark:border-[#1C2436] border-slate-200 text-xs font-medium  dark:text-slate-300 text-slate-600">
                    <button
                        onClick={handleModalOpen}
                        className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl  dark:hover:bg-[#1E2638] hover:bg-slate-100 transition cursor-pointer  dark:text-slate-300 text-slate-700  dark:hover:text-white hover:text-slate-900"
                    >
                        <IoImageOutline className="text-lg text-emerald-400" />
                        <span>Photo/Video</span>
                    </button>

                    <button
                        onClick={handleModalOpen}
                        className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl  dark:hover:bg-[#1E2638] hover:bg-slate-100 transition cursor-pointer  dark:text-slate-300 text-slate-700  dark:hover:text-white hover:text-slate-900"
                    >
                        <IoHappyOutline className="text-lg text-amber-400" />
                        <span>Feeling</span>
                    </button>

                    <button
                        onClick={handleModalOpen}
                        className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl  dark:hover:bg-[#1E2638] hover:bg-slate-100 transition cursor-pointer  dark:text-slate-300 text-slate-700  dark:hover:text-white hover:text-slate-900"
                    >
                        <IoLocationOutline className="text-lg text-rose-400" />
                        <span>Check in</span>
                    </button>

                    <button
                        onClick={handleModalOpen}
                        className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl  dark:hover:bg-[#1E2638] hover:bg-slate-100 transition cursor-pointer  dark:text-slate-300 text-slate-700  dark:hover:text-white hover:text-slate-900"
                    >
                        <IoVideocamOutline className="text-lg text-purple-400" />
                        <span>Live Video</span>
                    </button>

                    <button
                        onClick={handleModalOpen}
                        className="p-1.5 rounded-lg  dark:hover:bg-[#1E2638] hover:bg-slate-100 text-slate-400  dark:hover:text-white hover:text-slate-900 transition cursor-pointer"
                    >
                        <IoEllipsisHorizontal className="text-base" />
                    </button>
                </div>
            </div>

            {/* Post Creation Modal */}
            <Modal>
                <Button className="hidden" aria-hidden="true" />
                <Modal.Backdrop isOpen={isModalOpen} onOpenChange={(open) => { if (!open) handleModalClose(); }}>
                    <Modal.Container>
                        <Modal.Dialog className="sm:max-w-110  dark:bg-[#151B27] bg-white border  dark:border-[#232D42] border-slate-200  dark:text-slate-100 text-slate-900 rounded-2xl shadow-2xl p-5">
                            <Modal.CloseTrigger className="text-slate-400  dark:hover:text-white hover:text-slate-800" />
                            
                            <h3 className="text-base font-bold text-center  dark:text-white text-slate-900 pb-3 border-b  dark:border-slate-800 border-slate-200">
                                Create Post
                            </h3>

                            <Modal.Header className="pt-3 pb-2 px-0">
                                <div className="flex items-center gap-3">
                                    <img className="w-10 h-10 rounded-full object-cover border border-purple-500/40" src={userPhoto} alt={userName} />
                                    <div className="flex flex-col text-left">
                                        <h4 className="text-sm font-semibold capitalize  dark:text-white text-slate-900">{userName}</h4>
                                        <span className="text-[11px] text-slate-400">Public</span>
                                    </div>
                                </div>
                            </Modal.Header>

                            <Modal.Body className="px-0 py-2">
                                <textarea
                                    value={bodyText}
                                    onChange={(e) => setBodyText(e.target.value)}
                                    ref={bodyInput}
                                    rows={4}
                                    className="w-full  dark:bg-[#111622] bg-slate-50 border  dark:border-[#222B3E] border-slate-300 p-3 resize-none focus:outline-none focus:border-indigo-500 rounded-xl text-sm  dark:text-slate-100 text-slate-800 placeholder-slate-400"
                                    placeholder={`What's on your mind, ${firstName}?`}
                                />

                                {imgIsUploaded && (
                                    <div className="relative mt-3 rounded-xl overflow-hidden border  dark:border-[#222B3E] border-slate-200">
                                        <img
                                            alt="Upload preview"
                                            className="w-full max-h-60 object-cover"
                                            src={imgIsUploaded}
                                        />
                                        <button
                                            type="button"
                                            onClick={closeImage}
                                            className="absolute top-2 right-2 text-2xl text-white bg-black/60 hover:bg-black/90 rounded-full p-0.5 cursor-pointer transition"
                                        >
                                            <IoIosCloseCircle />
                                        </button>
                                    </div>
                                )}
                            </Modal.Body>

                            <Modal.Footer className="flex items-center justify-between pt-3 px-0 border-t  dark:border-slate-800 border-slate-200">
                                <label
                                    className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer p-2 rounded-lg  dark:hover:bg-[#1E2638] hover:bg-slate-100 transition"
                                    htmlFor="homePostPhoto"
                                >
                                    <IoImageOutline className="text-2xl text-emerald-400" />
                                    <span>Add Photo</span>
                                </label>
                                <input
                                    ref={imgInput}
                                    onChange={handleImgPreview}
                                    id="homePostPhoto"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                />

                                <button
                                    disabled={(!bodyText.trim() && !imgIsUploaded) || isPending}
                                    onClick={() => mutate()}
                                    className="px-6 py-2 rounded-xl bg-linear-to-r from-[#4F46E5] via-[#8B5CF6] to-[#EC4899] text-white text-sm font-semibold hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-900/30 transition cursor-pointer"
                                >
                                    {isPending ? 'Posting...' : 'Post'}
                                </button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </>
    )
}
