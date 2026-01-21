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
    getLikedSongsStation
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
