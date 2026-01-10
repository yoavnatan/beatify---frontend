import { userService } from '../services/user'
import { LikedSongsStation } from './LikedSongsStation.jsx'
import { StationPreview } from './StationPreview'

export function StationList({ stations, onRemoveStation, onUpdateStation }) {
    const likedSongs = stations.flatMap(station => station.songs).filter(song => song.liked)

    function shouldShowActionBtns(station) {
        const user = userService.getLoggedinUser()

        if (!user) return false
        if (user.isAdmin) return true
        return station.owner?._id === user._id
    }

    return <section>

        <ul className="station-list container">
            <LikedSongsStation likedSongs={likedSongs} />
            {stations.slice(1, 8).map(station =>
                <li key={station._id}>
                    <StationPreview station={station} />
                    {shouldShowActionBtns(station) && <div className="actions">
                        <button onClick={() => onUpdateStation(station)}>Edit</button>
                        <button onClick={() => onRemoveStation(station._id)}>x</button>
                    </div>}
                </li>)
            }
        </ul>
    </section>
}