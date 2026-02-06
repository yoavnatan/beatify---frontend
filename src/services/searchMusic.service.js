import axios from "axios"
import { loadFromStorage, saveToStorage } from "./util.service.js"
import { showErrorMsg } from "./event-bus.service.js"

const STORAGE_KEY_VIDEOS = 'videosDB'


const BASE_URL = import.meta.env.PROD
    ? ''
    : 'http://localhost:3030'


function _getApiUrl(url) {
    return `${BASE_URL}/api/deezer?url=${encodeURIComponent(url)}`
}

export const searchMusicService = {
    searchMusic,
    getYoutubeURL,
    getSongById,
    searchArtist,
    getArtistSongs,
    getSong,
    getArtistBio,
    getGenres,
    getGenreSongs
}

async function searchMusic(query) {
    const url = `https://api.deezer.com/search?q=${query}&limit=10`
    try {
        const res = await axios.get(_getApiUrl(url))
        return res.data.data
    } catch (err) {
        console.error('Error in searchMusic:', err)
        throw err
    }
}

async function getSongById(songId) {
    const url = `https://api.deezer.com/track/${songId}`
    try {
        const res = await axios.get(_getApiUrl(url))
        const searchData = res.data

        const songToPlay = await getYoutubeURL(searchData)
        return {
            id: searchData.id,
            imgUrl: `https://e-cdns-images.dzcdn.net/images/cover/${searchData.md5_image}/220x220.jpg`,
            title: searchData.title,
            src: songToPlay.src || ''
        }
    } catch (err) {
        console.error('Error in getSongById:', err)
        throw err
    }
}

async function searchArtist(query) {
    const url = `https://api.deezer.com/search/artist?q=${query}&limit=3`
    try {
        const res = await axios.get(_getApiUrl(url))
        return res.data.data
    } catch (err) {
        console.error('Error in searchArtist:', err)
        throw err
    }
}

async function getArtistSongs(URL) {
    try {
        const res = await axios.get(_getApiUrl(URL))
        const searchData = res.data.data
        return await Promise.all(searchData.map(res => getSong(res.id)))
    } catch (err) {
        console.error('Error in getArtistSongs:', err)
        showErrorMsg('Could not find this artist')
        throw err
    }
}

async function getSong(id) {
    const url = `https://api.deezer.com/track/${id}`
    try {
        const res = await axios.get(_getApiUrl(url))
        const searchData = res.data
        return {
            ...searchData,
            id: searchData.id,
            imgUrl: `https://e-cdns-images.dzcdn.net/images/cover/${searchData.md5_image}/220x220.jpg`,
            title: searchData.title,
        }
    } catch (err) {
        console.error('Error in getSong:', err)
        throw err
    }
}

async function getArtistBio(artist) {
    const API_KEY = import.meta.env.VITE_LASTFM_API_KEY
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist)}&api_key=${API_KEY}&format=json`
    try {
        // ב-LastFM בדרך כלל אין בעיית CORS, אז פונים ישירות
        const res = await axios.get(url)
        return res.data.artist.bio.summary
    } catch (err) {
        console.error('Error in getArtistBio:', err)
        throw err
    }
}

async function getGenres() {
    const url = `https://api.deezer.com/genre`
    try {
        const res = await axios.get(_getApiUrl(url))
        return res.data.data
    } catch (err) {
        console.error('Error in getGenres:', err)
        throw err
    }
}

async function getGenreSongs(genreId) {
    const url = `https://api.deezer.com/chart/${genreId}/tracks?limit=20`
    try {
        const res = await axios.get(_getApiUrl(url))
        const searchData = res.data.data
        return await Promise.all(searchData.map(res => getSong(res.id)))
    } catch (err) {
        console.error('Error in getGenreSongs:', err)
        throw err
    }
}

async function getYoutubeURL(query) {
    let gVideosCache = loadFromStorage(STORAGE_KEY_VIDEOS) || []
    const srcFromCache = gVideosCache.find(video => video.id === query.id)

    if (srcFromCache) {
        console.log('from cache')
        return srcFromCache
    }

    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
    const searchTerm = encodeURIComponent(`${query.title} ${query.artist?.name || ''}`)
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${searchTerm}&key=${API_KEY}`

    const song = {
        ...query,
        id: query.id,
        imgUrl: query.imgUrl || `https://e-cdns-images.dzcdn.net/images/cover/${query.md5_image}/220x220.jpg`,
        title: query.title
    }

    try {
        const res = await axios.get(url)
        const youtubeRes = res.data

        if (youtubeRes.items && youtubeRes.items.length > 0) {
            const videoId = youtubeRes.items[0].id.videoId
            song.src = `https://www.youtube.com/embed/${videoId}`

            gVideosCache.push(song)
            saveToStorage(STORAGE_KEY_VIDEOS, gVideosCache)
            return song
        }
        return song
    } catch (err) {
        console.error('Youtube API error:', err)
        throw err
    }
}