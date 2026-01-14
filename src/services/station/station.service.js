
import { storageService } from '../async-storage.service.js'
import { makeId, saveToStorage } from '../util.service.js'
import { userService } from '../user'
import { FastAverageColor } from 'fast-average-color';


const STORAGE_KEY = 'station'

export const stationService = {
    query,
    getById,
    save,
    remove,
    addStationMsg,
    _getStations
}
window.cs = stationService


async function query(filterBy = { txt: '' }) {
    let stations = await storageService.query(STORAGE_KEY)
    if (!stations || stations.length <= 0) stations = await _getStations()

    const { txt, sortField, sortDir, tags } = filterBy

    if (txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        stations = stations.filter(station => regex.test(station.name))
    }

    if (tags?.length) {
        stations = stations.filter(station =>
            tags.every(tag => station.tags.includes(tag))
        )
    }

    if (sortField === 'txt') {
        stations.sort((a, b) =>
            a[sortField].localeCompare(b[sortField]) * +sortDir
        )
    }

    const likedStation = await getLikedSongsStation()

    const idx = stations.findIndex(st => st._id === 'likedSongs')
    if (idx === -1) stations.unshift(likedStation)
    else stations[idx] = likedStation
    saveToStorage(STORAGE_KEY, stations)
    return stations
}


function getById(stationId) {
    return storageService.get(STORAGE_KEY, stationId)
}

async function remove(stationId) {
    await storageService.remove(STORAGE_KEY, stationId)
}

async function save(station) {
    var savedStation
    if (station._id) {
        const stationToSave = {
            _id: station._id,
            // speed: station.speed
        }
        savedStation = await storageService.put(STORAGE_KEY, stationToSave)
    } else {
        const stationToSave = {
            // vendor: station.vendor,
            // speed: station.speed,
            // Later, owner is set by the backend
            owner: userService.getLoggedinUser(),
            msgs: []
        }
        savedStation = await storageService.post(STORAGE_KEY, stationToSave)
    }
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
    let stations = [


        {


            _id: 'st001',
            name: 'Indie Chill',
            tags: ['Indie', 'Chill', 'Alternative'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'wXhTHyIgQ_U', title: 'Arctic Monkeys - Do I Wanna Know?', embedUrl: 'https://www.youtube.com/embed/wXhTHyIgQ_U', imgUrl: 'https://img.youtube.com/vi/wXhTHyIgQ_U/hqdefault.jpg' },
                { id: 'NUC2EQvdzmY', title: 'Tame Impala - The Less I Know The Better', embedUrl: 'https://www.youtube.com/embed/NUC2EQvdzmY', imgUrl: 'https://img.youtube.com/vi/NUC2EQvdzmY/hqdefault.jpg' },
                { id: 'pXRviuL6vMY', title: 'Radiohead - Karma Police', embedUrl: 'https://www.youtube.com/embed/pXRviuL6vMY', imgUrl: 'https://img.youtube.com/vi/pXRviuL6vMY/hqdefault.jpg' },
                { id: 'd020hcWA_Wg', title: 'alt-J - Breezeblocks', embedUrl: 'https://www.youtube.com/embed/d020hcWA_Wg', imgUrl: 'https://img.youtube.com/vi/d020hcWA_Wg/hqdefault.jpg' },
                { id: 'IcrbM1l_BoI', title: 'Glass Animals - Heat Waves', embedUrl: 'https://www.youtube.com/embed/IcrbM1l_BoI', imgUrl: 'https://img.youtube.com/vi/IcrbM1l_BoI/hqdefault.jpg' },
                { id: '1V_xRb0x9aw', title: 'The Strokes - Reptilia', embedUrl: 'https://www.youtube.com/embed/1V_xRb0x9aw', imgUrl: 'https://img.youtube.com/vi/1V_xRb0x9aw/hqdefault.jpg' },
                { id: 'lBFdX37Qpnk', title: 'Bon Iver - Holocene', embedUrl: 'https://www.youtube.com/embed/lBFdX37Qpnk', imgUrl: 'https://img.youtube.com/vi/lBFdX37Qpnk/hqdefault.jpg' },
                { id: 'KQetemT1sWc', title: 'Phoenix - Lisztomania', embedUrl: 'https://www.youtube.com/embed/KQetemT1sWc', imgUrl: 'https://img.youtube.com/vi/KQetemT1sWc/hqdefault.jpg' },
                { id: 'fe4EK4HSPkI', title: 'MGMT - Electric Feel', embedUrl: 'https://www.youtube.com/embed/fe4EK4HSPkI', imgUrl: 'https://img.youtube.com/vi/fe4EK4HSPkI/hqdefault.jpg' },
                { id: '0KSOMA3QBU0', title: 'Coldplay - Yellow', embedUrl: 'https://www.youtube.com/embed/0KSOMA3QBU0', imgUrl: 'https://img.youtube.com/vi/0KSOMA3QBU0/hqdefault.jpg' },
                { id: 'bpOSxM0rNPM', title: 'Arctic Monkeys - R U Mine?', embedUrl: 'https://www.youtube.com/embed/bpOSxM0rNPM', imgUrl: 'https://img.youtube.com/vi/bpOSxM0rNPM/hqdefault.jpg' },
                { id: 'ktvTqknDobU', title: 'Imagine Dragons - Radioactive', embedUrl: 'https://www.youtube.com/embed/ktvTqknDobU', imgUrl: 'https://img.youtube.com/vi/ktvTqknDobU/hqdefault.jpg' },
                { id: '5NV6Rdv1a3I', title: 'Daft Punk - Get Lucky', embedUrl: 'https://www.youtube.com/embed/5NV6Rdv1a3I', imgUrl: 'https://img.youtube.com/vi/5NV6Rdv1a3I/hqdefault.jpg' },
                { id: 'hTWKbfoikeg', title: 'Nirvana - Smells Like Teen Spirit', embedUrl: 'https://www.youtube.com/embed/hTWKbfoikeg', imgUrl: 'https://img.youtube.com/vi/hTWKbfoikeg/hqdefault.jpg' },
                { id: 'fLexgOxsZu0', title: 'RHCP - Under The Bridge', embedUrl: 'https://www.youtube.com/embed/fLexgOxsZu0', imgUrl: 'https://img.youtube.com/vi/fLexgOxsZu0/hqdefault.jpg' }
            ]
        },



        {
            _id: 'st003',
            name: 'Global Pop',
            tags: ['Pop', 'Hits'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'JGwWNGJdvx8', title: 'Ed Sheeran - Shape of You', embedUrl: 'https://www.youtube.com/embed/JGwWNGJdvx8', imgUrl: 'https://img.youtube.com/vi/JGwWNGJdvx8/hqdefault.jpg' },
                { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito', embedUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk', imgUrl: 'https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg' },
                { id: 'OPf0YbXqDm0', title: 'Mark Ronson - Uptown Funk', embedUrl: 'https://www.youtube.com/embed/OPf0YbXqDm0', imgUrl: 'https://img.youtube.com/vi/OPf0YbXqDm0/hqdefault.jpg' },
                { id: 'YQHsXMglC9A', title: 'Adele - Hello', embedUrl: 'https://www.youtube.com/embed/YQHsXMglC9A', imgUrl: 'https://img.youtube.com/vi/YQHsXMglC9A/hqdefault.jpg' },
                { id: 'RgKAFK5djSk', title: 'Wiz Khalifa - See You Again', embedUrl: 'https://www.youtube.com/embed/RgKAFK5djSk', imgUrl: 'https://img.youtube.com/vi/RgKAFK5djSk/hqdefault.jpg' },
                { id: 'SlPhMPnQ58k', title: 'Taylor Swift - Blank Space', embedUrl: 'https://www.youtube.com/embed/SlPhMPnQ58k', imgUrl: 'https://img.youtube.com/vi/SlPhMPnQ58k/hqdefault.jpg' },
                { id: 'nfWlot6h_JM', title: 'Taylor Swift - Shake It Off', embedUrl: 'https://www.youtube.com/embed/nfWlot6h_JM', imgUrl: 'https://img.youtube.com/vi/nfWlot6h_JM/hqdefault.jpg' },
                { id: '2Vv-BfVoq4g', title: 'Ed Sheeran - Perfect', embedUrl: 'https://www.youtube.com/embed/2Vv-BfVoq4g', imgUrl: 'https://img.youtube.com/vi/2Vv-BfVoq4g/hqdefault.jpg' },
                { id: '09R8_2nJtjg', title: 'Maroon 5 - Sugar', embedUrl: 'https://www.youtube.com/embed/09R8_2nJtjg', imgUrl: 'https://img.youtube.com/vi/09R8_2nJtjg/hqdefault.jpg' },
                { id: 'fRh_vgS2dFE', title: 'Justin Bieber - Sorry', embedUrl: 'https://www.youtube.com/embed/fRh_vgS2dFE', imgUrl: 'https://img.youtube.com/vi/fRh_vgS2dFE/hqdefault.jpg' },
                { id: 'lp-EO5I60KA', title: 'Katy Perry - Roar', embedUrl: 'https://www.youtube.com/embed/lp-EO5I60KA', imgUrl: 'https://img.youtube.com/vi/lp-EO5I60KA/hqdefault.jpg' },
                { id: 'CevxZvSJLk8', title: 'Katy Perry - Dark Horse', embedUrl: 'https://www.youtube.com/embed/CevxZvSJLk8', imgUrl: 'https://img.youtube.com/vi/CevxZvSJLk8/hqdefault.jpg' },
                { id: 'e-ORhEE9VVg', title: 'Taylor Swift - Style', embedUrl: 'https://www.youtube.com/embed/e-ORhEE9VVg', imgUrl: 'https://img.youtube.com/vi/e-ORhEE9VVg/hqdefault.jpg' },
                { id: 'uelHwf8o7_U', title: 'Eminem - Love The Way You Lie', embedUrl: 'https://www.youtube.com/embed/uelHwf8o7_U', imgUrl: 'https://img.youtube.com/vi/uelHwf8o7_U/hqdefault.jpg' },
                { id: 'KQ6zr6kCPj8', title: 'Bruno Mars - Just The Way You Are', embedUrl: 'https://www.youtube.com/embed/KQ6zr6kCPj8', imgUrl: 'https://img.youtube.com/vi/KQ6zr6kCPj8/hqdefault.jpg' }
            ]
        },

        {
            _id: 'st004',
            name: '90s Rock',
            tags: ['Rock', '90s', 'Classic'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'eVTXPUF4Oz4', title: 'Linkin Park - In The End', embedUrl: 'https://www.youtube.com/embed/eVTXPUF4Oz4', imgUrl: 'https://img.youtube.com/vi/eVTXPUF4Oz4/hqdefault.jpg' },
                { id: 'CSvFpBOe8eY', title: 'Oasis - Wonderwall', embedUrl: 'https://www.youtube.com/embed/CSvFpBOe8eY', imgUrl: 'https://img.youtube.com/vi/CSvFpBOe8eY/hqdefault.jpg' },
                { id: 'hTWKbfoikeg', title: 'Nirvana - Smells Like Teen Spirit', embedUrl: 'https://www.youtube.com/embed/hTWKbfoikeg', imgUrl: 'https://img.youtube.com/vi/hTWKbfoikeg/hqdefault.jpg' },
                { id: 'xwtdhWltSIg', title: 'Metallica - Nothing Else Matters', embedUrl: 'https://www.youtube.com/embed/xwtdhWltSIg', imgUrl: 'https://img.youtube.com/vi/xwtdhWltSIg/hqdefault.jpg' },
                { id: 'sTSA_sWGM44', title: 'RHCP - Californication', embedUrl: 'https://www.youtube.com/embed/sTSA_sWGM44', imgUrl: 'https://img.youtube.com/vi/sTSA_sWGM44/hqdefault.jpg' },
                { id: 'K90y6PIzIaE', title: 'Blur - Song 2', embedUrl: 'https://www.youtube.com/embed/K90y6PIzIaE', imgUrl: 'https://img.youtube.com/vi/K90y6PIzIaE/hqdefault.jpg' },
                { id: 'H0L9v5xZ0kE', title: 'The Verve - Bitter Sweet Symphony', embedUrl: 'https://www.youtube.com/embed/H0L9v5xZ0kE', imgUrl: 'https://img.youtube.com/vi/H0L9v5xZ0kE/hqdefault.jpg' },
                { id: '8SbUC-UaAxE', title: 'Green Day - Basket Case', embedUrl: 'https://www.youtube.com/embed/8SbUC-UaAxE', imgUrl: 'https://img.youtube.com/vi/8SbUC-UaAxE/hqdefault.jpg' },
                { id: 'fLexgOxsZu0', title: 'RHCP - Under The Bridge', embedUrl: 'https://www.youtube.com/embed/fLexgOxsZu0', imgUrl: 'https://img.youtube.com/vi/fLexgOxsZu0/hqdefault.jpg' },
                { id: 'SBjQ9tuuTJQ', title: 'Pearl Jam - Alive', embedUrl: 'https://www.youtube.com/embed/SBjQ9tuuTJQ', imgUrl: 'https://img.youtube.com/vi/SBjQ9tuuTJQ/hqdefault.jpg' },
                { id: 'iywaBOMvYLI', title: 'Soundgarden - Black Hole Sun', embedUrl: 'https://www.youtube.com/embed/iywaBOMvYLI', imgUrl: 'https://img.youtube.com/vi/iywaBOMvYLI/hqdefault.jpg' },
                { id: 'n6P0SitRwy8', title: 'Foo Fighters - Everlong', embedUrl: 'https://www.youtube.com/embed/n6P0SitRwy8', imgUrl: 'https://img.youtube.com/vi/n6P0SitRwy8/hqdefault.jpg' },
                { id: 'L_jWHffIx5E', title: 'Smash Mouth - All Star', embedUrl: 'https://www.youtube.com/embed/L_jWHffIx5E', imgUrl: 'https://img.youtube.com/vi/L_jWHffIx5E/hqdefault.jpg' },
                { id: 'ONSVzG6TQxY', title: 'U2 - One', embedUrl: 'https://www.youtube.com/embed/ONSVzG6TQxY', imgUrl: 'https://img.youtube.com/vi/ONSVzG6TQxY/hqdefault.jpg' },
                { id: 'aCyGvGEtOwc', title: 'R.E.M. - Losing My Religion', embedUrl: 'https://www.youtube.com/embed/aCyGvGEtOwc', imgUrl: 'https://img.youtube.com/vi/aCyGvGEtOwc/hqdefault.jpg' }
            ]
        },

        {
            _id: 'st005',
            name: 'Hip Hop Essentials',
            tags: ['HipHop', 'Rap'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'hI8A14Qcv68', title: 'Dr. Dre - Still D.R.E.', embedUrl: 'https://www.youtube.com/embed/hI8A14Qcv68', imgUrl: 'https://img.youtube.com/vi/hI8A14Qcv68/hqdefault.jpg' },
                { id: '8WEtxJ4-sh4', title: '2Pac - Changes', embedUrl: 'https://www.youtube.com/embed/8WEtxJ4-sh4', imgUrl: 'https://img.youtube.com/vi/8WEtxJ4-sh4/hqdefault.jpg' },
                { id: 'eJO5HU_7_1w', title: 'Eminem - Lose Yourself', embedUrl: 'https://www.youtube.com/embed/eJO5HU_7_1w', imgUrl: 'https://img.youtube.com/vi/eJO5HU_7_1w/hqdefault.jpg' },
                { id: 'rTKpYJ80OVQ', title: 'Notorious B.I.G. - Juicy', embedUrl: 'https://www.youtube.com/embed/rTKpYJ80OVQ', imgUrl: 'https://img.youtube.com/vi/rTKpYJ80OVQ/hqdefault.jpg' },
                { id: '3tmd-ClpJxA', title: 'Drake - Hotline Bling', embedUrl: 'https://www.youtube.com/embed/3tmd-ClpJxA', imgUrl: 'https://img.youtube.com/vi/3tmd-ClpJxA/hqdefault.jpg' },
                { id: '1w7OgIMMRc4', title: 'Jay-Z & Alicia Keys - Empire State of Mind', embedUrl: 'https://www.youtube.com/embed/1w7OgIMMRc4', imgUrl: 'https://img.youtube.com/vi/1w7OgIMMRc4/hqdefault.jpg' },
                { id: 'uelHwf8o7_U', title: 'Eminem - Love The Way You Lie', embedUrl: 'https://www.youtube.com/embed/uelHwf8o7_U', imgUrl: 'https://img.youtube.com/vi/uelHwf8o7_U/hqdefault.jpg' },
                { id: 'wZJH5d5bA1A', title: 'Kanye West - Stronger', embedUrl: 'https://www.youtube.com/embed/wZJH5d5bA1A', imgUrl: 'https://img.youtube.com/vi/wZJH5d5bA1A/hqdefault.jpg' },
                { id: 'YVkUvmDQ3HY', title: '50 Cent - In Da Club', embedUrl: 'https://www.youtube.com/embed/YVkUvmDQ3HY', imgUrl: 'https://img.youtube.com/vi/YVkUvmDQ3HY/hqdefault.jpg' },
                { id: 'h2kUpz0pS2I', title: 'Kendrick Lamar - HUMBLE.', embedUrl: 'https://www.youtube.com/embed/h2kUpz0pS2I', imgUrl: 'https://img.youtube.com/vi/h2kUpz0pS2I/hqdefault.jpg' },
                { id: 'PsO6ZnUZI0g', title: 'Nas - If I Ruled The World', embedUrl: 'https://www.youtube.com/embed/PsO6ZnUZI0g', imgUrl: 'https://img.youtube.com/vi/PsO6ZnUZI0g/hqdefault.jpg' },
                { id: 'WILNIXZr2oc', title: 'Snoop Dogg - Drop It Like It’s Hot', embedUrl: 'https://www.youtube.com/embed/WILNIXZr2oc', imgUrl: 'https://img.youtube.com/vi/WILNIXZr2oc/hqdefault.jpg' },
                { id: 'RubBzkZzpUA', title: 'OutKast - Ms. Jackson', embedUrl: 'https://www.youtube.com/embed/RubBzkZzpUA', imgUrl: 'https://img.youtube.com/vi/RubBzkZzpUA/hqdefault.jpg' },
                { id: 'myTj0hYtEjs', title: 'Childish Gambino - This Is America', embedUrl: 'https://www.youtube.com/embed/myTj0hYtEjs', imgUrl: 'https://img.youtube.com/vi/myTj0hYtEjs/hqdefault.jpg' },
                { id: 'eDUAq7q2Jtw', title: 'DMX - X Gon’ Give It To Ya', embedUrl: 'https://www.youtube.com/embed/eDUAq7q2Jtw', imgUrl: 'https://img.youtube.com/vi/eDUAq7q2Jtw/hqdefault.jpg' }
            ]
        },

        {
            _id: 'st006',
            name: 'Electronic Vibes',
            tags: ['Electronic', 'EDM', 'Dance'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: '5NV6Rdv1a3I', title: 'Daft Punk - Get Lucky', embedUrl: 'https://www.youtube.com/embed/5NV6Rdv1a3I', imgUrl: 'https://img.youtube.com/vi/5NV6Rdv1a3I/hqdefault.jpg' },
                { id: '9ZfN87gSjvI', title: 'Avicii - Levels', embedUrl: 'https://www.youtube.com/embed/9ZfN87gSjvI', imgUrl: 'https://img.youtube.com/vi/9ZfN87gSjvI/hqdefault.jpg' },
                { id: 'IcrbM1l_BoI', title: 'Glass Animals - Heat Waves', embedUrl: 'https://www.youtube.com/embed/IcrbM1l_BoI', imgUrl: 'https://img.youtube.com/vi/IcrbM1l_BoI/hqdefault.jpg' },
                { id: '60ItHLz5WEA', title: 'Alan Walker - Faded', embedUrl: 'https://www.youtube.com/embed/60ItHLz5WEA', imgUrl: 'https://img.youtube.com/vi/60ItHLz5WEA/hqdefault.jpg' },
                { id: 'JRfuAukYTKg', title: 'Swedish House Mafia - Don’t You Worry Child', embedUrl: 'https://www.youtube.com/embed/JRfuAukYTKg', imgUrl: 'https://img.youtube.com/vi/JRfuAukYTKg/hqdefault.jpg' },
                { id: 'dvgZkm1xWPE', title: 'The Weeknd - Blinding Lights', embedUrl: 'https://www.youtube.com/embed/dvgZkm1xWPE', imgUrl: 'https://img.youtube.com/vi/dvgZkm1xWPE/hqdefault.jpg' },
                { id: 'hT_nvWreIhg', title: 'Avicii - Wake Me Up', embedUrl: 'https://www.youtube.com/embed/hT_nvWreIhg', imgUrl: 'https://img.youtube.com/vi/hT_nvWreIhg/hqdefault.jpg' },
                { id: 'wmin5WkOuPw', title: 'Calvin Harris - I’m Not Alone', embedUrl: 'https://www.youtube.com/embed/wmin5WkOuPw', imgUrl: 'https://img.youtube.com/vi/wmin5WkOuPw/hqdefault.jpg' },
                { id: 'kOkQ4T5WO9E', title: 'Deadmau5 - Strobe', embedUrl: 'https://www.youtube.com/embed/kOkQ4T5WO9E', imgUrl: 'https://img.youtube.com/vi/kOkQ4T5WO9E/hqdefault.jpg' },
                { id: 'EgqUJOudrcM', title: 'Justice - D.A.N.C.E.', embedUrl: 'https://www.youtube.com/embed/EgqUJOudrcM', imgUrl: 'https://img.youtube.com/vi/EgqUJOudrcM/hqdefault.jpg' },
                { id: 'PT2_F-1esPk', title: 'M83 - Midnight City', embedUrl: 'https://www.youtube.com/embed/PT2_F-1esPk', imgUrl: 'https://img.youtube.com/vi/PT2_F-1esPk/hqdefault.jpg' },
                { id: 'TG3Y1t7nHL8', title: 'Disclosure - Latch', embedUrl: 'https://www.youtube.com/embed/TG3Y1t7nHL8', imgUrl: 'https://img.youtube.com/vi/TG3Y1t7nHL8/hqdefault.jpg' },
                { id: 'fiore9Z5iUg', title: 'ODESZA - Say My Name', embedUrl: 'https://www.youtube.com/embed/fiore9Z5iUg', imgUrl: 'https://img.youtube.com/vi/fiore9Z5iUg/hqdefault.jpg' },
                { id: '2vjPBrBU-TM', title: 'Sia - Chandelier', embedUrl: 'https://www.youtube.com/embed/2vjPBrBU-TM', imgUrl: 'https://img.youtube.com/vi/2vjPBrBU-TM/hqdefault.jpg' },
                { id: 'VbfpW0pbvaU', title: 'Eric Prydz - Call On Me', embedUrl: 'https://www.youtube.com/embed/VbfpW0pbvaU', imgUrl: 'https://img.youtube.com/vi/VbfpW0pbvaU/hqdefault.jpg' }
            ]
        },

        {
            _id: 'st007',
            name: 'Workout Boost',
            tags: ['Workout', 'Energy', 'Motivation'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'fLexgOxsZu0', title: 'RHCP - Can’t Stop', embedUrl: 'https://www.youtube.com/embed/fLexgOxsZu0', imgUrl: 'https://img.youtube.com/vi/fLexgOxsZu0/hqdefault.jpg' },
                { id: 'eVTXPUF4Oz4', title: 'Linkin Park - In The End', embedUrl: 'https://www.youtube.com/embed/eVTXPUF4Oz4', imgUrl: 'https://img.youtube.com/vi/eVTXPUF4Oz4/hqdefault.jpg' },
                { id: '9bZkp7q19f0', title: 'PSY - Gangnam Style', embedUrl: 'https://www.youtube.com/embed/9bZkp7q19f0', imgUrl: 'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg' },
                { id: 'ZXsQAXx_ao0', title: 'Survivor - Eye Of The Tiger', embedUrl: 'https://www.youtube.com/embed/ZXsQAXx_ao0', imgUrl: 'https://img.youtube.com/vi/ZXsQAXx_ao0/hqdefault.jpg' },
                { id: 'nYh-n7EOtMA', title: 'Eminem - Till I Collapse', embedUrl: 'https://www.youtube.com/embed/nYh-n7EOtMA', imgUrl: 'https://img.youtube.com/vi/nYh-n7EOtMA/hqdefault.jpg' },
                { id: '3tmd-ClpJxA', title: 'Drake - Hotline Bling', embedUrl: 'https://www.youtube.com/embed/3tmd-ClpJxA', imgUrl: 'https://img.youtube.com/vi/3tmd-ClpJxA/hqdefault.jpg' },
                { id: 'YVkUvmDQ3HY', title: '50 Cent - In Da Club', embedUrl: 'https://www.youtube.com/embed/YVkUvmDQ3HY', imgUrl: 'https://img.youtube.com/vi/YVkUvmDQ3HY/hqdefault.jpg' },
                { id: 'uelHwf8o7_U', title: 'Eminem - Love The Way You Lie', embedUrl: 'https://www.youtube.com/embed/uelHwf8o7_U', imgUrl: 'https://img.youtube.com/vi/uelHwf8o7_U/hqdefault.jpg' },
                { id: 'OPf0YbXqDm0', title: 'Mark Ronson - Uptown Funk', embedUrl: 'https://www.youtube.com/embed/OPf0YbXqDm0', imgUrl: 'https://img.youtube.com/vi/OPf0YbXqDm0/hqdefault.jpg' },
                { id: 'hTWKbfoikeg', title: 'Nirvana - Smells Like Teen Spirit', embedUrl: 'https://www.youtube.com/embed/hTWKbfoikeg', imgUrl: 'https://img.youtube.com/vi/hTWKbfoikeg/hqdefault.jpg' },
                { id: 'ktvTqknDobU', title: 'Imagine Dragons - Radioactive', embedUrl: 'https://www.youtube.com/embed/ktvTqknDobU', imgUrl: 'https://img.youtube.com/vi/ktvTqknDobU/hqdefault.jpg' },
                { id: '5NV6Rdv1a3I', title: 'Daft Punk - Get Lucky', embedUrl: 'https://www.youtube.com/embed/5NV6Rdv1a3I', imgUrl: 'https://img.youtube.com/vi/5NV6Rdv1a3I/hqdefault.jpg' },
                { id: 'CevxZvSJLk8', title: 'Katy Perry - Dark Horse', embedUrl: 'https://www.youtube.com/embed/CevxZvSJLk8', imgUrl: 'https://img.youtube.com/vi/CevxZvSJLk8/hqdefault.jpg' },
                { id: 'uelHwf8o7_U', title: 'Eminem - Love The Way You Lie', embedUrl: 'https://www.youtube.com/embed/uelHwf8o7_U', imgUrl: 'https://img.youtube.com/vi/uelHwf8o7_U/hqdefault.jpg' },
                { id: 'YQHsXMglC9A', title: 'Adele - Hello', embedUrl: 'https://www.youtube.com/embed/YQHsXMglC9A', imgUrl: 'https://img.youtube.com/vi/YQHsXMglC9A/hqdefault.jpg' }
            ]
        },

        {
            _id: 'st108',
            name: 'Alternative Rock',
            tags: ['Alternative', 'Rock'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'bpOSxM0rNPM', title: 'Arctic Monkeys - R U Mine?', embedUrl: 'https://www.youtube.com/embed/bpOSxM0rNPM', imgUrl: 'https://img.youtube.com/vi/bpOSxM0rNPM/hqdefault.jpg' },
                { id: '2vjPBrBU-TM', title: 'Sia - Chandelier', embedUrl: 'https://www.youtube.com/embed/2vjPBrBU-TM', imgUrl: 'https://img.youtube.com/vi/2vjPBrBU-TM/hqdefault.jpg' },
                { id: 'L_jWHffIx5E', title: 'Smash Mouth - All Star', embedUrl: 'https://www.youtube.com/embed/L_jWHffIx5E', imgUrl: 'https://img.youtube.com/vi/L_jWHffIx5E/hqdefault.jpg' },
                { id: 'n6P0SitRwy8', title: 'Foo Fighters - Everlong', embedUrl: 'https://www.youtube.com/embed/n6P0SitRwy8', imgUrl: 'https://img.youtube.com/vi/n6P0SitRwy8/hqdefault.jpg' },
                { id: 'iywaBOMvYLI', title: 'Soundgarden - Black Hole Sun', embedUrl: 'https://www.youtube.com/embed/iywaBOMvYLI', imgUrl: 'https://img.youtube.com/vi/iywaBOMvYLI/hqdefault.jpg' },
                { id: '8SbUC-UaAxE', title: 'Green Day - Basket Case', embedUrl: 'https://www.youtube.com/embed/8SbUC-UaAxE', imgUrl: 'https://img.youtube.com/vi/8SbUC-UaAxE/hqdefault.jpg' },
                { id: 'KQetemT1sWc', title: 'Phoenix - Lisztomania', embedUrl: 'https://www.youtube.com/embed/KQetemT1sWc', imgUrl: 'https://img.youtube.com/vi/KQetemT1sWc/hqdefault.jpg' },
                { id: 'H0L9v5xZ0kE', title: 'The Verve - Bitter Sweet Symphony', embedUrl: 'https://www.youtube.com/embed/H0L9v5xZ0kE', imgUrl: 'https://img.youtube.com/vi/H0L9v5xZ0kE/hqdefault.jpg' },
                { id: 'aCyGvGEtOwc', title: 'R.E.M. - Losing My Religion', embedUrl: 'https://www.youtube.com/embed/aCyGvGEtOwc', imgUrl: 'https://img.youtube.com/vi/aCyGvGEtOwc/hqdefault.jpg' },
                { id: 'ONSVzG6TQxY', title: 'U2 - One', embedUrl: 'https://www.youtube.com/embed/ONSVzG6TQxY', imgUrl: 'https://img.youtube.com/vi/ONSVzG6TQxY/hqdefault.jpg' },
                { id: 'n6P0SitRwy8', title: 'Foo Fighters - Everlong', embedUrl: 'https://www.youtube.com/embed/n6P0SitRwy8', imgUrl: 'https://img.youtube.com/vi/n6P0SitRwy8/hqdefault.jpg' },
                { id: 'K90y6PIzIaE', title: 'Blur - Song 2', embedUrl: 'https://www.youtube.com/embed/K90y6PIzIaE', imgUrl: 'https://img.youtube.com/vi/K90y6PIzIaE/hqdefault.jpg' },
                { id: 'SBjQ9tuuTJQ', title: 'Pearl Jam - Alive', embedUrl: 'https://www.youtube.com/embed/SBjQ9tuuTJQ', imgUrl: 'https://img.youtube.com/vi/SBjQ9tuuTJQ/hqdefault.jpg' },
                { id: 'CSvFpBOe8eY', title: 'Oasis - Wonderwall', embedUrl: 'https://www.youtube.com/embed/CSvFpBOe8eY', imgUrl: 'https://img.youtube.com/vi/CSvFpBOe8eY/hqdefault.jpg' },
                { id: 'iywaBOMvYLI', title: 'Soundgarden - Black Hole Sun', embedUrl: 'https://www.youtube.com/embed/iywaBOMvYLI', imgUrl: 'https://img.youtube.com/vi/iywaBOMvYLI/hqdefault.jpg' }
            ]
        },

        {
            _id: 'st009',
            name: 'Chillhop & Lo-Fi',
            tags: ['Chillhop', 'LoFi', 'Study'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: '5qap5aO4i9A', title: 'lofi hip hop radio', embedUrl: 'https://www.youtube.com/embed/5qap5aO4i9A', imgUrl: 'https://img.youtube.com/vi/5qap5aO4i9A/hqdefault.jpg' },
                { id: 'DWcJFNfaw9c', title: 'idealism - both of us', embedUrl: 'https://www.youtube.com/embed/DWcJFNfaw9c', imgUrl: 'https://img.youtube.com/vi/DWcJFNfaw9c/hqdefault.jpg' },
                { id: 'jfKfPfyJRdk', title: 'ChilledCow - Beats', embedUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk', imgUrl: 'https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg' },
                { id: '1tZsKtnR8zE', title: 'Tomppabeats - Monday Loop', embedUrl: 'https://www.youtube.com/embed/1tZsKtnR8zE', imgUrl: 'https://img.youtube.com/vi/1tZsKtnR8zE/hqdefault.jpg' },
                { id: 'Hh9yZWeTmVM', title: 'J Dilla - Time', embedUrl: 'https://www.youtube.com/embed/Hh9yZWeTmVM', imgUrl: 'https://img.youtube.com/vi/Hh9yZWeTmVM/hqdefault.jpg' },
                { id: 'bP9gMpl1gyQ', title: 'Nujabes - Feather', embedUrl: 'https://www.youtube.com/embed/bP9gMpl1gyQ', imgUrl: 'https://img.youtube.com/vi/bP9gMpl1gyQ/hqdefault.jpg' },
                { id: 'Yx0r8Wz1c9k', title: 'Idealism - Snowfall', embedUrl: 'https://www.youtube.com/embed/Yx0r8Wz1c9k', imgUrl: 'https://img.youtube.com/vi/Yx0r8Wz1c9k/hqdefault.jpg' },
                { id: 'iEGFFyv0MH4', title: 'Joji - Slow Dancing In The Dark', embedUrl: 'https://www.youtube.com/embed/iEGFFyv0MH4', imgUrl: 'https://img.youtube.com/vi/iEGFFyv0MH4/hqdefault.jpg' },
                { id: 'mRD0-GxqHVo', title: 'Tycho - Awake', embedUrl: 'https://www.youtube.com/embed/mRD0-GxqHVo', imgUrl: 'https://img.youtube.com/vi/mRD0-GxqHVo/hqdefault.jpg' },
                { id: 'lTRiuFIWV54', title: 'Clairo - Pretty Girl', embedUrl: 'https://www.youtube.com/embed/lTRiuFIWV54', imgUrl: 'https://img.youtube.com/vi/lTRiuFIWV54/hqdefault.jpg' },
                { id: 'Zt2Z4g2KkUE', title: 'Khruangbin - White Gloves', embedUrl: 'https://www.youtube.com/embed/Zt2Z4g2KkUE', imgUrl: 'https://img.youtube.com/vi/Zt2Z4g2KkUE/hqdefault.jpg' },
                { id: 'w3yqA2tCq3U', title: 'Mac DeMarco - Chamber of Reflection', embedUrl: 'https://www.youtube.com/embed/w3yqA2tCq3U', imgUrl: 'https://img.youtube.com/vi/w3yqA2tCq3U/hqdefault.jpg' },
                { id: 'sF80I-TQiW0', title: 'Rex Orange County - Loving Is Easy', embedUrl: 'https://www.youtube.com/embed/sF80I-TQiW0', imgUrl: 'https://img.youtube.com/vi/sF80I-TQiW0/hqdefault.jpg' },
                { id: 'S9y0D6S3eD4', title: 'Still Woozy - Goodie Bag', embedUrl: 'https://www.youtube.com/embed/S9y0D6S3eD4', imgUrl: 'https://img.youtube.com/vi/S9y0D6S3eD4/hqdefault.jpg' },
                { id: 'G8QYq8JrjXQ', title: 'Khruangbin - Texas Sun', embedUrl: 'https://www.youtube.com/embed/G8QYq8JrjXQ', imgUrl: 'https://img.youtube.com/vi/G8QYq8JrjXQ/hqdefault.jpg' }
            ]
        },

        {
            _id: 'st010',
            name: 'Throwback 2000s',
            tags: ['2000s', 'Nostalgia', 'Hits'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'CevxZvSJLk8', title: 'Katy Perry - Dark Horse', embedUrl: 'https://www.youtube.com/embed/CevxZvSJLk8', imgUrl: 'https://img.youtube.com/vi/CevxZvSJLk8/hqdefault.jpg' },
                { id: 'uelHwf8o7_U', title: 'Eminem - Love The Way You Lie', embedUrl: 'https://www.youtube.com/embed/uelHwf8o7_U', imgUrl: 'https://img.youtube.com/vi/uelHwf8o7_U/hqdefault.jpg' },
                { id: 'SlPhMPnQ58k', title: 'Taylor Swift - Blank Space', embedUrl: 'https://www.youtube.com/embed/SlPhMPnQ58k', imgUrl: 'https://img.youtube.com/vi/SlPhMPnQ58k/hqdefault.jpg' },
                { id: '09R8_2nJtjg', title: 'Maroon 5 - Sugar', embedUrl: 'https://www.youtube.com/embed/09R8_2nJtjg', imgUrl: 'https://img.youtube.com/vi/09R8_2nJtjg/hqdefault.jpg' },
                { id: 'fRh_vgS2dFE', title: 'Justin Bieber - Sorry', embedUrl: 'https://www.youtube.com/embed/fRh_vgS2dFE', imgUrl: 'https://img.youtube.com/vi/fRh_vgS2dFE/hqdefault.jpg' },
                { id: 'RgKAFK5djSk', title: 'Wiz Khalifa - See You Again', embedUrl: 'https://www.youtube.com/embed/RgKAFK5djSk', imgUrl: 'https://img.youtube.com/vi/RgKAFK5djSk/hqdefault.jpg' },
                { id: 'OPf0YbXqDm0', title: 'Mark Ronson - Uptown Funk', embedUrl: 'https://www.youtube.com/embed/OPf0YbXqDm0', imgUrl: 'https://img.youtube.com/vi/OPf0YbXqDm0/hqdefault.jpg' },
                { id: 'lp-EO5I60KA', title: 'Katy Perry - Roar', embedUrl: 'https://www.youtube.com/embed/lp-EO5I60KA', imgUrl: 'https://img.youtube.com/vi/lp-EO5I60KA/hqdefault.jpg' },
                { id: 'nfWlot6h_JM', title: 'Taylor Swift - Shake It Off', embedUrl: 'https://www.youtube.com/embed/nfWlot6h_JM', imgUrl: 'https://img.youtube.com/vi/nfWlot6h_JM/hqdefault.jpg' },
                { id: 'KQ6zr6kCPj8', title: 'Bruno Mars - Just The Way You Are', embedUrl: 'https://www.youtube.com/embed/KQ6zr6kCPj8', imgUrl: 'https://img.youtube.com/vi/KQ6zr6kCPj8/hqdefault.jpg' },
                { id: 'JGwWNGJdvx8', title: 'Ed Sheeran - Shape of You', embedUrl: 'https://www.youtube.com/embed/JGwWNGJdvx8', imgUrl: 'https://img.youtube.com/vi/JGwWNGJdvx8/hqdefault.jpg' },
                { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito', embedUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk', imgUrl: 'https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg' },
                { id: '2Vv-BfVoq4g', title: 'Ed Sheeran - Perfect', embedUrl: 'https://www.youtube.com/embed/2Vv-BfVoq4g', imgUrl: 'https://img.youtube.com/vi/2Vv-BfVoq4g/hqdefault.jpg' },
                { id: 'YQHsXMglC9A', title: 'Adele - Hello', embedUrl: 'https://www.youtube.com/embed/YQHsXMglC9A', imgUrl: 'https://img.youtube.com/vi/YQHsXMglC9A/hqdefault.jpg' },
                { id: 'e-ORhEE9VVg', title: 'Taylor Swift - Style', embedUrl: 'https://www.youtube.com/embed/e-ORhEE9VVg', imgUrl: 'https://img.youtube.com/vi/e-ORhEE9VVg/hqdefault.jpg' }
            ]
        },
        {
            _id: 'st206',
            name: 'Hip Hop Essentials',
            tags: ['HipHop', 'Rap', 'Urban'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'hLQl3WQQoQ0', title: 'Eminem - Lose Yourself', embedUrl: 'https://www.youtube.com/embed/hLQl3WQQoQ0', imgUrl: 'https://img.youtube.com/vi/hLQl3WQQoQ0/hqdefault.jpg' },
                { id: 'uelHwf8o7_U', title: 'Eminem - Love The Way You Lie', embedUrl: 'https://www.youtube.com/embed/uelHwf8o7_U', imgUrl: 'https://img.youtube.com/vi/uelHwf8o7_U/hqdefault.jpg' },
                { id: 'CevxZvSJLk8', title: 'Kanye West - Stronger', embedUrl: 'https://www.youtube.com/embed/CevxZvSJLk8', imgUrl: 'https://img.youtube.com/vi/CevxZvSJLk8/hqdefault.jpg' },
                { id: 'fLexgOxsZu0', title: 'Dr. Dre - Still D.R.E.', embedUrl: 'https://www.youtube.com/embed/_CL6n0FJZpk', imgUrl: 'https://img.youtube.com/vi/_CL6n0FJZpk/hqdefault.jpg' },
                { id: 'gOMhN-hfMtY', title: 'Jay-Z & Alicia Keys - Empire State of Mind', embedUrl: 'https://www.youtube.com/embed/gOMhN-hfMtY', imgUrl: 'https://img.youtube.com/vi/gOMhN-hfMtY/hqdefault.jpg' },
                { id: 'RubBzkZzpUA', title: 'Nas - If I Ruled The World', embedUrl: 'https://www.youtube.com/embed/RubBzkZzpUA', imgUrl: 'https://img.youtube.com/vi/RubBzkZzpUA/hqdefault.jpg' },
                { id: 'vHuF78z6mWs', title: '2Pac - Changes', embedUrl: 'https://www.youtube.com/embed/vHuF78z6mWs', imgUrl: 'https://img.youtube.com/vi/vHuF78z6mWs/hqdefault.jpg' },
                { id: 'DksSPZTZES0', title: 'The Notorious B.I.G. - Juicy', embedUrl: 'https://www.youtube.com/embed/DksSPZTZES0', imgUrl: 'https://img.youtube.com/vi/DksSPZTZES0/hqdefault.jpg' },
                { id: 'QZXc39hT8t4', title: 'Kendrick Lamar - HUMBLE.', embedUrl: 'https://www.youtube.com/embed/QZXc39hT8t4', imgUrl: 'https://img.youtube.com/vi/QZXc39hT8t4/hqdefault.jpg' },
                { id: 'tYlH1kD4o1M', title: 'Drake - God’s Plan', embedUrl: 'https://www.youtube.com/embed/xpVfcZ0ZcFM', imgUrl: 'https://img.youtube.com/vi/xpVfcZ0ZcFM/hqdefault.jpg' },
                { id: '7Mq5M-2ZgA0', title: 'Outkast - Ms. Jackson', embedUrl: 'https://www.youtube.com/embed/MYxAiK6VnXw', imgUrl: 'https://img.youtube.com/vi/MYxAiK6VnXw/hqdefault.jpg' },
                { id: 'PBwAxmrE194', title: 'Coolio - Gangsta’s Paradise', embedUrl: 'https://www.youtube.com/embed/fPO76Jlnz6c', imgUrl: 'https://img.youtube.com/vi/fPO76Jlnz6c/hqdefault.jpg' },
                { id: 'HMUDVMiITOU', title: '50 Cent - In Da Club', embedUrl: 'https://www.youtube.com/embed/5qm8PH4xAss', imgUrl: 'https://img.youtube.com/vi/5qm8PH4xAss/hqdefault.jpg' },
                { id: 'Kbj2Zss-5GY', title: 'Snoop Dogg - Drop It Like It’s Hot', embedUrl: 'https://www.youtube.com/embed/GtUVQei3nX4', imgUrl: 'https://img.youtube.com/vi/GtUVQei3nX4/hqdefault.jpg' },
                { id: 'eJO5HU_7_1w', title: 'Lauryn Hill - Doo Wop', embedUrl: 'https://www.youtube.com/embed/T6QKqFPRZSA', imgUrl: 'https://img.youtube.com/vi/T6QKqFPRZSA/hqdefault.jpg' }
            ]
        },

        {
            _id: 'st207',
            name: 'Electronic Night',
            tags: ['Electronic', 'EDM', 'Dance'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: '5NV6Rdv1a3I', title: 'Daft Punk - Get Lucky', embedUrl: 'https://www.youtube.com/embed/5NV6Rdv1a3I', imgUrl: 'https://img.youtube.com/vi/5NV6Rdv1a3I/hqdefault.jpg' },
                { id: 'IcrbM1l_BoI', title: 'Avicii - Levels', embedUrl: 'https://www.youtube.com/embed/_ovdm2yX4MA', imgUrl: 'https://img.youtube.com/vi/_ovdm2yX4MA/hqdefault.jpg' },
                { id: '60ItHLz5WEA', title: 'Alan Walker - Faded', embedUrl: 'https://www.youtube.com/embed/60ItHLz5WEA', imgUrl: 'https://img.youtube.com/vi/60ItHLz5WEA/hqdefault.jpg' },
                { id: 'nCg3ufihKyU', title: 'Swedish House Mafia - Don’t You Worry Child', embedUrl: 'https://www.youtube.com/embed/1y6smkh6c-0', imgUrl: 'https://img.youtube.com/vi/1y6smkh6c-0/hqdefault.jpg' },
                { id: 'h7ArUgxtlJs', title: 'Deadmau5 - Ghosts n Stuff', embedUrl: 'https://www.youtube.com/embed/h7ArUgxtlJs', imgUrl: 'https://img.youtube.com/vi/h7ArUgxtlJs/hqdefault.jpg' },
                { id: 'YqeW9_5kURI', title: 'Major Lazer - Lean On', embedUrl: 'https://www.youtube.com/embed/YqeW9_5kURI', imgUrl: 'https://img.youtube.com/vi/YqeW9_5kURI/hqdefault.jpg' },
                { id: 'pXRviuL6vMY', title: 'The Chemical Brothers - Galang', embedUrl: 'https://www.youtube.com/embed/pXRviuL6vMY', imgUrl: 'https://img.youtube.com/vi/pXRviuL6vMY/hqdefault.jpg' },
                { id: '9Sc-ir2UwGU', title: 'Calvin Harris - I’m Not Alone', embedUrl: 'https://www.youtube.com/embed/9Sc-ir2UwGU', imgUrl: 'https://img.youtube.com/vi/9Sc-ir2UwGU/hqdefault.jpg' },
                { id: 'tVj0ZTS4WF4', title: 'David Guetta - Titanium', embedUrl: 'https://www.youtube.com/embed/JRfuAukYTKg', imgUrl: 'https://img.youtube.com/vi/JRfuAukYTKg/hqdefault.jpg' },
                { id: 'sY3rIlrYy4I', title: 'Justice - D.A.N.C.E.', embedUrl: 'https://www.youtube.com/embed/sy1dYFGkPUE', imgUrl: 'https://img.youtube.com/vi/sy1dYFGkPUE/hqdefault.jpg' },
                { id: 'Gz2GVlQkn4Q', title: 'Disclosure - Latch', embedUrl: 'https://www.youtube.com/embed/93ASUImTedo', imgUrl: 'https://img.youtube.com/vi/93ASUImTedo/hqdefault.jpg' },
                { id: 'w2ovFHgJrQk', title: 'Eric Prydz - Call On Me', embedUrl: 'https://www.youtube.com/embed/qetW6R9Jxs4', imgUrl: 'https://img.youtube.com/vi/qetW6R9Jxs4/hqdefault.jpg' },
                { id: 'KQ6zr6kCPj8', title: 'Zedd - Clarity', embedUrl: 'https://www.youtube.com/embed/IxxstCcJlsc', imgUrl: 'https://img.youtube.com/vi/IxxstCcJlsc/hqdefault.jpg' },
                { id: 'EBFtbmIhN4M', title: 'Fatboy Slim - Praise You', embedUrl: 'https://www.youtube.com/embed/ruAi4VBoBSM', imgUrl: 'https://img.youtube.com/vi/ruAi4VBoBSM/hqdefault.jpg' },
                { id: 'VPRjCeoBqrI', title: 'Moby - Porcelain', embedUrl: 'https://www.youtube.com/embed/13EifDb4GYs', imgUrl: 'https://img.youtube.com/vi/13EifDb4GYs/hqdefault.jpg' }
            ]
        },

        {
            _id: 'st208',
            name: '90s Rock',
            tags: ['Rock', '90s', 'Grunge'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'hTWKbfoikeg', title: 'Nirvana - Smells Like Teen Spirit', embedUrl: 'https://www.youtube.com/embed/hTWKbfoikeg', imgUrl: 'https://img.youtube.com/vi/hTWKbfoikeg/hqdefault.jpg' },
                { id: 'eVTXPUF4Oz4', title: 'Linkin Park - In The End', embedUrl: 'https://www.youtube.com/embed/eVTXPUF4Oz4', imgUrl: 'https://img.youtube.com/vi/eVTXPUF4Oz4/hqdefault.jpg' },
                { id: '1w7OgIMMRc4', title: 'Guns N’ Roses - Sweet Child O’ Mine', embedUrl: 'https://www.youtube.com/embed/1w7OgIMMRc4', imgUrl: 'https://img.youtube.com/vi/1w7OgIMMRc4/hqdefault.jpg' },
                { id: 'YR5ApYxkU-U', title: 'Red Hot Chili Peppers - Californication', embedUrl: 'https://www.youtube.com/embed/YlUKcNNmywk', imgUrl: 'https://img.youtube.com/vi/YlUKcNNmywk/hqdefault.jpg' },
                { id: 'I_2D8Eo15wE', title: 'Oasis - Wonderwall', embedUrl: 'https://www.youtube.com/embed/bx1Bh8ZvH84', imgUrl: 'https://img.youtube.com/vi/bx1Bh8ZvH84/hqdefault.jpg' },
                { id: 'SBjQ9tuuTJQ', title: 'Pearl Jam - Alive', embedUrl: 'https://www.youtube.com/embed/qM0zINtulhM', imgUrl: 'https://img.youtube.com/vi/qM0zINtulhM/hqdefault.jpg' },
                { id: '6Ejga4kJUts', title: 'Foo Fighters - Everlong', embedUrl: 'https://www.youtube.com/embed/eBG7P-K-r1Y', imgUrl: 'https://img.youtube.com/vi/eBG7P-K-r1Y/hqdefault.jpg' },
                { id: 'o1tj2zJ2Wvg', title: 'Blur - Song 2', embedUrl: 'https://www.youtube.com/embed/SSbBvKaM6sk', imgUrl: 'https://img.youtube.com/vi/SSbBvKaM6sk/hqdefault.jpg' },
                { id: 'hTWKbfoikeg2', title: 'Soundgarden - Black Hole Sun', embedUrl: 'https://www.youtube.com/embed/3mbBbFH9fAg', imgUrl: 'https://img.youtube.com/vi/3mbBbFH9fAg/hqdefault.jpg' },
                { id: 'd020hcWA_Wg2', title: 'The Cranberries - Zombie', embedUrl: 'https://www.youtube.com/embed/6Ejga4kJUts', imgUrl: 'https://img.youtube.com/vi/6Ejga4kJUts/hqdefault.jpg' },
                { id: 'YgSPaXgAdzE', title: 'Metallica - Enter Sandman', embedUrl: 'https://www.youtube.com/embed/CD-E-LDc384', imgUrl: 'https://img.youtube.com/vi/CD-E-LDc384/hqdefault.jpg' },
                { id: 'n3Xv_g3g-mA', title: 'Green Day - Basket Case', embedUrl: 'https://www.youtube.com/embed/NUTGr5t3MoY', imgUrl: 'https://img.youtube.com/vi/NUTGr5t3MoY/hqdefault.jpg' },
                { id: 'ZbZSe6N_BXs', title: 'U2 - One', embedUrl: 'https://www.youtube.com/embed/ftjEcrrf7r0', imgUrl: 'https://img.youtube.com/vi/ftjEcrrf7r0/hqdefault.jpg' },
                { id: 'iT6vqeL-ysI', title: 'R.E.M. - Losing My Religion', embedUrl: 'https://www.youtube.com/embed/xwtdhWltSIg', imgUrl: 'https://img.youtube.com/vi/xwtdhWltSIg/hqdefault.jpg' },
                { id: 'J16lInLZRms', title: 'Smashing Pumpkins - 1979', embedUrl: 'https://www.youtube.com/embed/4aeETEoNfOg', imgUrl: 'https://img.youtube.com/vi/4aeETEoNfOg/hqdefault.jpg' }
            ]
        },

        {
            _id: 'st209',
            name: 'Chillhop & LoFi',
            tags: ['LoFi', 'Chill', 'Beats'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: '5qap5aO4i9A', title: 'lofi hip hop radio - beats', embedUrl: 'https://www.youtube.com/embed/5qap5aO4i9A', imgUrl: 'https://img.youtube.com/vi/5qap5aO4i9A/hqdefault.jpg' },
                { id: 'DWcJFNfaw9c', title: 'Idealism - Snowfall', embedUrl: 'https://www.youtube.com/embed/DWcJFNfaw9c', imgUrl: 'https://img.youtube.com/vi/DWcJFNfaw9c/hqdefault.jpg' },
                { id: 'lTRiuFIWV54', title: 'J Dilla - Time', embedUrl: 'https://www.youtube.com/embed/lTRiuFIWV54', imgUrl: 'https://img.youtube.com/vi/lTRiuFIWV54/hqdefault.jpg' },
                { id: 'rUxyKA_-grg', title: 'Nujabes - Feather', embedUrl: 'https://www.youtube.com/embed/rUxyKA_-grg', imgUrl: 'https://img.youtube.com/vi/rUxyKA_-grg/hqdefault.jpg' },
                { id: '8pL8C9j1kCk', title: 'Tomppabeats - Monday Loop', embedUrl: 'https://www.youtube.com/embed/8pL8C9j1kCk', imgUrl: 'https://img.youtube.com/vi/8pL8C9j1kCk/hqdefault.jpg' },
                { id: 'Z8Y1MalRrDc', title: 'Jinsang - Affection', embedUrl: 'https://www.youtube.com/embed/Z8Y1MalRrDc', imgUrl: 'https://img.youtube.com/vi/Z8Y1MalRrDc/hqdefault.jpg' },
                { id: 'KQetemT1sWc2', title: 'ChilledCow - Jazz Hop', embedUrl: 'https://www.youtube.com/embed/KQetemT1sWc', imgUrl: 'https://img.youtube.com/vi/KQetemT1sWc/hqdefault.jpg' },
                { id: 'Q0R4l6w8P6A', title: 'Idealism - Both of Us', embedUrl: 'https://www.youtube.com/embed/Q0R4l6w8P6A', imgUrl: 'https://img.youtube.com/vi/Q0R4l6w8P6A/hqdefault.jpg' },
                { id: 'Kj5IGSb-W18', title: 'Aso - Seasons', embedUrl: 'https://www.youtube.com/embed/Kj5IGSb-W18', imgUrl: 'https://img.youtube.com/vi/Kj5IGSb-W18/hqdefault.jpg' },
                { id: 'tNkZsRW7h2c', title: 'Kupla - Kingdom in Blue', embedUrl: 'https://www.youtube.com/embed/tNkZsRW7h2c', imgUrl: 'https://img.youtube.com/vi/tNkZsRW7h2c/hqdefault.jpg' },
                { id: 'vW4kZ0yV6xM', title: 'eevee - forest glade', embedUrl: 'https://www.youtube.com/embed/vW4kZ0yV6xM', imgUrl: 'https://img.youtube.com/vi/vW4kZ0yV6xM/hqdefault.jpg' },
                { id: '5yx6BWlEVcY', title: 'Philanthrope - Sleeping Under the Stars', embedUrl: 'https://www.youtube.com/embed/5yx6BWlEVcY', imgUrl: 'https://img.youtube.com/vi/5yx6BWlEVcY/hqdefault.jpg' },
                { id: 'D9G1VOjN_84', title: 'Brock Berrigan - Four Walls', embedUrl: 'https://www.youtube.com/embed/D9G1VOjN_84', imgUrl: 'https://img.youtube.com/vi/D9G1VOjN_84/hqdefault.jpg' },
                { id: 'kqZ2YkHhDZo', title: 'Nymano - Hope', embedUrl: 'https://www.youtube.com/embed/kqZ2YkHhDZo', imgUrl: 'https://img.youtube.com/vi/kqZ2YkHhDZo/hqdefault.jpg' },
                { id: '6h9XUYj96ho', title: 'Joey Pecoraro - Half Awake', embedUrl: 'https://www.youtube.com/embed/6h9XUYj96ho', imgUrl: 'https://img.youtube.com/vi/6h9XUYj96ho/hqdefault.jpg' }
            ]
        },

        {
            _id: 'st210',
            name: 'Workout Energy',
            tags: ['Workout', 'Energy', 'Motivation'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'UceaB4D0jpo', title: 'Survivor - Eye of the Tiger', embedUrl: 'https://www.youtube.com/embed/UceaB4D0jpo', imgUrl: 'https://img.youtube.com/vi/UceaB4D0jpo/hqdefault.jpg' },
                { id: 'btPJPFnesV4', title: 'Imagine Dragons - Believer', embedUrl: 'https://www.youtube.com/embed/7wtfhZwyrcc', imgUrl: 'https://img.youtube.com/vi/7wtfhZwyrcc/hqdefault.jpg' },
                { id: 'YqeW9_5kURI2', title: 'Kanye West - Power', embedUrl: 'https://www.youtube.com/embed/L53gjP-TtGE', imgUrl: 'https://img.youtube.com/vi/L53gjP-TtGE/hqdefault.jpg' },
                { id: 'I_izvAbhExY', title: 'AC/DC - Thunderstruck', embedUrl: 'https://www.youtube.com/embed/v2AC41dglnM', imgUrl: 'https://img.youtube.com/vi/v2AC41dglnM/hqdefault.jpg' },
                { id: '2vjPBrBU-TM', title: 'Sia - Chandelier', embedUrl: 'https://www.youtube.com/embed/2vjPBrBU-TM', imgUrl: 'https://img.youtube.com/vi/2vjPBrBU-TM/hqdefault.jpg' },
                { id: 'fLexgOxsZu0x', title: 'Linkin Park - Numb', embedUrl: 'https://www.youtube.com/embed/kXYiU_JCYtU', imgUrl: 'https://img.youtube.com/vi/kXYiU_JCYtU/hqdefault.jpg' },
                { id: 'hT_nvWreIhg', title: 'OneRepublic - Counting Stars', embedUrl: 'https://www.youtube.com/embed/hT_nvWreIhg', imgUrl: 'https://img.youtube.com/vi/hT_nvWreIhg/hqdefault.jpg' },
                { id: 'OPf0YbXqDm02', title: 'Flo Rida - Good Feeling', embedUrl: 'https://www.youtube.com/embed/3OnnDqH6Wj8', imgUrl: 'https://img.youtube.com/vi/3OnnDqH6Wj8/hqdefault.jpg' },
                { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', imgUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
                { id: 'JRfuAukYTKg', title: 'David Guetta - Titanium', embedUrl: 'https://www.youtube.com/embed/JRfuAukYTKg', imgUrl: 'https://img.youtube.com/vi/JRfuAukYTKg/hqdefault.jpg' },
                { id: 'kffacxfA7G4', title: 'Justin Timberlake - Can’t Stop the Feeling', embedUrl: 'https://www.youtube.com/embed/ru0K8uYEZWw', imgUrl: 'https://img.youtube.com/vi/ru0K8uYEZWw/hqdefault.jpg' },
                { id: 'ZbZSe6N_BXs', title: 'Pharrell Williams - Happy', embedUrl: 'https://www.youtube.com/embed/ZbZSe6N_BXs', imgUrl: 'https://img.youtube.com/vi/ZbZSe6N_BXs/hqdefault.jpg' },
                { id: '9bZkp7q19f0', title: 'PSY - Gangnam Style', embedUrl: 'https://www.youtube.com/embed/9bZkp7q19f0', imgUrl: 'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg' },
                { id: 'e-ORhEE9VVg2', title: 'Taylor Swift - Style', embedUrl: 'https://www.youtube.com/embed/e-ORhEE9VVg', imgUrl: 'https://img.youtube.com/vi/e-ORhEE9VVg/hqdefault.jpg' },
                { id: 'L_jWHffIx5E', title: 'Smash Mouth - All Star', embedUrl: 'https://www.youtube.com/embed/L_jWHffIx5E', imgUrl: 'https://img.youtube.com/vi/L_jWHffIx5E/hqdefault.jpg' }
            ]
        }

    ]

    stations = await _getAvgColors(stations)
    saveToStorage(STORAGE_KEY, stations)
    return stations
}

async function getLikedSongsStation() {
    const user = userService.getLoggedinUser()
    if (!user.likedSongs) user.likedSongs = []
    const stations = await _getStations()
    const allSongs = stations.flatMap(st => st.songs)
    const likedSongs = allSongs.filter(song => user.likedSongs.includes(song.id))
    return {
        _id: 'likedSongs',
        name: 'Liked Songs',
        createdBy: { fullname: user.fullname || "You" },
        songs: likedSongs,
        imgUrl: "https://misc.scdn.co/liked-songs/liked-songs-300.png"
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
                station.averageColor = 'rgba(0,0,0,1)' // fallback
            }
        })
    )
    return stations
}








