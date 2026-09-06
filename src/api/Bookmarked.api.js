import axios from "axios"


export const bookMarked = async (id)=> {
    return await axios.put(`https://route-posts.routemisr.com/posts/${id}/bookmark`,{},{
        headers : {
            Authorization :`Bearer ${localStorage.getItem('userToken')}`
        }
    })
}