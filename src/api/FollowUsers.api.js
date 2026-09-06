import axios from "axios"


export const followUsers = async (userId)=> {
    return await axios.put(`https://route-posts.routemisr.com/users/${userId}/follow` , {},{
         headers : {
            Authorization : `Bearer ${localStorage.getItem('userToken')}`
        }
    })
}