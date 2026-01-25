import { useNavigate } from 'react-router'
import { StationPreview } from './StationPreview'
import { useSelector } from "react-redux"
import { useEffect, useState } from 'react'
import { stationService } from '../services/station'


export function StationList({ stations, onRemoveStation, onUpdateStation, setGradientColor }) {
    const user = useSelector(storeState => storeState.userModule.user)
    const [gradients, setGreadients] = useState([])

    useEffect(() => {
        calcColors()
    })
    const navigate = useNavigate()
    async function calcColors() {
        const colors = await Promise.all(stations.slice(0, 8).map(s => stationService.getAvgColor(s)))
        setGreadients(colors)
    }

    function displayStationDetails(id) {
        navigate(`/station/${id}`)
    }

    function shouldShowActionBtns(station) {
        if (!user) return false
        if (user.isAdmin) return true
        return station.owner?._id === user._id
    }
    return <section>

        <ul className="station-list container">
            {stations.slice(0, 8).map((station, idx) =>
                <li key={station._id} onClick={() => displayStationDetails(station._id)}>
                    <StationPreview station={station} gradient={gradients[idx]} setGradientColor={setGradientColor} />
                    {shouldShowActionBtns(station) && <div className="actions">
                        {/* <button onClick={() => onUpdateStation(station)}>Edit</button> */}
                        {/* <button onClick={() => onRemoveStation(station._id)}>x</button> */}
                    </div>}
                </li>)
            }
        </ul>
    </section>
}