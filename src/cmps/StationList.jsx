import { StationPreview } from './StationPreview'
import { useSelector } from "react-redux"


export function StationList({ stations, onRemoveStation, onUpdateStation, setGradientColor }) {
    const user = useSelector(storeState => storeState.userModule.user)
    

    function shouldShowActionBtns(station) {
        if (!user) return false
        if (user.isAdmin) return true
        return station.owner?._id === user._id
    }

    return <section>

        <ul className="station-list container">
            {stations.slice(0, 8).map(station =>
                <li key={station._id}>
                    <StationPreview station={station} setGradientColor={setGradientColor} />
                    {shouldShowActionBtns(station) && <div className="actions">
                        <button onClick={() => onUpdateStation(station)}>Edit</button>
                        <button onClick={() => onRemoveStation(station._id)}>x</button>
                    </div>}
                </li>)
            }
        </ul>
    </section>
}