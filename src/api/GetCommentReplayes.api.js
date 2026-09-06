import axios from "axios"

export const getCommentReplies = async (postId, commentId)=> {
    return await axios.get(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies?page=1&limit=10` ,{
        headers : {
            Authorization : `Bearer ${localStorage.getItem('userToken')}`
        }
    })
}