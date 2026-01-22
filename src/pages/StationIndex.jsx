import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { loadStations, addStation, updateStation, removeStation, addStationMsg } from '../store/actions/station.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user'
import { stationService } from '../services/station'

import { StationList } from '../cmps/StationList.jsx'
import { StationFilter } from '../cmps/StationFilter.jsx'
import { StationCarousel } from '../cmps/StationCarousel.jsx'
import { Loader } from '../cmps/Loader.jsx'

export function StationIndex() {

    const [gradientColor, setGradientColor] = useState('rgba(52, 52, 52, 0.5)')
    const [filterBy, setFilterBy] = useState(stationService.getDefaultFilter())
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const isLoading = useSelector(storeState => storeState.systemModule.isLoading)
    const { user } = useSelector(storeState => storeState.userModule)

    const gradientRef = useRef()
    useEffect(() => {
        loadStations(filterBy)
    }, [filterBy])

    async function onRemoveStation(stationId) {
        try {
            await removeStation(stationId)
            showSuccessMsg('Station removed')
        } catch (err) {
            showErrorMsg('Cannot remove station')
        }
    }

    async function onAddStation() {
        const station = stationService.getEmptyStation()
        station.name = prompt('Name?', 'Some name')
        try {
            const savedStation = await addStation(station)
            showSuccessMsg(`Station added (id: ${savedStation._id})`)
        } catch (err) {
            showErrorMsg('Cannot add station')
        }
    }

    async function onUpdateStation(station) {
        // const speed = +prompt('New speed?', station.speed) || 0
        // if(speed === 0 || speed === station.speed) return

        const stationToSave = { ...station, }
        try {
            const savedStation = await updateStation(stationToSave)
            // showSuccessMsg(`Station updated, new speed: ${savedStation.speed}`)
        } catch (err) {
            showErrorMsg('Cannot update station')
        }
    }

    return (

        <section className="station-index container ">
            <Loader isLoading={isLoading}>
                <div className="gradient" style={{
                    '--avg-color': gradientColor,
                    background: `linear-gradient(var(--avg-color)0%, rgba(0, 0, 0, 0) 50%)`,
                    transition: '--avg-color 0.5s ease-in-out'

                }}>
                    <header>
                        <div className="filter-btns">
                            <button>All</button>
                            <button>Music</button>
                        </div>
                        {/* {userService.getLoggedinUser() && <button onClick={onAddStation}>Add a Station</button>} */}
                    </header>
                    <div className="body">
                        {/* <StationFilter filterBy={filterBy} setFilterBy={setFilterBy} /> */}
                        <StationList
                            stations={stations}
                            onRemoveStation={onRemoveStation}
                            onUpdateStation={onUpdateStation}
                            setGradientColor={setGradientColor}
                        />
                        <StationCarousel stations={stations.slice(0, 7)} />
                        <StationCarousel stations={stations.slice(7, 14)} />
                        <StationCarousel stations={stations.slice(14)} />
                    </div>
                </div>
            </Loader>
        </section>

    )
}