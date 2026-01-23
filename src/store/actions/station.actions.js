import { stationService } from '../../services/station/station.service.remote.js'
import { store } from '../store.js'
import { ADD_STATION, REMOVE_STATION, SET_STATIONS, SET_STATION, UPDATE_STATION, ADD_STATION_MSG } from '../reducers/station.reducer'
import { LOADING_DONE, LOADING_START } from '../reducers/system.reducer.js'

export async function loadStations(filterBy) {
    store.dispatch({ type: LOADING_START })

    try {
        const stations = await stationService.query(filterBy)
        store.dispatch(getCmdSetStations(stations))
    } catch (err) {
        console.log('Cannot load stations', err)
        throw err
    } finally {
        //* mimic server delay
        setTimeout(() => {
            store.dispatch({ type: LOADING_DONE })
        }, 300)
    }

}

export async function loadLikedSongsStation() {
    try {
        const station = await stationService.getLikedSongsStation()
        store.dispatch(getCmdSetStation(station))
    } catch (err) {
        console.log('Cannot load station', err)
        throw err
    }
}

export async function loadStation(stationId) {
    try {
        const station = await stationService.getById(stationId)
        store.dispatch(getCmdSetStation(station))
    } catch (err) {
        console.log('Cannot load station', err)
        throw err
    }
}


export async function removeStation(stationId) {
    try {
        await stationService.removeStation(stationId)
        store.dispatch(getCmdRemoveStation(stationId))
    } catch (err) {
        console.log('Cannot remove station', err)
        throw err
    }
}

export async function addSongToStation(song, stationId) {

    const stations = store.getState().stationModule.stations
    const stationToUpdate = stations.find(station => station._id === stationId)
    if (stationToUpdate.songs.find(s => s.id === song.id)) return
    const songToAdd = {
        ...song,
        id: song.id,
        title: song.title,
        imgUrl: song.imgUrl ? song.imgUrl : `https://e-cdns-images.dzcdn.net/images/cover/${song.md5_image}/220x220.jpg`,
    }
    console.log(songToAdd)
    try {
        const updatedStation = await stationService.addSong(songToAdd, stationId)
        store.dispatch(getCmdUpdateStation(updatedStation))
    } catch (err) {
        console.log('Cnnout add song', err)
        throw err
    }
}


export async function removeSong(songId, stationId) {
    try {
        const updatedStation = await stationService.removeSong(songId, stationId)
        store.dispatch(getCmdUpdateStation(updatedStation))
    } catch (err) {
        console.log('Cannot remove song', err)
        throw err
    }
}


export async function addStation(station) {
    try {
        const savedStation = await stationService.save(station)
        store.dispatch(getCmdAddStation(savedStation))
        return savedStation
    } catch (err) {
        console.log('Cannot add station', err)
        throw err
    }
}



export async function updateStation(station) {
    try {
        const savedStation = await stationService.save(station)
        store.dispatch(getCmdUpdateStation(savedStation))
        return savedStation
    } catch (err) {
        console.log('Cannot save station', err)
        throw err
    }
}

export async function addStationMsg(stationId, txt) {
    try {
        const msg = await stationService.addStationMsg(stationId, txt)
        store.dispatch(getCmdAddStationMsg(msg))
        return msg
    } catch (err) {
        console.log('Cannot add station msg', err)
        throw err
    }
}

// Command Creators:
function getCmdSetStations(stations) {
    return {
        type: SET_STATIONS,
        stations
    }
}
function getCmdSetStation(station) {
    return {
        type: SET_STATION,
        station
    }
}
function getCmdRemoveStation(stationId) {
    return {
        type: REMOVE_STATION,
        stationId
    }
}
function getCmdAddStation(station) {
    return {
        type: ADD_STATION,
        station
    }
}
function getCmdUpdateStation(station) {
    return {
        type: UPDATE_STATION,
        station
    }
}
function getCmdAddStationMsg(msg) {
    return {
        type: ADD_STATION_MSG,
        msg
    }
}


// unitTestActions()
async function unitTestActions() {
    await loadStations()
    await addStation(stationService.getEmptyStation())
    await updateStation({
        _id: 'm1oC7',
        // vendor: 'Station-Good',
    })
    await removeStation('m1oC7')
    // TODO unit test addStationMsg
}
