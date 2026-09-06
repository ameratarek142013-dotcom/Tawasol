import axios from "axios"


export const updateComment = async (postId, commentId , formData)=>{
    return axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}` , formData , {
         headers : {
            Authorization : `Bearer ${localStorage.getItem('userToken')}`
        }
    })
}