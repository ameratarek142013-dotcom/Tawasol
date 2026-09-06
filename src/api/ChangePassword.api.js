import axios from "axios"


export const changePassword = async (Body)=> {
    return await axios.patch(`https://route-posts.routemisr.com/users/change-password` , Body , {
        headers : {
            Authorization : `Bearer ${localStorage.getItem('userToken')}`
        }
    })
}