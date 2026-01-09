import { Routes, Route } from 'react-router'
import { HomePage } from './pages/HomePage'
import { StationIndex } from './pages/StationIndex.jsx'
import { ChatApp } from './pages/Chat.jsx'
import { StationDetails } from './pages/StationDetails.jsx'
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { LoginSignup, Login, Signup } from './pages/LoginSignup.jsx'
import { Library } from './cmps/Library.jsx'
import { useEffect } from 'react'

export function RootCmp() {

    useEffect(() => {
        const handle = document.querySelector(".resize-handle")
        const main = document.querySelector("main")
        let startX = 0
        let startWidth = 0

        function onMouseDown(e) {
            startX = e.clientX
            startWidth = parseInt(getComputedStyle(main).getPropertyValue("--sidebar-width")) || 340

            document.addEventListener("mousemove", onMouseMove)
            document.addEventListener("mouseup", onMouseUp)
        }

        function onMouseMove(e) {
            const newWidth = startWidth + (e.clientX - startX)
            const clamped = Math.max(70, Math.min(500, newWidth))
            main.style.setProperty("--sidebar-width", `${clamped}px`)
        }

        function onMouseUp() {
            document.removeEventListener("mousemove", onMouseMove)
            document.removeEventListener("mouseup", onMouseUp)
        }

        handle.addEventListener("mousedown", onMouseDown)

        return () => handle.removeEventListener("mousedown", onMouseDown)
    }, [])

    return (
        <section className="general-layout">
            <AppHeader />

            <main>
                <aside className="library-wrapper">
                    <Library />
                </aside>

                <div className="resize-handle"></div>

                <section className="main-content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/station" element={<StationIndex />} />
                        <Route path="/station/:stationId" element={<StationDetails />} />
                        <Route path="/chat" element={<ChatApp />} />
                        <Route path="/auth" element={<LoginSignup />}>
                            <Route path="login" element={<Login />} />
                            <Route path="signup" element={<Signup />} />
                        </Route>
                    </Routes>
                </section>
            </main>

            <AppFooter />
        </section>
    )
}
