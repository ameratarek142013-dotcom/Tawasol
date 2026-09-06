import { useState } from 'react'
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


const query = new QueryClient()


let router = createBrowserRouter([
  {
    path: "", element: <Layout />, children: [
      { path: "/home", element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "/profile/:id", element: <ProtectedRoute><Profile /></ProtectedRoute> },
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

  return (
    <>
      {!online ? toast.error('You are offline now 🛜!', {
        toastId: 'offline-toast', // بديله id عشان ميتكررش
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Zoom,
      }) : toast.dismiss('offline-toast')}


      <ThemeContextProvider>
        <div className='min-h-screen bg-slate-100 dark:bg-[#0B0E14] text-slate-900 dark:text-slate-100 transition-colors duration-200'>
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
        </div>
      </ThemeContextProvider>

    </>
  )
}

export default App
