
import { storageService } from '../async-storage.service.js'
import { makeId, saveToStorage } from '../util.service.js'
import { userService } from '../user'
import { FastAverageColor } from 'fast-average-color';
import { searchMusicService } from '../searchMusic.service.js';
import { dataBase } from './databaselocal.js';


const STORAGE_KEY = 'station'

export const stationService = {
    query,
    getById,
    save,
    removeStation,
    removeSong,
    addSong,
    addStationMsg,
    _getStations,
    getLikedSongsStation,
    getAvgColor,
    getArtistStation,
    getGenreStation,
}
window.cs = stationService


async function query(filterBy = { txt: '' }) {
    let stations = await storageService.query(STORAGE_KEY)

    if (!stations || stations.length === 0) {
        stations = await _getStations()
        saveToStorage(STORAGE_KEY, stations)
    }
    const likedStation = await getLikedSongsStation()
    const idx = stations.findIndex(st => st._id === 'likedSongs')
    if (idx === -1) {
        stations.unshift(likedStation)
    } else {
        stations[idx] = {
            ...stations[idx],
            ...likedStation
        }
    }
    return stations

}






function getById(stationId) {
    return storageService.get(STORAGE_KEY, stationId)
}

async function removeStation(stationId) {
    await storageService.remove(STORAGE_KEY, stationId)
}

async function removeSong(songId, stationId) {
    const stations = await storageService.query(STORAGE_KEY)
    const idx = stations.findIndex(st => st._id === stationId)
    if (idx === -1) throw new Error('Station not found')
    stations[idx].songs = stations[idx].songs.filter(song => song.id !== songId)
    saveToStorage(STORAGE_KEY, stations)
    return stations[idx]
}

async function addSong(song, stationId) {
    const stations = await storageService.query(STORAGE_KEY)
    const idx = stations.findIndex(st => st._id === stationId)
    if (idx === -1) throw new Error('Station not found')
    stations[idx].songs = [song, ...stations[idx].songs]
    saveToStorage(STORAGE_KEY, stations)
    return stations[idx]
}


async function save(station) {
    const stations = await storageService.query(STORAGE_KEY)
    let savedStation
    if (station._id) {
        const idx = stations.findIndex(s => s._id === station._id)
        if (idx === -1) throw new Error('Station not found')
        stations[idx] = { ...stations[idx], ...station }
        savedStation = stations[idx]
    } else {
        station._id = 's' + Date.now()
        stations.unshift(station)
        savedStation = station
    }
    saveToStorage(STORAGE_KEY, stations)
    return savedStation
}


async function addStationMsg(stationId, txt) {
    // Later, this is all done by the backend
    const station = await getById(stationId)

    const msg = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    station.msgs.push(msg)
    await storageService.put(STORAGE_KEY, station)

    return msg
}


async function _getStations() {
    let stations = dataBase



    stations = await _getAvgColors(stations)
    saveToStorage(STORAGE_KEY, stations)
    return stations
}

async function getLikedSongsStation() {
    let likedSongs
    const user = userService.getLoggedinUser()
    if (!user.likedSongs) user.likedSongs = []

    likedSongs = await Promise.all(user.likedSongs.map(songId => (
        searchMusicService.getSong(songId)
    )))
    return {
        _id: 'likedSongs',
        name: 'Liked Songs',
        createdBy: { fullname: user.fullname || "You" },
        songs: likedSongs,
        imgUrl: "https://misc.scdn.co/liked-songs/liked-songs-300.png",
        averageColor: 'rgba(47, 38, 89, 0.9)'
    }
}




async function _getAvgColors(stations) {
    await Promise.all(
        stations.map(async station => {
            const fac = new FastAverageColor()
            try {
                const color = await fac.getColorAsync(station.songs[0].imgUrl)
                station.averageColor = `rgba(${[...color.value.slice(0, 3), 0.5]})`

            } catch (err) {
                console.error(err)
                station.averageColor = 'rgba(0,0,0,1)'

            }
        })
    )
    return stations
}

async function getAvgColor(station) {
    const fac = new FastAverageColor()
    try {
        const color = await fac.getColorAsync(station.imgUrl)
        return `rgba(${[...color.value.slice(0, 3), 0.5]})`
    } catch (err) {
        console.error(err)
        return 'rgba(0,0,0,1)'
    }
}


async function getArtistStation(artist) {
    const artistStation = {
        name: artist.name,
        imgUrl: artist.picture_medium,
        description: "artist",
        createdBy:
        {
            fullname: "",
            _id: ""
        },
    }

    const songs = await searchMusicService.getArtistSongs(artist.tracklist)
    artistStation.songs = songs
    const avgColor = await getAvgColor(artistStation)
    artistStation.averageColor = avgColor
    console.log(artistStation)
    return artistStation
}

async function getGenreStation(genre) {
    const genreStation = {
        name: genre.name,
        imgUrl: genre.picture_big,
        description: "Genre",
        createdBy:
        {
            fullname: "",
            _id: ""
        },
    }

    const songs = await searchMusicService.getGenreSongs(genre.id)
    genreStation.songs = songs
    const avgColor = await getAvgColor(genreStation)
    genreStation.averageColor = avgColor
    console.log(genreStation)
    return genreStation
}
