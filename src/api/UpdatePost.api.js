import axios from "axios"


export const updatePost = async (id ,formData)=>{
    return axios.put(`https://route-posts.routemisr.com/posts/${id}` , formData , {
         headers : {
            Authorization : `Bearer ${localStorage.getItem('userToken')}`
        }
    })
}