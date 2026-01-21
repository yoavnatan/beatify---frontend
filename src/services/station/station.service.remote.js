import { httpService } from '../http.service'

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

const BASE_URL = 'station/'

async function query() {
    return httpService.get(BASE_URL)
}

function getById(stationId) {
    return httpService.get(`${BASE_URL}${stationId}`)
}

async function removeStation(stationId) {
    return httpService.delete(`${BASE_URL}${stationId}`)
}

async function save(station) {
    if (station._id) {
        const stationToSave = { ...station }
        delete stationToSave._id
        return httpService.put(`${BASE_URL}${station._id}`, stationToSave)
    } else {
        return httpService.post(BASE_URL, station)
    }
}

async function addStationMsg(stationId, txt) {
    return httpService.post(`${BASE_URL}${stationId}/msg`, { txt })
}

async function addSong(stationId, song) {
    return httpService.post(`${BASE_URL}${stationId}/song`, song)
}

async function removeSong(stationId, songId) {
    return httpService.delete(`${BASE_URL}${stationId}/song/${songId}`)
}

async function toggleLikeStation(stationId) {
    return httpService.post(`${BASE_URL}${stationId}/like`)
}

async function getLikedSongsStation() {
    return httpService.get(`${BASE_URL}liked`)
}

async function likeSong(stationId, songId) {
    return httpService.post(`${BASE_URL}${stationId}/song/${songId}/like`)
}

async function removeLikeSong(stationId, songId) {
    return httpService.delete(`${BASE_URL}${stationId}/song/${songId}/like`)
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
function getDefaultFilter() {
    return {
        txt: '',
        minSpeed: '',
        sortField: '',
        sortDir: '',
    }
}

