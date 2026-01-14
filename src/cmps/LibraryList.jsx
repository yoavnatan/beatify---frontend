import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"



export function LibraryList() {
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const navigate = useNavigate()

    function displayStationDetails(id) {
        navigate(`/station/${id}`)
    }

    return (
        <section className="library-list">
            <ul>
                {stations.slice(0, 7).map(station => (
                    <li key={station._id} onClick={() => displayStationDetails(station._id)}>
                        
                        <img
                            src={
                                station._id === 'likedSongs'
                                    ? "https://misc.scdn.co/liked-songs/liked-songs-300.png"
                                    : station.songs[0]?.imgUrl
                            }
                            alt={station.name}
                        />

                        <div className="station-info">
                            <div className="station-name">{station.name}</div>
                            <div className="station-created-by">
                                by {station.createdBy.fullname}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}
