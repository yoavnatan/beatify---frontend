import { httpService } from '../http.service'
import { FastAverageColor } from 'fast-average-color'
import { searchMusicService } from '../searchMusic.service'
import { userService } from '../user/user.service.remote.js'

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
    getDefaultFilter,
    getAvgColors,
    getGenreStation,
    addStationToLibrary,
    getAlbumStation,
}
async function addStationToLibrary(user, stationId) {
    return httpService.post(`${BASE_URL}${stationId}/addToLibrary`, { user })
}

async function query() {
    return httpService.get(BASE_URL)
}

function getById(stationId) {
    return httpService.get(`${BASE_URL}${stationId}`)
}

async function save(station) {
    if (station._id) {
        return httpService.put(`station/${station._id}`, station)
    } else {
        return httpService.post('station', station)
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
        color: 'rgba(54, 32, 127, 0.9)'
    }
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
            fullname: 'Beatify',
            _id: 'System'
        },
        tags: ['Artist'],
        songs: [],
        likedByUsers: [],
    }

    const songs = await searchMusicService.getArtistSongs(artist.tracklist)
    artistStation.songs = songs

    // artistStation.averageColor = await getAvgColor(artistStation)

    return artistStation
}

async function getAlbumStation(album) {
    console.log(album)
    const albumStation = {
        name: album.title,
        imgUrl: album.cover_big,
        description: 'Album Station',
        createdBy: {
            fullname: 'Beatify',
            _id: 'System'
        },
        tags: ['Album'],
        songs: [],
        likedByUsers: [],
    }

    const songs = await searchMusicService.getArtistSongs(album.tracklist)
    albumStation.songs = songs


    return albumStation
}

async function getGenreStation(genre) {
    const genreStation = {
        name: genre.name,
        imgUrl: genre.picture_big,
        description: "Genre",
        createdBy:
        {
            fullname: 'Beatify',
            _id: 'System'
        },
    }

    const songs = await searchMusicService.getGenreSongs(genre.id)
    genreStation.songs = songs
    // const avgColor = await getAvgColor(genreStation)
    // genreStation.averageColor = avgColor
    // console.log(genreStation)
    return genreStation
}


async function getAvgColors(stations) {
    await Promise.all(
        stations.map(async station => {
            try {
                const color = await getColorFromUrl(station.songs?.[0]?.imgUrl || station.songs?.[0]?.album?.cover_big)
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
    if (!station || station.songs.length <= 0) return 'rgba(0,0,0,1)'
    if (!station.songs?.[0]) {
        return Promise.resolve('rgba(52, 52, 52, 0.5)')
    }

    const imgUrl = station.songs[0].imgUrl || station.songs[0].album?.cover_big
    try {
        if (imgUrl) {
            const color = await getColorFromUrl(imgUrl)
            return `rgba(${[...color.value.slice(0, 3), 0.5]})`
        }
    } catch (err) {
        console.error(err)
        return 'rgba(0,0,0,1)'
    }
}

async function getColorFromUrl(imgUrl) {
    if (!imgUrl) throw new Error('No image URL')

    const img = new Image()
    img.crossOrigin = 'anonymous'

    await new Promise((resolve, reject) => {
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = imgUrl
    })

    const fac = new FastAverageColor()
    return fac.getColor(img)
}




function getDefaultFilter() {
    return {
        txt: '',
        sortField: '',
        sortDir: '',
        tags: []
    }
}
