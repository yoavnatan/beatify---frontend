import axios from "axios"
import { loadFromStorage, saveToStorage } from "./util.service.js"

const STORAGE_KEY_VIDEOS = 'videosDB'



export const searchMusicService = {
    searchMusic,
    getYoutubeURL,
    getSongById,
    searchArtist,
    getArtistSongs,
    getSong,
    getArtistBio,
}

async function searchMusic(query) {

    const API_URL = `https://corsproxy.io/?https://api.deezer.com/search?q=${query}&limit=10`

    try {
        const res = await axios.get(API_URL)
        const searchData = res.data.data
        console.log(searchData)
        return searchData
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function getSongById(songId) {

    const API_URL = `https://corsproxy.io/?https://api.deezer.com/track/${songId}`
    try {
        const res = await axios.get(API_URL)
        const searchData = res.data

        const songToPlay = await getYoutubeURL(searchData)
        let song = {
            id: searchData.id,
            imgUrl: `https://e-cdns-images.dzcdn.net/images/cover/${searchData.md5_image}/220x220.jpg`,
            title: searchData.title,
            src: songToPlay.src || ''
        }
        return song
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function searchArtist(query) {
    const API_URL = `https://corsproxy.io/?https://api.deezer.com/search/artist?q=${query}&limit=3`

    try {
        const res = await axios.get(API_URL)
        const searchData = res.data.data
        console.log(searchData)
        return searchData
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function getArtistSongs(URL) {

    const API_URL = `https://corsproxy.io/?${URL}`
    try {
        const res = await axios.get(API_URL)
        const searchData = res.data.data
        const songs = await Promise.all(searchData.map(res => getSong(res.id)))
        return songs
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function getSong(id) {

    const API_URL = `https://corsproxy.io/?https://api.deezer.com/track/${id}`
    try {
        const res = await axios.get(API_URL)
        const searchData = res.data

        let song = {
            id: searchData.id,
            imgUrl: `https://e-cdns-images.dzcdn.net/images/cover/${searchData.md5_image}/220x220.jpg`,
            title: searchData.title,
        }
        return song
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function getArtistBio(artist) {
    const API_KEY = import.meta.env.VITE_LASTFM_API_KEY
    const API_URL = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=${API_KEY}&format=json`
    try {
        const res = await axios.get(API_URL)
        console.log(res)
        const searchData = res.data.artist.bio.summary
        return searchData
    } catch (err) {
        console.error(err)
        throw err
    }

}

async function getYoutubeURL(query) {
    let gVideosCache = loadFromStorage(STORAGE_KEY_VIDEOS) || []
    const srcFromCache = (gVideosCache.find(video => video.id === query.id))

    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
    const URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${query.title} ${query.artist?.name}&key=${API_KEY}`
    const song = { ...query, id: query.id, imgUrl: `https://e-cdns-images.dzcdn.net/images/cover/${query.md5_image}/220x220.jpg`, title: query.title }
    if (!query.md5_image) song.imgUrl = query.imgUrl
    let embedUrl
    if (srcFromCache) {
        embedUrl = srcFromCache.src
        song.src = embedUrl

        console.log('from cache')
        console.log(song)
        return song
    } else {
        try {
            const res = await axios.get(URL)
            console.log('from youtube api')

            const youtubeRes = res.data

            if (youtubeRes.items && youtubeRes.items.length > 0) {
                const videoId = youtubeRes.items[0].id.videoId;
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
                song.src = embedUrl || ""
                gVideosCache.push(song)
                saveToStorage(STORAGE_KEY_VIDEOS, gVideosCache)
                return song
            }
        } catch (err) {
            console.log(err)
            throw err
        }

    }

}



