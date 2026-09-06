import axios from "axios"

export const sharePost = async (id, body) => {
    return await axios.post(`https://route-posts.routemisr.com/posts/${id}/share`, body, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            'Content-Type': 'application/json'
        }
    })
}