import axios from "axios"

export const getHomeFeeds = async ()=> {
    return await axios.get(`https://route-posts.routemisr.com/posts/feed?only=following&limit=10` ,{
        headers : {
            Authorization : `Bearer ${localStorage.getItem('userToken')}`
        }
    })
}