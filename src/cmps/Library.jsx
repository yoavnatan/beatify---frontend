import { useState, useEffect, useRef } from "react"
import Search from "../assets/svg/search.svg?react"
import List from "../assets/svg/list.svg?react"
import Collapse from "../assets/svg/collapse-library.svg?react"
import Plus from "../assets/svg/plus.svg?react"
import Expend from "../assets/svg/expand-side-bar.svg?react"
import OpenLibrary from "../assets/svg/open-library.svg?react"
import LibraryBooksShelves from "../assets/svg/library-books-shelves.svg?react"
import MinimizeLibrary from "../assets/svg/minimize-library.svg?react"
import { useSelector } from "react-redux"
import { LibraryList } from "./LibraryList.jsx"
import Tippy from "@tippyjs/react"
import { useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import { addStation } from "../store/actions/station.actions.js"
import { getBlankStation } from "../services/library/library.service.js"






export function Library() {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const { user } = useSelector(storeState => storeState.userModule)
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const inputRef = useRef(null)
    const searchWrapperRef = useRef(null)
    const libraryRef = useRef(null)

    const [showCreateBtn, setShowCreateBtn] = useState(true)

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                searchWrapperRef.current &&
                !searchWrapperRef.current.contains(event.target)
            ) {
                setIsSearchOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [stations])

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width
                setShowCreateBtn(width > 340)
            }
        })

        if (libraryRef.current) observer.observe(libraryRef.current)

        return () => {
            if (libraryRef.current) observer.unobserve(libraryRef.current)
        }
    }, [])

    function expandLibrary() {
        window.dispatchEvent(new CustomEvent("expand-library"))
    }

    function expandLibraryToNormal() {
        window.dispatchEvent(new CustomEvent("expand-library-to-normal"))
    }

    function collapseLibrary() {
        window.dispatchEvent(new CustomEvent("sidebar-collapsed"))
    }
    async function createStation() {
        const newStation = await getBlankStation(user)
        const savedStation = await addStation(newStation)
        navigate(`library/add/${savedStation._id}`)
    }



    return (
        <div className="library" ref={libraryRef}>

            <div className="library-header">

                <Tippy content="Collapse Your Library" delay={[300, 0]} offset={[10, -60]} arrow={false} placement="bottom">
                    <div className="library-title" onClick={collapseLibrary}>
                        <Collapse className="collapse-library" />
                        <h1>Your Library</h1>
                    </div>
                </Tippy>



                <div className="header-actions">
                    <Tippy content="Create a Playlist, folder or jam" delay={[300, 0]} offset={[10, -70]} arrow={false} placement="bottom">
                        <button className={`create-wrapper ${showCreateBtn ? 'createShown' : ''}`} onClick={createStation}>

                            <div className={`icon-circle ${showCreateBtn ? 'createShown' : ''}`}>
                                <Plus className="icon-plus" />
                            </div>

                            {showCreateBtn && (
                                <span className="create-btn">Create</span>
                            )}
                        </button>
                    </Tippy>

                    <Tippy content="Expand / Minimize Your Library" delay={[300, 0]} offset={[10, -70]} arrow={false} placement="bottom">
                        <div className="icon-circle-expend-wrapper" onClick={expandLibrary}>
                            <Expend className="expend-side-bar" />
                            <MinimizeLibrary className="minimize-side-bar" />
                        </div>
                    </Tippy>

                    <Tippy content="Open Your Library" delay={[300, 0]} offset={[10, -60]} arrow={false} placement="bottom">
                        <div className="library-books-wrapper" onClick={expandLibraryToNormal}>
                            <OpenLibrary className="open-library-icon" />
                            <LibraryBooksShelves className="library-books-icon" />
                        </div>
                    </Tippy>

                </div>

            </div>

            <div className="library-filter">
                <button>Playlists</button>
                <button>Artists</button>
            </div>

            <div
                ref={searchWrapperRef}
                className={`search-row ${isSearchOpen ? "open" : ""}`}
            >
                <div className="search-input-wrapper">

                    <Tippy
                        content="Search In Your Library"
                        delay={[300, 0]}
                        offset={[0, 10]}
                        arrow={false}
                    >
                        <span className="search-library-wrapper"
                            onClick={() => {
                                setIsSearchOpen(prev => {
                                    const next = !prev
                                    if (!prev) {
                                        setTimeout(() => inputRef.current?.focus(), 150)
                                    }
                                    return next
                                })
                            }}
                        >
                            <Search className={`icon-medium ${isSearchOpen ? "open" : ""}`} />
                        </span>
                    </Tippy>

                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search in Your Library"
                        className={`search-input ${isSearchOpen ? "open" : ""}`}
                    />
                </div>

                <div className={`sort-wrapper ${isSearchOpen ? "open" : ""}`}>
                    <label className={`label-recents ${isSearchOpen ? "hide" : ""}`}>
                        Recents
                    </label>
                    <List className="list-icon" />
                </div>
            </div>

            <LibraryList />
        </div>
    )
}
