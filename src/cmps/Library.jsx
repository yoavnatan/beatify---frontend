import { useState , useEffect} from "react"
import { stationService } from '../services/station/station.service.js'
import { LikedSongsStation } from "./LikedSongsStation.jsx"
import Search from "../assets/svg/search.svg?react"
import List from "../assets/svg/list.svg?react"
import Collapse from "../assets/svg/collapse-library.svg?react"
import Plus from "../assets/svg/plus.svg?react"
import Expend from "../assets/svg/expand-side-bar.svg?react"








export function Library() {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [stations, setStations] = useState([])
    const likedSongs = stations.flatMap(station => station.songs).filter(song => song.liked)

    console.log('stations', stations);

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
                <div className="tooltip" style={{ display: 'flex' , gap: '10px' }} data-tip="Collapse Your Library">
                    <Collapse className="collapse-library tooltip"/>
                    <h1 className="tooltip">Your Library</h1>
                </div>

                <div className="header-actions">    
                    <div className="icon-circle tooltip" data-tip="Create a Playlist, folder or jam">
                        <Plus className="icon-plus" />
                    </div>
                    <div className="icon-circle tooltip" data-tip="Expand Your Library">
                        <Expend className="expend-side-bar tooltip" data-tip="Expand Your Library" />
                    </div>
                </div>
            </div>

            <div className="library-filter">
                <button>Playlists</button>
                <button>Artists</button>
            </div>

            <div className="search-row">

                <div className="tooltip" data-tip="Search in Your Library">
                    <Search className="icon-medium" onClick={toggleSearch} />
                </div>


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
                <LikedSongsStation likedSongs={likedSongs}/>
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


        
