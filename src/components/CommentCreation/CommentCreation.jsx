import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import { RiSendInsFill } from "react-icons/ri";
import { createComment } from "../../api/CreateComment.api";
import { ImSpinner6 } from "react-icons/im";
import { IoIosCloseCircle } from "react-icons/io";

export default function CommentCreation({ id }) {
    const [imgUploaded, setImgUploaded] = useState(false)
    const queryClient = useQueryClient()

    const { isPending, mutate } = useMutation({
        mutationKey: ['createComment', id],
        mutationFn: (formData) => createComment(id, formData),
        onSuccess: () => {
            reset()
            setImgUploaded(false)
            queryClient.invalidateQueries({ queryKey: ['allComments'] })
            queryClient.invalidateQueries({ queryKey: ['postDetails'] })
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['profilePosts'] })
        }
    })

    const form = useForm({
        defaultValues: {
            content: "",
            image: ""
        }
    })

    const { register, handleSubmit, reset } = form

    function handleCreateComment(values) {
        if (!values.content?.trim() && (!values.image || !values.image[0])) {
            return
        }

        const formData = new FormData()
        if (values.content?.trim()) {
            formData.append('content', values.content.trim())
        }
        if (values.image && values.image[0]) {
            formData.append('image', values.image[0])
        }

        mutate(formData)
    }

    function handleImgPreview(e) {
        if (e.target.files && e.target.files[0]) {
            const imgPath = URL.createObjectURL(e.target.files[0])
            setImgUploaded(imgPath)
        }
    }

    function closeImage() {
        setImgUploaded(false)
        reset({ image: "" })
    }

    return (
        <div className="w-full  dark:bg-[#141A26] bg-white border  dark:border-[#20293D] border-slate-200 rounded-2xl p-3 shadow-xs mb-3 transition-colors duration-200">
            <form onSubmit={handleSubmit(handleCreateComment)} className="flex flex-col gap-2">
                <div className="relative flex items-center gap-2">
                    <input
                        {...register('content')}
                        type="text"
                        placeholder="Write a comment..."
                        className="w-full  dark:bg-[#1C2333] bg-slate-100 border dark:border-[#273248] border-slate-200 text-slate-100 dark:text-slate-100 text-slate-900 placeholder-slate-400 rounded-full pl-4 pr-20 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-all"
                    />

                    {/* Suffix Controls: Camera + Send inside input */}
                    <div className="absolute right-3 flex items-center gap-2">
                        <label
                            htmlFor={`comment-img-input-${id}`}
                            className="text-emerald-400 hover:text-emerald-300 transition cursor-pointer p-1"
                            title="Attach Photo"
                        >
                            <FaCamera className="text-base" />
                        </label>
                        <input
                            {...register('image', { onChange: handleImgPreview })}
                            type="file"
                            id={`comment-img-input-${id}`}
                            accept="image/*"
                            className="hidden"
                        />

                        {isPending ? (
                            <ImSpinner6 className="animate-spin text-indigo-400 text-base" />
                        ) : (
                            <button
                                type="submit"
                                aria-label="Send comment"
                                className="text-indigo-400 hover:text-indigo-300 hover:scale-110 active:scale-95 transition-all cursor-pointer p-1"
                            >
                                <RiSendInsFill className="text-lg" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Attached Image Preview */}
                {imgUploaded && (
                    <div className="relative mt-1 inline-block">
                        <img
                            alt="Comment preview"
                            className="w-20 h-20 rounded-xl object-cover border border-slate-700 shadow-md"
                            src={imgUploaded}
                        />
                        <button
                            type="button"
                            onClick={closeImage}
                            className="absolute -top-1.5 -right-1.5 bg-black/75 hover:bg-black text-white rounded-full text-lg cursor-pointer transition"
                        >
                            <IoIosCloseCircle />
                        </button>
                    </div>
                )}
            </form>
        </div>
    )
}
