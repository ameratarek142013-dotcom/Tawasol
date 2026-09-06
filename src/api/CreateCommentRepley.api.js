import axios from "axios"


export const createCommentRepley = async (postId, commentId, formData) => {
    return await axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies`, formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
}