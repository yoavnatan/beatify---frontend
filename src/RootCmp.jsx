import { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router'
import { HomePage } from './pages/HomePage'
import { StationIndex } from './pages/StationIndex.jsx'
// import { ChatApp } from './pages/Chat.jsx'
import { StationDetails } from './pages/StationDetails.jsx'
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { LoginSignUp } from './pages/LoginSignup.jsx'
import { Library } from './cmps/Library.jsx'
import { useEffect } from 'react'
import { loadStations } from './store/actions/station.actions.js'
// import { LibraryAddStation } from './pages/LibraryAddStation.jsx'
import { Search } from './pages/Search.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { SideBar } from './cmps/SideBar.jsx'
import { Browse } from './pages/Browse.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'
import { loginDefault } from './store/actions/user.actions.js'
import { use } from 'react'
import { ListeningRoom } from './pages/ListeningRoom.jsx'
import { TOGGLE_PLAY } from './store/reducers/player.reducer.js'
import { Chat } from './pages/Chat.jsx'
import { socketService } from './services/socket.service.js'




export function MainLayout() {
    const navigate = useNavigate();
    const BREAKPOINT = 600;
    const location = useLocation()
    const dispatch = useDispatch()

    useEffect(() => {

        function handleResize() {
            if (window.innerWidth >= BREAKPOINT) {
                if (location.pathname === '/libraryMobile' || location.pathname === '/queueMobile') {
                    navigate('/')
                }
            }
        }
        window.addEventListener('resize', handleResize)
        handleResize()
        return () => { window.removeEventListener('resize', handleResize) }

    }, [navigate])


    useEffect(() => {
        function handleKeyDown(ev) {
            const tag = ev.target.tagName

            if (tag === 'INPUT' || tag === 'TEXTAREA' || ev.target.isContentEditable) {
                return
            }
            if (ev.code === 'Space') {
                ev.preventDefault()
                dispatch({ type: TOGGLE_PLAY })
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [dispatch])

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

            document.body.style.cursor = "grabbing";

        }
        function onMouseMove(e) {
            e.preventDefault()
            const newWidth = startWidth + (e.clientX - startX)

            if (newWidth < 240) {
                main.style.setProperty("--sidebar-width", "72px")
                main.classList.add("sidebar-collapsed")
                return
            }

            main.classList.remove("sidebar-collapsed")

            const clamped = Math.min(520, Math.max(320, newWidth))
            main.style.setProperty("--sidebar-width", `${clamped}px`)
        }

        function onMouseUp() {
            document.removeEventListener("mousemove", onMouseMove)
            document.removeEventListener("mouseup", onMouseUp)
            document.body.style.cursor = "default";

        }

        handle.addEventListener("mousedown", onMouseDown)

        function expandLibrary() {
            main.classList.toggle("sidebar-expend")
            main.classList.remove("sidebar-collapsed")
        }

        function expandLibraryToNormal() {
            main.classList.remove("sidebar-collapsed")
            main.classList.remove("sidebar-expend")
            main.style.setProperty("--sidebar-width", "320px")
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
                    {location.pathname === '/listeningRoom' ? <Chat /> : <Library />}
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
    const user = useSelector((storeState) => storeState.userModule.user)
    useEffect(() => {
        if (!user) {
            loginDefault()
        }
    }, [])
    return (
        <>
            <UserMsg />

            <Routes>
                <Route path="/auth" element={<LoginSignUp />} />

                <Route path="/*" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="station" element={<StationIndex />} />
                    <Route path="station/:stationId" element={<StationDetails />} />
                    <Route path="search" element={<Search />} />
                    <Route path="libraryMobile" element={<Library />} />
                    <Route path="queueMobile" element={<SideBar />} />
                    <Route path="browse" element={<Browse />} />
                    <Route path="listeningRoom" element={<ListeningRoom />} />
                    <Route path="chatMobile" element={<Chat />} />
                </Route>
            </Routes>
        </>
    )
}

