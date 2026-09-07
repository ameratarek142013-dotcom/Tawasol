import { useEffect, useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './components/Home/Home'
import Register from './Auth/Register/Register'
import Login from './Auth/Login/Login'
import Notfound from './components/Notfound/Notfound'
import Profile from './components/Profile/Profile'
import CounterContextProvider from './Context/CounterContext'
import UserContextProvider from './Context/UserContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import AuthRoute from './components/AuthRoute/AuthRoute'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PostDetails from './components/PostDetails/PostDetails'
import { ToastContainer, Zoom, toast } from 'react-toastify';
import { useNetworkState } from 'react-use'
import ThemeContextProvider from './Context/ThemeContext'
import Settings from './components/Settings/Settings'
import FollowerSuggetions from './components/FollowerSuggetions/FollowerSuggetions'
import ProfilePhotos from './components/ProfilePhotos/ProfilePhotos'
import ProfileFollowers from './components/ProfileFollowers/ProfileFollowers'


const query = new QueryClient()


let router = createBrowserRouter([
  {
    path: "", element: <Layout />, children: [
      { path: "/home", element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "/profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: "/profile/:id", element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: "/profile/photos", element: <ProtectedRoute><ProfilePhotos /></ProtectedRoute> },
      { path: "/profile/:id/photos", element: <ProtectedRoute><ProfilePhotos /></ProtectedRoute> },
      { path: "/profile/followers", element: <ProtectedRoute><ProfileFollowers /></ProtectedRoute> },
      { path: "/profile/:id/followers", element: <ProtectedRoute><ProfileFollowers /></ProtectedRoute> },
      { path: "/settings", element: <ProtectedRoute><Settings/></ProtectedRoute> },
      { path: "/followsuggetions", element: <ProtectedRoute><FollowerSuggetions/></ProtectedRoute> },
      { path: "/postdetails/:id", element: <ProtectedRoute><PostDetails /></ProtectedRoute> },
      { index: true, element: <AuthRoute><Register /></AuthRoute> },
      { path: "/login", element: <AuthRoute><Login /></AuthRoute> },
      { path: "*", element: <Notfound /> }
    ]
  }])

function App() {

  const {online} = useNetworkState()
  const [count, setCount] = useState(0)

   useEffect(() => {
    if (!online) {
      toast.error('You are offline now 🛜!', {
        toastId: 'offline-toast',
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Zoom,
      })
    } else {
      toast.dismiss('offline-toast')
    }
  }, [online])

  return (
    <>
      <ThemeContextProvider>
          <QueryClientProvider client={query}>
            <UserContextProvider>
              <CounterContextProvider>
                <RouterProvider router={router}></RouterProvider>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  closeOnClick
                  pauseOnHover
                  draggable
                  newestOnTop
                  theme="dark"
                  transition={Zoom}
                />
              </CounterContextProvider>
            </UserContextProvider>
          </QueryClientProvider>
      </ThemeContextProvider>

    </>
  )
}

export default App
