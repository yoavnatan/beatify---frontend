import { useNavigate } from 'react-router'
import { StationPreview } from './StationPreview'
import { useSelector } from "react-redux"
import { useEffect, useMemo, useState } from 'react'
import { stationService } from '../services/station'



export function StationList({ stations, onRemoveStation, onUpdateStation, setGradientColor }) {
    const user = useSelector(storeState => storeState.userModule.user)
    const [gradients, setGreadients] = useState([])
    const isLoading = useSelector(storeState => storeState.systemModule.isLoading)
    const navigate = useNavigate()

    const likedSongsStation = user ? {
        _id: "likedSongs",
        name: "Liked Songs",
        createdBy: { fullname: user.fullname },
        songs: user.likedSongs || [],
        imgUrl: "https://misc.scdn.co/liked-songs/liked-songs-300.png",
        likedByUsers: []
    } : null

    const fullStationsList = useMemo(() => {
        if (!user || !likedSongsStation) return stations.slice(0, 8)

        const hasLikedSongsAlready = stations.some(s => s._id === "likedSongs")
        const listWithLiked = hasLikedSongsAlready
            ? stations
            : [likedSongsStation, ...stations]

        return listWithLiked.slice(0, 8)
    }, [stations, user])

    useEffect(() => {
        calcColors()
    }, [fullStationsList])

    async function calcColors() {
        const colors = await Promise.all(fullStationsList.slice(1, 8).map(s => stationService.getAvgColor(s)))
        setGreadients(['rgba(69, 44, 148, 0.9)', ...colors])
    }

    function displayStationDetails(id) {
        navigate(`/station/${id}`)
    }

    function shouldShowActionBtns(station) {
        if (!user) return false
        if (user.isAdmin) return true
        return station.owner?._id === user._id || station.createdBy?._id === user._id
    }

    return (
        <section>
            <ul className="station-list container">
                {fullStationsList.slice(0, 8).map((station, idx) =>
                    <li key={station._id} onClick={() => displayStationDetails(station._id)}>
                        <StationPreview
                            station={station}
                            gradient={gradients[idx]}
                            setGradientColor={setGradientColor}
                        />
                        {shouldShowActionBtns(station) && (
                            <div className="actions">
                                {/* כפתורי עריכה/מחיקה */}
                            </div>
                        )}
                    </li>
                )}
            </ul>
        </section>
    )
}
