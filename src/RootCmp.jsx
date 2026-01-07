import React from 'react'
import { Routes, Route, Outlet } from 'react-router'

import { HomePage } from './pages/HomePage'
import { StationIndex } from './pages/StationIndex.jsx'
import { ChatApp } from './pages/Chat.jsx'
import { StationDetails } from './pages/StationDetails.jsx'
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { LoginSignup, Login, Signup } from './pages/LoginSignup.jsx'
import { Library } from './cmps/Library.jsx'

function MainLayout() {
    return (
        <div className="main-container main-layout">
            <AppHeader />
            <main>
                <Library />
                <Outlet />
            </main>
            <AppFooter />
        </div>

    )
}


export function RootCmp() {
    return (

        <Routes>
            <Route path="auth" element={<LoginSignup />}>
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
            </Route>

            <Route element={<MainLayout />}>
                <Route path="" element={<HomePage />} />
                <Route path="station" element={<StationIndex />} />
                <Route path="station/:stationId" element={<StationDetails />} />
                <Route path="chat" element={<ChatApp />} />
            </Route>

        </Routes>
    )
}


