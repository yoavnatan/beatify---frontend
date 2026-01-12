import { LikedSongsStation } from "./LikedSongsStation.jsx"
import { useSelector } from "react-redux"



export function LibraryList(){
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const likedSongs = stations.flatMap(station => station.songs).filter(song => song.liked)
    return(
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
    )

}