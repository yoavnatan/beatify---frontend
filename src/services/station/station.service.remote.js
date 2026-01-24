import { httpService } from '../http.service'
import { FastAverageColor } from 'fast-average-color'
import { searchMusicService } from '../searchMusic.service'

const BASE_URL = 'station/'

export const stationService = {
    query,
    getById,
    save,
    removeStation,
    addStationMsg,
    addSong,
    removeSong,
    toggleLikeStation,
    getLikedSongsStation,
    likeSong,
    removeLikeSong,
    getAvgColor,
    getArtistStation,
    getDefaultFilter
}

async function query() {
    return httpService.get(BASE_URL)
}

function getById(stationId) {
    return httpService.get(`${BASE_URL}${stationId}`)
}

async function save(station) {
    if (station._id) {
        return httpService.put(`${BASE_URL}${station._id}`, station)
    } else {
        return httpService.post(BASE_URL, station)
    }
}

async function removeStation(stationId) {
    return httpService.delete(`${BASE_URL}${stationId}`)
}


async function addSong(stationId, song) {
    return httpService.post(`${BASE_URL}${stationId}/song`, song)
}

async function removeSong(stationId, songId) {
    return httpService.delete(`${BASE_URL}${stationId}/song/${songId}`)
}


async function likeSong(stationId, songId) {
    return httpService.post(`${BASE_URL}${stationId}/song/${songId}/like`)
}

async function removeLikeSong(stationId, songId) {
    return httpService.delete(`${BASE_URL}${stationId}/song/${songId}/like`)
}


async function toggleLikeStation(stationId) {
    return httpService.post(`${BASE_URL}${stationId}/like`)
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


async function addStationMsg(stationId, txt) {
    return httpService.post(`${BASE_URL}${stationId}/msg`, { txt })
}


async function getArtistStation(artist) {
    console.log(artist)
    const artistStation = {
        name: artist.name,
        imgUrl: artist.picture_medium,
        description: 'Artist Station',
        createdBy: {
            fullname: '',
            _id: ''
        },
        tags: ['Artist'],
        songs: [],
        likedByUsers: [],
    }

    const songs = await searchMusicService.getArtistSongs(artist.tracklist)
    artistStation.songs = songs

    artistStation.averageColor = await getAvgColor(artistStation)

    return artistStation
}



export async function getAvgColor(station) {
    const fac = new FastAverageColor()
    try {
        const color = await fac.getColorAsync(station.imgUrl)
        return `rgba(${[...color.value.slice(0, 3), 0.5]})`
    } catch (err) {
        console.error(err)
        return 'rgba(0,0,0,1)'
    }
}


function getDefaultFilter() {
    return {
        txt: '',
        sortField: '',
        sortDir: '',
        tags: []
    }
}
