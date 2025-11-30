"use client"

import { useState } from "react"
import LoginPage from "@/components/login-page"
import DashboardPage from "@/components/dashboard-page"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return isLoggedIn ? <DashboardPage onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />
}
