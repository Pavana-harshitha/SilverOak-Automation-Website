import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import "./Layout.css"

export default function Layout() {
  return (
    <div>
      <Navbar/>
      <main className='content'>
      <Outlet/>
      </main>
    </div>
  )
}
