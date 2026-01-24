import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import WhiteArrow from "../assets/svg/white-arrow.svg?react"
import Playing from "../assets/svg/playing.svg?react"




export function LibraryList() {
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const navigate = useNavigate()
    const { user } = useSelector(storeState => storeState.userModule)
    const { nowPlaying: nowPlayingStationId } = useSelector(storeState => storeState.stationModule)
    const { playing } = useSelector(storeState => storeState.playerModule)

    if (!user) {
        return (
            <section className="library-list empty">
                <p>Please log in to see your playlists</p>
            </section>
        )
    }
    const likedSongsStation = {
        _id: "likedSongs",
        name: "Liked Songs",
        createdBy: { fullname: user.fullname },
        songs: user.likedSongsStations || [],
        imgUrl: "https://misc.scdn.co/liked-songs/liked-songs-300.png",
        likedByUsers: []
    }
    const userStations = stations.filter(station => {
        const createdByUser = station.createdBy?._id === user._id
        const likedByUser = station.likedByUsers?.some(u => u._id === user._id)
        return createdByUser || likedByUser
    })
    const finalList = [likedSongsStation, ...userStations]

    function displayStationDetails(id) {
        navigate(`/station/${id}`)
    }

    return (
        <section className="library-list">
            <ul>
                {finalList.slice(0, 7).map(station => {
                    const coverImg =
                        station._id === "likedSongs"
                            ? "https://misc.scdn.co/liked-songs/liked-songs-300.png"
                            : station.songs?.[0]?.imgUrl ||
                              station.imgUrl ||
                              "/img/blank-screen.png"

                    return (
                        <li key={station._id}
                            onClick={() => displayStationDetails(station._id)}
                            className={`${nowPlayingStationId === station._id ? "playing" : ''}`}>

                            <img src={coverImg} alt={station.name} />

                            <div className="station-info flex justify-between">
                                <div className="station-name">{station.name}</div>
                                <div className="station-created-by">
                                    by {station.createdBy.fullname}
                                </div>
                            </div>

                            <div className="playing-icon on">
                                {nowPlayingStationId === station._id && playing && (
                                    <Playing className="icon small" />
                                )}
                            </div>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}
