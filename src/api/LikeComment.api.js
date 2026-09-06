import axios from "axios"


export const likeComment = async (postId, commentId)=> {
   return await axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/like`,{},{
    headers : {
        Authorization : `Bearer ${localStorage.getItem('userToken')}`
    }
   })
}