import axios from "axios"

export const searchMusicService = {
    searchMusic,
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


