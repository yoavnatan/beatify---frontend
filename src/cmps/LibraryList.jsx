import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import WhiteArrow from "../assets/svg/white-arrow.svg?react"



export function LibraryList() {
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const navigate = useNavigate()
    const { user } = useSelector(storeState => storeState.userModule)

    function displayStationDetails(id) {
        navigate(`/station/${id}`)
    }

    return (
        <section className="library-list">
            <ul>
                <li onClick={() => displayStationDetails('likedSongs')}>
                    <img
                        src={"https://misc.scdn.co/liked-songs/liked-songs-300.png"}
                    />
                    <div className="icon-white-arrow">
                        <WhiteArrow />
                    </div>
                    <div className="station-info">
                        <div className="station-name">Liked Songs</div>
                        <div className="station-created-by">
                            by {user.fullname}
                        </div>
                    </div>
                </li>
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
                        <div className="icon-white-arrow">
                            <WhiteArrow />
                        </div>


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
