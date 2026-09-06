import React from 'react'
import Navbar from '../Navbar/Navbar'
import { Outlet, useLocation } from 'react-router-dom'


export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/home'

  return (
    <>
      {!isHome && <Navbar />}
      <Outlet />
     
    </>
  )
}
