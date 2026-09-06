import axios from "axios"

export const getFollowSuggetions = async ()=> {
    return await axios.get(`https://route-posts.routemisr.com/users/suggestions?limit=10` ,{
        headers : {
            Authorization : `Bearer ${localStorage.getItem('userToken')}`
        }
    })
}