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
    return httpService.get(`${BASE_URL}liked`)
}


async function addStationMsg(stationId, txt) {
    return httpService.post(`${BASE_URL}${stationId}/msg`, { txt })
}


async function getArtistStation(artist) {
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
        likedByUsers: []
    }

    const songs = await searchMusicService.getArtistSongs(artist.tracklist)
    artistStation.songs = songs

    artistStation.averageColor = await getAvgColor(artistStation)

    return artistStation
}



export async function getAvgColor(station) {
  const defaultColor = 'rgba(18,18,18,1)'
  if (!station.songs || station.songs.length === 0) {
    return defaultColor
  }
  const firstSong = station.songs[0]
  const imgUrl = firstSong.imgUrl
  if (!imgUrl) return defaultColor
  const fac = new FastAverageColor()
  try {
    const color = await fac.getColorAsync(imgUrl)
    return `rgba(${color.value[0]}, ${color.value[1]}, ${color.value[2]}, 0.5)`
  } catch (err) {
    console.error('Failed to get average color:', err)
    return defaultColor
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
