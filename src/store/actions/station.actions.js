import { stationService } from '../../services/station/station.service.remote.js'
import { store } from '../store.js'
import { ADD_STATION, REMOVE_STATION, SET_STATIONS, SET_STATION, UPDATE_STATION, ADD_STATION_MSG, SET_STATION_SONGS, SET_NOW_PLAYING_STATION } from '../reducers/station.reducer'
import { LOADING_DONE, LOADING_START } from '../reducers/system.reducer.js'
import { searchMusicService } from '../../services/searchMusic.service.js'
import { setSong } from './player.actions.js'
import { PLAY, SET_LAST_CLICKED } from '../reducers/player.reducer.js'




export async function loadStations(filterBy) {
    store.dispatch({ type: LOADING_START })

    try {
        const stations = await stationService.query(filterBy)
        store.dispatch(getCmdSetStations(stations))
        if (!store.getState().playerModule.nowPlaying.id) {
            onPlayDefaultSong()
        }

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
        console.log("Cannot load liked songs station", err)
    }
}


export async function loadStation(stationId) {
    try {
        const station = await stationService.getById(stationId)
        station.color = await stationService.getAvgColor(station)
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
export async function addStationToLibrary(user, stationId) {
    const stations = store.getState().stationModule.stations
    const stationToUpdate = stations.find(station => station._id === stationId)
    try {
        const updatedStation = await stationService.addStationToLibrary(user, stationId)
        store.dispatch(getCmdUpdateStation(updatedStation))
    } catch (err) {
        console.log('Cannot add station to library', err)
        throw err
    }
}
    async function likeSong(songId) {
        const likedSongs = user.likedSongs
        if (user.likedSongs.includes(songId)) {
            let userToUpdate = { ...user, likedSongs: likedSongs.filter(song => song !== songId) }
            await updateUser(userToUpdate)
            showSuccessMsg('Song removed from Liked Songs')

        } else {
            const userToUpdate = { ...user, likedSongs: [songId, ...likedSongs] }
            await updateUser(userToUpdate)
            showSuccessMsg('Song added to Liked Songs')
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
    try {
        const updatedStation = await stationService.addSong(stationId, songToAdd)
        store.dispatch(getCmdUpdateStation(updatedStation))
    } catch (err) {
        console.log('Cnnout add song', err)
        throw err
    }
}


export async function removeSong(stationId, songId) {
    try {
        const updatedStation = await stationService.removeSong(stationId, songId)
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

async function onPlayDefaultSong() {
    let song = store.getState().stationModule.stations[0].songs[0]
    const station = store.getState().stationModule.stations[0]
    if (!song.src) {
        song = await searchMusicService.getYoutubeURL(search)
        const songsToUpdate = station.songs.map(s =>
            s.id === song.id ? { ...s, src: song.src } : s
        )
        if (station._id !== 'likedSongs') {
            const stationToUpdate = { ...station, songs: songsToUpdate }
            await updateStation(stationToUpdate)
        }
    }

    store.dispatch({ type: SET_LAST_CLICKED, lastClickedSong: song })

    setSong(song)
    // store.dispatch({ type: PLAY })
    store.dispatch({ type: SET_NOW_PLAYING_STATION, nowPlaying: station._id })
    store.dispatch({ type: SET_STATION_SONGS, stationSongs: station.songs })

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
