import { Routes, Route, Outlet } from 'react-router'
import { HomePage } from './pages/HomePage'
import { StationIndex } from './pages/StationIndex.jsx'
import { ChatApp } from './pages/Chat.jsx'
import { StationDetails } from './pages/StationDetails.jsx'
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { LoginSignup, Login, Signup } from './pages/LoginSignup.jsx'
import { Library } from './cmps/Library.jsx'
import { useEffect } from 'react'
import { loadStations } from './store/actions/station.actions.js'
// import { LibraryAddStation } from './pages/LibraryAddStation.jsx'
import { Search } from './pages/Search.jsx'
import { useSelector } from 'react-redux'
import { SideBar } from './cmps/SideBar.jsx'


export function MainLayout() {

    useEffect(() => {

        loadStations()
        const handle = document.querySelector(".resize-handle")
        const main = document.querySelector("main")

        let startX = 0
        let startWidth = 0

        function onMouseDown(e) {
            if (main.classList.contains("sidebar-expend")) return
            e.preventDefault()
            startX = e.clientX
            startWidth = parseInt(
                getComputedStyle(main).getPropertyValue("--sidebar-width")
            ) || 400

            document.addEventListener("mousemove", onMouseMove)
            document.addEventListener("mouseup", onMouseUp)
        }


        function onMouseMove(e) {
            e.preventDefault()
            const newWidth = startWidth + (e.clientX - startX)

            if (newWidth < 280) {
                main.style.setProperty("--sidebar-width", "72px")
                main.classList.add("sidebar-collapsed")
                return
            }

            main.classList.remove("sidebar-collapsed")

            const clamped = Math.min(520, Math.max(280, newWidth))
            main.style.setProperty("--sidebar-width", `${clamped}px`)
        }

        function onMouseUp() {
            document.removeEventListener("mousemove", onMouseMove)
            document.removeEventListener("mouseup", onMouseUp)
        }

        handle.addEventListener("mousedown", onMouseDown)

        function expandLibrary() {
            main.classList.toggle("sidebar-expend")
            main.classList.remove("sidebar-collapsed")
        }

        function expandLibraryToNormal() {
            main.classList.remove("sidebar-collapsed")
            main.classList.remove("sidebar-expend")
            main.style.setProperty("--sidebar-width", "280px")
        }

        function collapseSidebar() {
            main.classList.add("sidebar-collapsed")
            main.classList.remove("sidebar-expend")
            main.style.setProperty("--sidebar-width", "72px")
        }

        window.addEventListener("sidebar-collapsed", collapseSidebar)
        window.addEventListener("expand-library", expandLibrary)
        window.addEventListener("expand-library-to-normal", expandLibraryToNormal)

        return () => {
            handle.removeEventListener("mousedown", onMouseDown)
            window.removeEventListener("sidebar-collapsed", collapseSidebar)
            window.removeEventListener("expand-library", expandLibrary)
            window.removeEventListener("expand-library-to-normal", expandLibraryToNormal)
        }
    }, [])

    return (
        <section className="general-layout main-layout">
            <AppHeader />

            <main>
                <aside className="library-wrapper">
                    <Library />
                </aside>

                <div className="resize-handle"></div>

                <section className="main-content">
                    <Outlet />
                </section>
                <SideBar />
            </main>

            <AppFooter />
        </section>
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
                <Route path="search" element={<Search />} />
                {/* <Route path="library/add/:stationId" element={<LibraryAddStation />} /> */}

            </Route>

        </Routes>

    )
}