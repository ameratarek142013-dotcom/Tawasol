import React, { useContext } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { UserContext } from '../../Context/UserContext'
import { useTheme } from '../../Context/ThemeContext'
import { IoSunnyOutline, IoMoon } from 'react-icons/io5'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../../api/GetProfile.api'

export default function Navbar() {
  let { userToken, setUserToken } = useContext(UserContext)
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  function signOut() {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userId')
    if (setUserToken) setUserToken(null)
    navigate('/login')
  }

  const {data, isLoading, isError, error} = useQuery({
    queryKey : ['profile'],
    queryFn : getProfile,
    select: (data) => data?.data?.data?.user
  })

  return (
    <>
      <div className="navbar bg-white dark:bg-[#0B0E14]  border-b  dark:border-[#1E2536] border-slate-200  dark:text-slate-100 text-slate-900 shadow-sm px-6 md:px-12 fixed top-0 z-30 transition-colors duration-200">
        <div className="flex-1">
          <Link to="/home" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-purple-600/30">
              <span className="text-white font-extrabold text-base tracking-tighter">T</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900  dark:text-white  ">Tawasol</span>
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          {/* Theme Switcher in Navbar */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-full  dark:bg-[#141A26] bg-slate-100 border  dark:border-[#222B3E] border-slate-200  dark:text-slate-300 text-slate-700  dark:hover:text-white hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
          >
            {isDark ? (
              <IoSunnyOutline className="text-lg text-amber-400" />
            ) : (
              <IoMoon className="text-base text-purple-600" />
            )}
          </button>

          {userToken ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar p-0">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-500/40 bg-[#161D2B]">
                  <img
                    className="w-full h-full object-cover rounded-full"
                    alt={data?.name || 'User Avatar'}
                    src={data?.photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'}
                  />
                </div>
              </div>
              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content  dark:bg-[#161D2B] bg-white border  dark:border-[#232D42] border-slate-200  dark:text-slate-200 text-slate-800 rounded-xl z-50 mt-3 w-52 p-2 shadow-2xl"
              >
                <li>
                  <Link to="/home" className="justify-between  dark:hover:bg-[#20293D] hover:bg-slate-100 py-2">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to={`/profile/${data?.id || data?._id}`} className="justify-between  dark:hover:bg-[#20293D] hover:bg-slate-100 py-2">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="justify-between  dark:hover:bg-[#20293D] hover:bg-slate-100 py-2">
                    Settings
                  </Link>
                </li>
                <li>
                  <button onClick={signOut} className="text-rose-400 hover:text-rose-300  dark:hover:bg-rose-950/30 hover:bg-rose-50 py-2">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <ul className="flex items-center gap-4 text-sm font-medium">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg transition ${
                      isActive
                        ? 'bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm'
                        : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`
                  }
                >
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl transition ${
                      isActive
                        ? 'bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm'
                        : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`
                  }
                >
                  Login
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
