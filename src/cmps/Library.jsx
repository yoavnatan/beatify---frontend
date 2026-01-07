import { useState , useEffect} from "react"
import { stationService } from '../services/station/station.service.js'
import Search from "../assets/svg/search.svg?react"
import List from "../assets/svg/list.svg?react"





export function Library() {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [stations, setStations] = useState([])

    function toggleSearch() {
        setIsSearchOpen(prev => !prev)
    }
    useEffect(() => {
        loadStations()
    }, [])

    async function loadStations() {
        const stations = await stationService._getStations()
        setStations(stations)
    }

    return (
        <div className="library">

            <div className="library-header">
                <h1>Your Library</h1>
                <div className="header-actions">
                    <i className="fa-solid fa-plus"></i>
                    <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
                </div>
            </div>

            <div className="library-filter">
                <button>Playlists</button>
                <button>Artists</button>
            </div>

            <div className="search-row">
                <Search className="icon-medium" onClick={toggleSearch} />


                <input
                    type="text"
                    placeholder="Search in Your Library"
                    className={isSearchOpen ? "open" : ""}
                />

                <div className="sort-wrapper">
                    <label className={`label-recents ${isSearchOpen ? "open" : ""}`}>Recents</label>
                    <List className="list-icon" />
                </div>
            </div>




            <section className="library-list">
            <ul>
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

        
