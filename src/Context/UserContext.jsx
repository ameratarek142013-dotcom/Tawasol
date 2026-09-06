import { createContext, useState } from "react";


export let UserContext = createContext()

export default function UserContextProvider(props){

    const [userToken, setUserToken] = useState(localStorage.getItem('userToken'))
    const [userId, setUserId] = useState(localStorage.getItem('userId'))


    return <UserContext.Provider value={{userToken , setUserToken , userId , setUserId}}>
        {props.children}
    </UserContext.Provider>
}