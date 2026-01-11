import { useState , useEffect, useRef} from "react"
import { stationService } from '../services/station/station.service.js'
import { LikedSongsStation } from "./LikedSongsStation.jsx"
import Search from "../assets/svg/search.svg?react"
import List from "../assets/svg/list.svg?react"
import Collapse from "../assets/svg/collapse-library.svg?react"
import Plus from "../assets/svg/plus.svg?react"
import Expend from "../assets/svg/expand-side-bar.svg?react"
import OpenLibrary from "../assets/svg/open-library.svg?react"
import LibraryBooksShelves from "../assets/svg/library-books-shelves.svg?react"
import MinimizeLibrary from "../assets/svg/minimize-library.svg?react"










export function Library() {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [stations, setStations] = useState([])
    const likedSongs = stations.flatMap(station => station.songs).filter(song => song.liked)
    const inputRef = useRef(null);
    const searchWrapperRef = useRef(null)



    useEffect(() => {
        loadStations()
    }, [])
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
    }, [])


    async function loadStations() {
        const stations = await stationService._getStations()
        setStations(stations)
    }
    function expandLibrary() {
        const event = new CustomEvent("expand-library")
        window.dispatchEvent(event)
    }
    function expandLibraryToNoramal(){
        const event = new CustomEvent("expand-library-to-normal")
        window.dispatchEvent(event)
    }
    function collapseLibrary(){
        const event = new CustomEvent("sidebar-collapsed")
        window.dispatchEvent(event)
    }


    return (
        <div className="library">

            <div className="library-header">
                <div className="tooltip" style={{ display: 'flex', gap: '10px' }} data-tip="Collapse Your Library" onClick={collapseLibrary}>
                    <Collapse className="collapse-library tooltip"  />
                    <h1 className="tooltip">Your Library</h1>
                </div>

                <div className="header-actions">
                    <div className="icon-circle tooltip" data-tip="Create a Playlist, folder or jam">
                        <Plus className="icon-plus" />
                    </div>
                    <div className="icon-circle-expend-wrapper tooltip" data-tip="Expand / Minimize Your Library" onClick={expandLibrary} >
                        <Expend className="expend-side-bar tooltip"/>
                        <MinimizeLibrary className="minimize-side-bar tooltip"/>
                    </div>
                    <div className="library-books-wrapper tooltip" data-tip="Open Your Library" onClick={expandLibraryToNoramal}>
                        <OpenLibrary className="open-library-icon "/>
                        <LibraryBooksShelves className="library-books-icon" />
                    </div>
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
                    <Search
                        className={`icon-medium ${isSearchOpen ? "open" : ""}`}
                        onClick={() => {
                            setIsSearchOpen(prev => {
                                const next = !prev;
                                if (!prev) {
                                    setTimeout(() => inputRef.current?.focus(), 150);
                                }
                                return next;
                            });
                        }}
                    />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search in Your Library"
                        className={`search-input ${isSearchOpen ? "open" : ""}`}
                    />
                </div>

                <div className="sort-wrapper">
                    <label className={`label-recents ${isSearchOpen ? "hide" : ""}`}>
                        Recents
                    </label>
                    <List className="list-icon" />
                </div>
            </div>


            <section className="library-list">
                <ul>
                    <LikedSongsStation likedSongs={likedSongs} />
                    {stations.slice(0, 4).map(station => (
                        <li key={station._id}>
                            <img src={station.songs[0]?.imgUrl} alt={station.name} />
                            <div className="station-info">
                                <div className="station-name">{station.name}</div>
                                <div className="station-created-by">by {station.createdBy.fullname}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

        </div>
    )
}

