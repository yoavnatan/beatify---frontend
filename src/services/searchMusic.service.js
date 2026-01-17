import axios from "axios"
import { loadFromStorage, saveToStorage } from "./util.service.js"

const STORAGE_KEY_VIDEOS = 'videosDB'



export const searchMusicService = {
    searchMusic,
    getYoutubeURL,
    getSongById,
}

async function searchMusic(query) {

    const API_URL = `https://corsproxy.io/?https://api.deezer.com/search?q=${query}&limit=10`

    try {
        const res = await axios.get(API_URL)
        const searchData = res.data.data
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
        console.log(searchData)

        const songToPlay = await getYoutubeURL(searchData)
        let song = {
            id: searchData.id,
            imgUrl: `https://e-cdns-images.dzcdn.net/images/cover/${searchData.md5_image}/56x56.jpg`,
            title: searchData.title,
            src: songToPlay.src
        }
        return song
    } catch (err) {
        console.error(err)
        throw err
    }
}


async function getYoutubeURL(query) {
    let gVideosCache = loadFromStorage(STORAGE_KEY_VIDEOS) || []
    const srcFromCache = (gVideosCache.find(video => video.title === query.title))

    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
    const URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${query.title}&key=${API_KEY}`
    const song = { id: query.id, imgUrl: `https://e-cdns-images.dzcdn.net/images/cover/${query.md5_image}/56x56.jpg`, title: query.title }
    if (!query.md5_image) song.imgUrl = query.imgUrl
    let embedUrl
    if (srcFromCache) {
        embedUrl = srcFromCache.src
        song.src = embedUrl

        console.log('from cache')
        return song
    } else {
        try {
            const res = await axios.get(URL)
            console.log('from youtube api')

            const youtubeRes = res.data

            if (youtubeRes.items && youtubeRes.items.length > 0) {
                const videoId = youtubeRes.items[0].id.videoId;
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
                song.src = embedUrl
                gVideosCache.push(song)
                saveToStorage(STORAGE_KEY_VIDEOS, gVideosCache)
                return song
            }
        } catch (err) {
            console.log(err)

        }

    }

}

