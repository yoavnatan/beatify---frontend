
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
    _getStations,
    getLikedSongsStation
}
window.cs = stationService


async function query(filterBy = { txt: '' }) {
    let stations = await storageService.query(STORAGE_KEY)
    if (!stations || stations.length <= 0) stations = await _getStations()

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
            name: station.name,
            tags: station.tags,
            createdBy: station.createdBy,
            likedByUsers: station.likedByUsers,
            songs: station.songs
        }
        savedStation = await storageService.put(STORAGE_KEY, stationToSave)
    } else {
        const stationToSave = {
            // vendor: station.vendor,
            // speed: station.speed,
            // Later, owner is set by the backend
            owner: userService.getLoggedinUser(),
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
                { id: 'song001', title: 'Arctic Monkeys - Do I Wanna Know?', src: 'https://www.youtube.com/embed/wXhTHyIgQ_U', imgUrl: 'https://img.youtube.com/vi/wXhTHyIgQ_U/hqdefault.jpg' },
                { id: 'song002', title: 'Tame Impala - The Less I Know The Better', src: 'https://www.youtube.com/embed/NUC2EQvdzmY', imgUrl: 'https://img.youtube.com/vi/NUC2EQvdzmY/hqdefault.jpg' },
                { id: 'song003', title: 'Radiohead - Karma Police', src: 'https://www.youtube.com/embed/pXRviuL6vMY', imgUrl: 'https://img.youtube.com/vi/pXRviuL6vMY/hqdefault.jpg' },
                { id: 'song004', title: 'alt-J - Breezeblocks', src: 'https://www.youtube.com/embed/d020hcWA_Wg', imgUrl: 'https://img.youtube.com/vi/d020hcWA_Wg/hqdefault.jpg' },
                { id: 'song005', title: 'Glass Animals - Heat Waves', src: 'https://www.youtube.com/embed/IcrbM1l_BoI', imgUrl: 'https://img.youtube.com/vi/IcrbM1l_BoI/hqdefault.jpg' },
                { id: 'song006', title: 'The Strokes - Reptilia', src: 'https://www.youtube.com/embed/1V_xRb0x9aw', imgUrl: 'https://img.youtube.com/vi/1V_xRb0x9aw/hqdefault.jpg' },
                { id: 'song007', title: 'Bon Iver - Holocene', src: 'https://www.youtube.com/embed/lBFdX37Qpnk', imgUrl: 'https://img.youtube.com/vi/lBFdX37Qpnk/hqdefault.jpg' },
                { id: 'song008', title: 'Phoenix - Lisztomania', src: 'https://www.youtube.com/embed/KQetemT1sWc', imgUrl: 'https://img.youtube.com/vi/KQetemT1sWc/hqdefault.jpg' },
                { id: 'song009', title: 'MGMT - Electric Feel', src: 'https://www.youtube.com/embed/fe4EK4HSPkI', imgUrl: 'https://img.youtube.com/vi/fe4EK4HSPkI/hqdefault.jpg' },
                { id: 'song010', title: 'Coldplay - Yellow', src: 'https://www.youtube.com/embed/0KSOMA3QBU0', imgUrl: 'https://img.youtube.com/vi/0KSOMA3QBU0/hqdefault.jpg' },
                { id: 'song011', title: 'Arctic Monkeys - R U Mine?', src: 'https://www.youtube.com/embed/bpOSxM0rNPM', imgUrl: 'https://img.youtube.com/vi/bpOSxM0rNPM/hqdefault.jpg' },
                { id: 'song012', title: 'Imagine Dragons - Radioactive', src: 'https://www.youtube.com/embed/ktvTqknDobU', imgUrl: 'https://img.youtube.com/vi/ktvTqknDobU/hqdefault.jpg' },
                { id: 'song013', title: 'Daft Punk - Get Lucky', src: 'https://www.youtube.com/embed/5NV6Rdv1a3I', imgUrl: 'https://img.youtube.com/vi/5NV6Rdv1a3I/hqdefault.jpg' },
                { id: 'song014', title: 'Nirvana - Smells Like Teen Spirit', src: 'https://www.youtube.com/embed/hTWKbfoikeg', imgUrl: 'https://img.youtube.com/vi/hTWKbfoikeg/hqdefault.jpg' },
                { id: 'song015', title: 'RHCP - Under The Bridge', src: 'https://www.youtube.com/embed/fLexgOxsZu0', imgUrl: 'https://img.youtube.com/vi/fLexgOxsZu0/hqdefault.jpg' }
            ]
        },
        {
            _id: 'st002',
            name: 'Global Pop',
            tags: ['Pop', 'Hits'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'song016', title: 'Ed Sheeran - Shape of You', src: 'https://www.youtube.com/embed/JGwWNGJdvx8', imgUrl: 'https://img.youtube.com/vi/JGwWNGJdvx8/hqdefault.jpg' },
                { id: 'song017', title: 'Luis Fonsi - Despacito', src: 'https://www.youtube.com/embed/kJQP7kiw5Fk', imgUrl: 'https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg' },
                { id: 'song018', title: 'Mark Ronson - Uptown Funk', src: 'https://www.youtube.com/embed/OPf0YbXqDm0', imgUrl: 'https://img.youtube.com/vi/OPf0YbXqDm0/hqdefault.jpg' },
                { id: 'song019', title: 'Adele - Hello', src: 'https://www.youtube.com/embed/YQHsXMglC9A', imgUrl: 'https://img.youtube.com/vi/YQHsXMglC9A/hqdefault.jpg' },
                { id: 'song020', title: 'Wiz Khalifa - See You Again', src: 'https://www.youtube.com/embed/RgKAFK5djSk', imgUrl: 'https://img.youtube.com/vi/RgKAFK5djSk/hqdefault.jpg' },
                { id: 'song021', title: 'Taylor Swift - Blank Space', src: 'https://www.youtube.com/embed/SlPhMPnQ58k', imgUrl: 'https://img.youtube.com/vi/SlPhMPnQ58k/hqdefault.jpg' },
                { id: 'song022', title: 'Taylor Swift - Shake It Off', src: 'https://www.youtube.com/embed/nfWlot6h_JM', imgUrl: 'https://img.youtube.com/vi/nfWlot6h_JM/hqdefault.jpg' },
                { id: 'song023', title: 'Ed Sheeran - Perfect', src: 'https://www.youtube.com/embed/2Vv-BfVoq4g', imgUrl: 'https://img.youtube.com/vi/2Vv-BfVoq4g/hqdefault.jpg' },
                { id: 'song024', title: 'Maroon 5 - Sugar', src: 'https://www.youtube.com/embed/09R8_2nJtjg', imgUrl: 'https://img.youtube.com/vi/09R8_2nJtjg/hqdefault.jpg' },
                { id: 'song025', title: 'Justin Bieber - Sorry', src: 'https://www.youtube.com/embed/fRh_vgS2dFE', imgUrl: 'https://img.youtube.com/vi/fRh_vgS2dFE/hqdefault.jpg' },
                { id: 'song026', title: 'Katy Perry - Roar', src: 'https://www.youtube.com/embed/lp-EO5I60KA', imgUrl: 'https://img.youtube.com/vi/lp-EO5I60KA/hqdefault.jpg' },
                { id: 'song027', title: 'Katy Perry - Dark Horse', src: 'https://www.youtube.com/embed/CevxZvSJLk8', imgUrl: 'https://img.youtube.com/vi/CevxZvSJLk8/hqdefault.jpg' },
                { id: 'song028', title: 'Taylor Swift - Style', src: 'https://www.youtube.com/embed/e-ORhEE9VVg', imgUrl: 'https://img.youtube.com/vi/e-ORhEE9VVg/hqdefault.jpg' },
                { id: 'song029', title: 'Eminem - Love The Way You Lie', src: 'https://www.youtube.com/embed/uelHwf8o7_U', imgUrl: 'https://img.youtube.com/vi/uelHwf8o7_U/hqdefault.jpg' },
                { id: 'song030', title: 'Bruno Mars - Just The Way You Are', src: 'https://www.youtube.com/embed/KQ6zr6kCPj8', imgUrl: 'https://img.youtube.com/vi/KQ6zr6kCPj8/hqdefault.jpg' }
            ]
        },
        {
            _id: 'st003',
            name: 'Rock Classics',
            tags: ['Rock', 'Classic'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'song031', title: 'Linkin Park - In The End', src: 'https://www.youtube.com/embed/eVTXPUF4Oz4', imgUrl: 'https://img.youtube.com/vi/eVTXPUF4Oz4/hqdefault.jpg' },
                { id: 'song032', title: 'Queen - Bohemian Rhapsody', src: 'https://www.youtube.com/embed/fJ9rUzIMcZQ', imgUrl: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/hqdefault.jpg' },
                { id: 'song033', title: 'The Beatles - Hey Jude', src: 'https://www.youtube.com/embed/A_MjCqQoLLA', imgUrl: 'https://img.youtube.com/vi/A_MjCqQoLLA/hqdefault.jpg' },
                { id: 'song034', title: 'Led Zeppelin - Stairway To Heaven', src: 'https://www.youtube.com/embed/QkF3oxziUI4', imgUrl: 'https://img.youtube.com/vi/QkF3oxziUI4/hqdefault.jpg' },
                { id: 'song035', title: 'AC/DC - Back In Black', src: 'https://www.youtube.com/embed/pAgnJDJN4VA', imgUrl: 'https://img.youtube.com/vi/pAgnJDJN4VA/hqdefault.jpg' },
                { id: 'song036', title: 'Guns N Roses - Sweet Child O Mine', src: 'https://www.youtube.com/embed/1w7OgIMMRc4', imgUrl: 'https://img.youtube.com/vi/1w7OgIMMRc4/hqdefault.jpg' },
                { id: 'song037', title: 'Foo Fighters - Everlong', src: 'https://www.youtube.com/embed/eBG7P-K-r1Y', imgUrl: 'https://img.youtube.com/vi/eBG7P-K-r1Y/hqdefault.jpg' },
                { id: 'song038', title: 'Bon Jovi - Livin On A Prayer', src: 'https://www.youtube.com/embed/lDK9QqIzhwk', imgUrl: 'https://img.youtube.com/vi/lDK9QqIzhwk/hqdefault.jpg' },
                { id: 'song039', title: 'The Killers - Mr. Brightside', src: 'https://www.youtube.com/embed/gGdGFtwCNBE', imgUrl: 'https://img.youtube.com/vi/gGdGFtwCNBE/hqdefault.jpg' },
                { id: 'song040', title: 'Metallica - Enter Sandman', src: 'https://www.youtube.com/embed/CD-E-LDc384', imgUrl: 'https://img.youtube.com/vi/CD-E-LDc384/hqdefault.jpg' },
                { id: 'song041', title: 'Pearl Jam - Alive', src: 'https://www.youtube.com/embed/qM0zINtulhM', imgUrl: 'https://img.youtube.com/vi/qM0zINtulhM/hqdefault.jpg' },
                { id: 'song042', title: 'Red Hot Chili Peppers - Californication', src: 'https://www.youtube.com/embed/YlUKcNNmywk', imgUrl: 'https://img.youtube.com/vi/YlUKcNNmywk/hqdefault.jpg' },
                { id: 'song043', title: 'The Doors - Light My Fire', src: 'https://www.youtube.com/embed/deB_u-to-IE', imgUrl: 'https://img.youtube.com/vi/deB_u-to-IE/hqdefault.jpg' },
                { id: 'song044', title: 'Journey - Don’t Stop Believin’', src: 'https://www.youtube.com/embed/1k8craCGpgs', imgUrl: 'https://img.youtube.com/vi/1k8craCGpgs/hqdefault.jpg' },
                { id: 'song045', title: 'U2 - With Or Without You', src: 'https://www.youtube.com/embed/XmSdTa9kaiQ', imgUrl: 'https://img.youtube.com/vi/XmSdTa9kaiQ/hqdefault.jpg' }
            ]
        },
        {
            _id: 'st004',
            name: 'Hip Hop Vibes',
            tags: ['Hip Hop', 'Rap'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'song046', title: 'Kendrick Lamar - HUMBLE.', src: 'https://www.youtube.com/embed/tvTRZJ-4EyI', imgUrl: 'https://img.youtube.com/vi/tvTRZJ-4EyI/hqdefault.jpg' },
                { id: 'song047', title: 'Drake - Hotline Bling', src: 'https://www.youtube.com/embed/uHokYhT8_Wk', imgUrl: 'https://img.youtube.com/vi/uHokYhT8_Wk/hqdefault.jpg' },
                { id: 'song048', title: 'The Notorious B.I.G. - Juicy', src: 'https://www.youtube.com/embed/DksSPZTZES0', imgUrl: 'https://img.youtube.com/vi/DksSPZTZES0/hqdefault.jpg' },
                { id: 'song049', title: 'Tupac - California Love', src: 'https://www.youtube.com/embed/5wBTdfAkqGU', imgUrl: 'https://img.youtube.com/vi/5wBTdfAkqGU/hqdefault.jpg' },
                { id: 'song050', title: 'Snoop Dogg - Drop It Like It’s Hot', src: 'https://www.youtube.com/embed/WILNIXZr2oc', imgUrl: 'https://img.youtube.com/vi/WILNIXZr2oc/hqdefault.jpg' },
                { id: 'song051', title: 'Cardi B - I Like It', src: 'https://www.youtube.com/embed/xTlNMmZKwpA', imgUrl: 'https://img.youtube.com/vi/xTlNMmZKwpA/hqdefault.jpg' },
                { id: 'song052', title: 'Nicki Minaj - Super Bass', src: 'https://www.youtube.com/embed/4JipHEz53sU', imgUrl: 'https://img.youtube.com/vi/4JipHEz53sU/hqdefault.jpg' },
                { id: 'song053', title: 'Jay-Z - Empire State Of Mind', src: 'https://www.youtube.com/embed/0UjsXo9l6I8', imgUrl: 'https://img.youtube.com/vi/0UjsXo9l6I8/hqdefault.jpg' },
                { id: 'song054', title: 'Eminem - Lose Yourself', src: 'https://www.youtube.com/embed/_Yhyp-_hX2s', imgUrl: 'https://img.youtube.com/vi/_Yhyp-_hX2s/hqdefault.jpg' },
                { id: 'song055', title: 'Migos - Bad And Boujee', src: 'https://www.youtube.com/embed/S-sJp1FfG7Q', imgUrl: 'https://img.youtube.com/vi/S-sJp1FfG7Q/hqdefault.jpg' },
                { id: 'song056', title: 'Travis Scott - Sicko Mode', src: 'https://www.youtube.com/embed/6ONRf7h3Mdk', imgUrl: 'https://img.youtube.com/vi/6ONRf7h3Mdk/hqdefault.jpg' },
                { id: 'song057', title: 'Dr. Dre - Still D.R.E.', src: 'https://www.youtube.com/embed/_CL6n0FJZpk', imgUrl: 'https://img.youtube.com/vi/_CL6n0FJZpk/hqdefault.jpg' },
                { id: 'song058', title: 'Post Malone - Rockstar', src: 'https://www.youtube.com/embed/UceaB4D0jpo', imgUrl: 'https://img.youtube.com/vi/UceaB4D0jpo/hqdefault.jpg' },
                { id: 'song059', title: 'Kanye West - Stronger', src: 'https://www.youtube.com/embed/PsO6ZnUZI0g', imgUrl: 'https://img.youtube.com/vi/PsO6ZnUZI0g/hqdefault.jpg' },
                { id: 'song060', title: 'Lil Nas X - Old Town Road', src: 'https://www.youtube.com/embed/r7qovpFAGrQ', imgUrl: 'https://img.youtube.com/vi/r7qovpFAGrQ/hqdefault.jpg' }
            ]
        },
        {
            _id: 'st005',
            name: 'EDM Party',
            tags: ['EDM', 'Dance', 'Electronic'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'song061', title: 'Avicii - Levels', src: 'https://www.youtube.com/embed/9ZfN87gSjvI', imgUrl: 'https://img.youtube.com/vi/9ZfN87gSjvI/hqdefault.jpg' },
                { id: 'song062', title: 'Alan Walker - Faded', src: 'https://www.youtube.com/embed/60ItHLz5WEA', imgUrl: 'https://img.youtube.com/vi/60ItHLz5WEA/hqdefault.jpg' },
                { id: 'song063', title: 'Calvin Harris - Summer', src: 'https://www.youtube.com/embed/ebXbLfLACGM', imgUrl: 'https://img.youtube.com/vi/ebXbLfLACGM/hqdefault.jpg' },
                { id: 'song064', title: 'Zedd - Clarity', src: 'https://www.youtube.com/embed/IxxstCcJlsc', imgUrl: 'https://img.youtube.com/vi/IxxstCcJlsc/hqdefault.jpg' },
                { id: 'song065', title: 'Martin Garrix - Animals', src: 'https://www.youtube.com/embed/gCYcHz2k5x0', imgUrl: 'https://img.youtube.com/vi/gCYcHz2k5x0/hqdefault.jpg' },
                { id: 'song066', title: 'The Chainsmokers - Closer', src: 'https://www.youtube.com/embed/PT2_F-1esPk', imgUrl: 'https://img.youtube.com/vi/PT2_F-1esPk/hqdefault.jpg' },
                { id: 'song067', title: 'David Guetta - Titanium', src: 'https://www.youtube.com/embed/Jq6CqFU-4q8', imgUrl: 'https://img.youtube.com/vi/Jq6CqFU-4q8/hqdefault.jpg' },
                { id: 'song068', title: 'Tiesto - Red Lights', src: 'https://www.youtube.com/embed/lG8pdGk0T8M', imgUrl: 'https://img.youtube.com/vi/lG8pdGk0T8M/hqdefault.jpg' },
                { id: 'song069', title: 'Marshmello - Alone', src: 'https://www.youtube.com/embed/ALZHF5UqnU4', imgUrl: 'https://img.youtube.com/vi/ALZHF5UqnU4/hqdefault.jpg' },
                { id: 'song070', title: 'Kygo - Firestone', src: 'https://www.youtube.com/embed/9Sc-ir2UwGU', imgUrl: 'https://img.youtube.com/vi/9Sc-ir2UwGU/hqdefault.jpg' },
                { id: 'song071', title: 'Skrillex - Bangarang', src: 'https://www.youtube.com/embed/Y1p0XzSxkuQ', imgUrl: 'https://img.youtube.com/vi/Y1p0XzSxkuQ/hqdefault.jpg' },
                { id: 'song072', title: 'David Guetta - Play Hard', src: 'https://www.youtube.com/embed/3n3Ppam7vga', imgUrl: 'https://img.youtube.com/vi/3n3Ppam7vga/hqdefault.jpg' },
                { id: 'song073', title: 'Martin Solveig - Hello', src: 'https://www.youtube.com/embed/tVj0ZTS4WF4', imgUrl: 'https://img.youtube.com/vi/tVj0ZTS4WF4/hqdefault.jpg' },
                { id: 'song074', title: 'Steve Aoki - Boneless', src: 'https://www.youtube.com/embed/7rDn2KEpncg', imgUrl: 'https://img.youtube.com/vi/7rDn2KEpncg/hqdefault.jpg' },
                { id: 'song075', title: 'Hardwell - Spaceman', src: 'https://www.youtube.com/embed/xDb5yTyFK6s', imgUrl: 'https://img.youtube.com/vi/xDb5yTyFK6s/hqdefault.jpg' }
            ]
        },

        {
            _id: 'st006',
            name: 'Classic Hip Hop',
            tags: ['Hip Hop', 'Old School'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'song076', title: 'Run DMC - It’s Tricky', src: 'https://www.youtube.com/embed/0b4m1xQK5cg', imgUrl: 'https://img.youtube.com/vi/0b4m1xQK5cg/hqdefault.jpg' },
                { id: 'song077', title: 'N.W.A - Straight Outta Compton', src: 'https://www.youtube.com/embed/TMZi25Pq3T8', imgUrl: 'https://img.youtube.com/vi/TMZi25Pq3T8/hqdefault.jpg' },
                { id: 'song078', title: 'Beastie Boys - Sabotage', src: 'https://www.youtube.com/embed/z5rRZdiu1UE', imgUrl: 'https://img.youtube.com/vi/z5rRZdiu1UE/hqdefault.jpg' },
                { id: 'song079', title: 'Public Enemy - Fight The Power', src: 'https://www.youtube.com/embed/8PaoLy7PHwk', imgUrl: 'https://img.youtube.com/vi/8PaoLy7PHwk/hqdefault.jpg' },
                { id: 'song080', title: 'A Tribe Called Quest - Can I Kick It?', src: 'https://www.youtube.com/embed/3TzZ0iZ98mo', imgUrl: 'https://img.youtube.com/vi/3TzZ0iZ98mo/hqdefault.jpg' },
                { id: 'song081', title: 'Eric B. & Rakim - Paid In Full', src: 'https://www.youtube.com/embed/9N4HsnCDQvY', imgUrl: 'https://img.youtube.com/vi/9N4HsnCDQvY/hqdefault.jpg' },
                { id: 'song082', title: 'Salt-N-Pepa - Push It', src: 'https://www.youtube.com/embed/8Dd7KRpKeaE', imgUrl: 'https://img.youtube.com/vi/8Dd7KRpKeaE/hqdefault.jpg' },
                { id: 'song083', title: 'LL Cool J - Mama Said Knock You Out', src: 'https://www.youtube.com/embed/_1sJ5iG1z1A', imgUrl: 'https://img.youtube.com/vi/_1sJ5iG1z1A/hqdefault.jpg' },
                { id: 'song084', title: 'De La Soul - Me Myself And I', src: 'https://www.youtube.com/embed/WLj7A72zC6Q', imgUrl: 'https://img.youtube.com/vi/WLj7A72zC6Q/hqdefault.jpg' },
                { id: 'song085', title: 'MC Hammer - U Can’t Touch This', src: 'https://www.youtube.com/embed/otCpCn0l4Wo', imgUrl: 'https://img.youtube.com/vi/otCpCn0l4Wo/hqdefault.jpg' },
                { id: 'song086', title: 'Ice Cube - Today Was A Good Day', src: 'https://www.youtube.com/embed/5tF7r8dM8C0', imgUrl: 'https://img.youtube.com/vi/5tF7r8dM8C0/hqdefault.jpg' },
                { id: 'song087', title: 'Coolio - Gangsta’s Paradise', src: 'https://www.youtube.com/embed/oygrmJFKYZY', imgUrl: 'https://img.youtube.com/vi/oygrmJFKYZY/hqdefault.jpg' },
                { id: 'song088', title: 'Snoop Dogg - Gin and Juice', src: 'https://www.youtube.com/embed/_P7S2lKif-A', imgUrl: 'https://img.youtube.com/vi/_P7S2lKif-A/hqdefault.jpg' },
                { id: 'song089', title: 'Eazy-E - Boyz-n-the-Hood', src: 'https://www.youtube.com/embed/RzzU5b1RIqk', imgUrl: 'https://img.youtube.com/vi/RzzU5b1RIqk/hqdefault.jpg' },
                { id: 'song090', title: 'Dr Dre - Nuthin’ But A G Thang', src: 'https://www.youtube.com/embed/1c9tD7fTi5c', imgUrl: 'https://img.youtube.com/vi/1c9tD7fTi5c/hqdefault.jpg' }
            ]
        },
        {
            _id: 'st007',
            name: 'Chill Beats',
            tags: ['Lo-Fi', 'Chill', 'Study'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'song091', title: 'eevee - forest glade', src: 'https://www.youtube.com/embed/vW4kZ0yV6xM', imgUrl: 'https://img.youtube.com/vi/vW4kZ0yV6xM/hqdefault.jpg' },
                { id: 'song092', title: 'Nymano - Hope', src: 'https://www.youtube.com/embed/kqZ2YkHhDZo', imgUrl: 'https://img.youtube.com/vi/kqZ2YkHhDZo/hqdefault.jpg' },
                { id: 'song093', title: 'Jinsang - affection', src: 'https://www.youtube.com/embed/6nl8XpcwG8o', imgUrl: 'https://img.youtube.com/vi/6nl8XpcwG8o/hqdefault.jpg' },
                { id: 'song094', title: 'idealism - both of us', src: 'https://www.youtube.com/embed/Hx5cbV1M7y8', imgUrl: 'https://img.youtube.com/vi/Hx5cbV1M7y8/hqdefault.jpg' },
                { id: 'song095', title: 'Saib - West Lake', src: 'https://www.youtube.com/embed/1IkK8A3e9fs', imgUrl: 'https://img.youtube.com/vi/1IkK8A3e9fs/hqdefault.jpg' },
                { id: 'song096', title: 'Philanthrope - Fallen', src: 'https://www.youtube.com/embed/8y4YgIYHz3c', imgUrl: 'https://img.youtube.com/vi/8y4YgIYHz3c/hqdefault.jpg' },
                { id: 'song097', title: 'Aso - Seasons', src: 'https://www.youtube.com/embed/e3XyZz7I3dY', imgUrl: 'https://img.youtube.com/vi/e3XyZz7I3dY/hqdefault.jpg' },
                { id: 'song098', title: 'In Love With a Ghost - i was feeling down then i found a nice witch', src: 'https://www.youtube.com/embed/x2lA5k2fgpE', imgUrl: 'https://img.youtube.com/vi/x2lA5k2fgpE/hqdefault.jpg' },
                { id: 'song099', title: 'Idealism - Snowfall', src: 'https://www.youtube.com/embed/VrQb8D2zTfY', imgUrl: 'https://img.youtube.com/vi/VrQb8D2zTfY/hqdefault.jpg' },
                { id: 'song100', title: 'Lofi Radiance - Cozy Night', src: 'https://www.youtube.com/embed/ZWQ1v4XZy90', imgUrl: 'https://img.youtube.com/vi/ZWQ1v4XZy90/hqdefault.jpg' },
                { id: 'song101', title: 'mt. fujitive - nostalgia', src: 'https://www.youtube.com/embed/7lH8XzTf2Y0', imgUrl: 'https://img.youtube.com/vi/7lH8XzTf2Y0/hqdefault.jpg' },
                { id: 'song102', title: 'L’indécis - Soulful', src: 'https://www.youtube.com/embed/fxQ3e4KPXKQ', imgUrl: 'https://img.youtube.com/vi/fxQ3e4KPXKQ/hqdefault.jpg' },
                { id: 'song103', title: 'FloFilz - Nomind', src: 'https://www.youtube.com/embed/As0R7bXoQ1I', imgUrl: 'https://img.youtube.com/vi/As0R7bXoQ1I/hqdefault.jpg' },
                { id: 'song104', title: 'Birocratic - Tony’s Belated Breakfast', src: 'https://www.youtube.com/embed/Eo7Q4QdYKZo', imgUrl: 'https://img.youtube.com/vi/Eo7Q4QdYKZo/hqdefault.jpg' },
                { id: 'song105', title: 'Philanthrope - Fallen Part 2', src: 'https://www.youtube.com/embed/9EX5pV3r0S0', imgUrl: 'https://img.youtube.com/vi/9EX5pV3r0S0/hqdefault.jpg' }
            ]
        },
        {
            _id: 'st008',
            name: 'Pop Hits',
            tags: ['Pop', 'Hits', 'Chart'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'song106', title: 'Dua Lipa - Don’t Start Now', src: 'https://www.youtube.com/embed/oygrmJFKYZY', imgUrl: 'https://img.youtube.com/vi/oygrmJFKYZY/hqdefault.jpg' },
                { id: 'song107', title: 'Ariana Grande - 7 rings', src: 'https://www.youtube.com/embed/QYh6mYIJG2Y', imgUrl: 'https://img.youtube.com/vi/QYh6mYIJG2Y/hqdefault.jpg' },
                { id: 'song108', title: 'Billie Eilish - Bad Guy', src: 'https://www.youtube.com/embed/DyDfgMOUjCI', imgUrl: 'https://img.youtube.com/vi/DyDfgMOUjCI/hqdefault.jpg' },
                { id: 'song109', title: 'Shawn Mendes - Stitches', src: 'https://www.youtube.com/embed/VbfpW0pbvaU', imgUrl: 'https://img.youtube.com/vi/VbfpW0pbvaU/hqdefault.jpg' },
                { id: 'song110', title: 'Camila Cabello - Havana', src: 'https://www.youtube.com/embed/bpR7N4Oj48Y', imgUrl: 'https://img.youtube.com/vi/bpR7N4Oj48Y/hqdefault.jpg' },
                { id: 'song111', title: 'Selena Gomez - Lose You To Love Me', src: 'https://www.youtube.com/embed/Z7fV6qFS6LQ', imgUrl: 'https://img.youtube.com/vi/Z7fV6qFS6LQ/hqdefault.jpg' },
                { id: 'song112', title: 'Lady Gaga - Rain On Me', src: 'https://www.youtube.com/embed/Af6TTRp_5s0', imgUrl: 'https://img.youtube.com/vi/Af6TTRp_5s0/hqdefault.jpg' },
                { id: 'song113', title: 'Harry Styles - Watermelon Sugar', src: 'https://www.youtube.com/embed/E07s5ZYygMg', imgUrl: 'https://img.youtube.com/vi/E07s5ZYygMg/hqdefault.jpg' },
                { id: 'song114', title: 'Demi Lovato - Sorry Not Sorry', src: 'https://www.youtube.com/embed/1tC7Jp5Jecw', imgUrl: 'https://img.youtube.com/vi/1tC7Jp5Jecw/hqdefault.jpg' },
                { id: 'song115', title: 'Kesha - Tik Tok', src: 'https://www.youtube.com/embed/iP6XpLQM2Cs', imgUrl: 'https://img.youtube.com/vi/iP6XpLQM2Cs/hqdefault.jpg' },
                { id: 'song116', title: 'Bruno Mars - 24K Magic', src: 'https://www.youtube.com/embed/UqyT8IEBkvY', imgUrl: 'https://img.youtube.com/vi/UqyT8IEBkvY/hqdefault.jpg' },
                { id: 'song117', title: 'Justin Timberlake - Can’t Stop the Feeling', src: 'https://www.youtube.com/embed/ru0K8uYEZWw', imgUrl: 'https://img.youtube.com/vi/ru0K8uYEZWw/hqdefault.jpg' },
                { id: 'song118', title: 'Shakira - Hips Don’t Lie', src: 'https://www.youtube.com/embed/DUT5rEU6pqM', imgUrl: 'https://img.youtube.com/vi/DUT5rEU6pqM/hqdefault.jpg' },
                { id: 'song119', title: 'Rihanna - Diamonds', src: 'https://www.youtube.com/embed/lWA2pjMjpBs', imgUrl: 'https://img.youtube.com/vi/lWA2pjMjpBs/hqdefault.jpg' },
                { id: 'song120', title: 'Camila Cabello - Never Be The Same', src: 'https://www.youtube.com/embed/5wB7uJE8jYE', imgUrl: 'https://img.youtube.com/vi/5wB7uJE8jYE/hqdefault.jpg' }
            ]
        },
        {
            _id: 'st009',
            name: 'Rock Anthems',
            tags: ['Rock', 'Anthem', 'Classic'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'song121', title: 'Oasis - Wonderwall', src: 'https://www.youtube.com/embed/bx1Bh8ZvH84', imgUrl: 'https://img.youtube.com/vi/bx1Bh8ZvH84/hqdefault.jpg' },
                { id: 'song122', title: 'Survivor - Eye Of The Tiger', src: 'https://www.youtube.com/embed/ZXsQAXx_ao0', imgUrl: 'https://img.youtube.com/vi/ZXsQAXx_ao0/hqdefault.jpg' },
                { id: 'song123', title: 'Queen - We Will Rock You', src: 'https://www.youtube.com/embed/-tJYN-eG1zk', imgUrl: 'https://img.youtube.com/vi/-tJYN-eG1zk/hqdefault.jpg' },
                { id: 'song124', title: 'Bon Jovi - It’s My Life', src: 'https://www.youtube.com/embed/vx2u5uUu3DE', imgUrl: 'https://img.youtube.com/vi/vx2u5uUu3DE/hqdefault.jpg' },
                { id: 'song125', title: 'Green Day - Boulevard of Broken Dreams', src: 'https://www.youtube.com/embed/Soa3gO7tL-c', imgUrl: 'https://img.youtube.com/vi/Soa3gO7tL-c/hqdefault.jpg' },
                { id: 'song126', title: 'Linkin Park - Numb', src: 'https://www.youtube.com/embed/kXYiU_JCYtU', imgUrl: 'https://img.youtube.com/vi/kXYiU_JCYtU/hqdefault.jpg' },
                { id: 'song127', title: 'Nirvana - Come As You Are', src: 'https://www.youtube.com/embed/vabnZ9-ex7o', imgUrl: 'https://img.youtube.com/vi/vabnZ9-ex7o/hqdefault.jpg' },
                { id: 'song128', title: 'The White Stripes - Seven Nation Army', src: 'https://www.youtube.com/embed/0J2QdDbelmY', imgUrl: 'https://img.youtube.com/vi/0J2QdDbelmY/hqdefault.jpg' },
                { id: 'song129', title: 'Imagine Dragons - Believer', src: 'https://www.youtube.com/embed/7wtfhZwyrcc', imgUrl: 'https://img.youtube.com/vi/7wtfhZwyrcc/hqdefault.jpg' },
                { id: 'song130', title: 'Red Hot Chili Peppers - By The Way', src: 'https://www.youtube.com/embed/FrM0WcZ3_iY', imgUrl: 'https://img.youtube.com/vi/FrM0WcZ3_iY/hqdefault.jpg' },
                { id: 'song131', title: 'Paramore - Misery Business', src: 'https://www.youtube.com/embed/aCyGvGEtOwc', imgUrl: 'https://img.youtube.com/vi/aCyGvGEtOwc/hqdefault.jpg' },
                { id: 'song132', title: 'The Killers - When You Were Young', src: 'https://www.youtube.com/embed/2D5TT3x9Zt0', imgUrl: 'https://img.youtube.com/vi/2D5TT3x9Zt0/hqdefault.jpg' },
                { id: 'song133', title: 'Muse - Uprising', src: 'https://www.youtube.com/embed/w8KQmps-Sog', imgUrl: 'https://img.youtube.com/vi/w8KQmps-Sog/hqdefault.jpg' },
                { id: 'song134', title: 'Foo Fighters - The Pretender', src: 'https://www.youtube.com/embed/SBjQ9tuuTJQ', imgUrl: 'https://img.youtube.com/vi/SBjQ9tuuTJQ/hqdefault.jpg' },
                { id: 'song135', title: 'The Rolling Stones - Paint It Black', src: 'https://www.youtube.com/embed/O4irXQhgMqg', imgUrl: 'https://img.youtube.com/vi/O4irXQhgMqg/hqdefault.jpg' }
            ]
        },
        {
            _id: 'st010',
            name: 'Relaxing Acoustic',
            tags: ['Acoustic', 'Chill', 'Indie'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'song136', title: 'Jack Johnson - Better Together', src: 'https://www.youtube.com/embed/u57d4_b_YgI', imgUrl: 'https://img.youtube.com/vi/u57d4_b_YgI/hqdefault.jpg' },
                { id: 'song137', title: 'Ed Sheeran - Tenerife Sea', src: 'https://www.youtube.com/embed/R1c5vH1kYXM', imgUrl: 'https://img.youtube.com/vi/R1c5vH1kYXM/hqdefault.jpg' },
                { id: 'song138', title: 'Passenger - Let Her Go', src: 'https://www.youtube.com/embed/RBumgq5yVrA', imgUrl: 'https://img.youtube.com/vi/RBumgq5yVrA/hqdefault.jpg' },
                { id: 'song139', title: 'Vance Joy - Riptide', src: 'https://www.youtube.com/embed/uJ_1HMAGb4k', imgUrl: 'https://img.youtube.com/vi/uJ_1HMAGb4k/hqdefault.jpg' },
                { id: 'song140', title: 'James Bay - Let It Go', src: 'https://www.youtube.com/embed/AlpChQZ1jXw', imgUrl: 'https://img.youtube.com/vi/AlpChQZ1jXw/hqdefault.jpg' },
                { id: 'song141', title: 'The Lumineers - Ho Hey', src: 'https://www.youtube.com/embed/0z6B9-5Vt6k', imgUrl: 'https://img.youtube.com/vi/0z6B9-5Vt6k/hqdefault.jpg' },
                { id: 'song142', title: 'Norah Jones - Don’t Know Why', src: 'https://www.youtube.com/embed/tO4dxvguQDk', imgUrl: 'https://img.youtube.com/vi/tO4dxvguQDk/hqdefault.jpg' },
                { id: 'song143', title: 'Ben Howard - Only Love', src: 'https://www.youtube.com/embed/9U4lCjFfshQ', imgUrl: 'https://img.youtube.com/vi/9U4lCjFfshQ/hqdefault.jpg' },
                { id: 'song144', title: 'Shawn Mendes - Treat You Better', src: 'https://www.youtube.com/embed/LjhCEhWiKXk', imgUrl: 'https://img.youtube.com/vi/LjhCEhWiKXk/hqdefault.jpg' },
                { id: 'song145', title: 'Tracy Chapman - Fast Car', src: 'https://www.youtube.com/embed/uTIB10eQnA0', imgUrl: 'https://img.youtube.com/vi/uTIB10eQnA0/hqdefault.jpg' },
                { id: 'song146', title: 'Jason Mraz - I’m Yours', src: 'https://www.youtube.com/embed/E0V3Yp1d9Vk', imgUrl: 'https://img.youtube.com/vi/E0V3Yp1d9Vk/hqdefault.jpg' },
                { id: 'song147', title: 'Iron & Wine - Naked As We Came', src: 'https://www.youtube.com/embed/7m6w1gIBxZ8', imgUrl: 'https://img.youtube.com/vi/7m6w1gIBxZ8/hqdefault.jpg' },
                { id: 'song148', title: 'Damien Rice - The Blower’s Daughter', src: 'https://www.youtube.com/embed/r-xHk_fyO9g', imgUrl: 'https://img.youtube.com/vi/r-xHk_fyO9g/hqdefault.jpg' },
                { id: 'song149', title: 'Fleetwood Mac - Landslide', src: 'https://www.youtube.com/embed/WM7-PYtXtJM', imgUrl: 'https://img.youtube.com/vi/WM7-PYtXtJM/hqdefault.jpg' },
                { id: 'song150', title: 'John Mayer - Gravity', src: 'https://www.youtube.com/embed/0C3Hn1vM1q8', imgUrl: 'https://img.youtube.com/vi/0C3Hn1vM1q8/hqdefault.jpg' }
            ]
        },
        {
            _id: 'st011',
            name: 'Electronic Chill',
            tags: ['Electronic', 'Chill', 'Ambient'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'song151', title: 'ODESZA - Line Of Sight', src: 'https://www.youtube.com/embed/2OEL4P1Rz04', imgUrl: 'https://img.youtube.com/vi/2OEL4P1Rz04/hqdefault.jpg' },
                { id: 'song152', title: 'Flume - Never Be Like You', src: 'https://www.youtube.com/embed/6cXjz9_1nY0', imgUrl: 'https://img.youtube.com/vi/6cXjz9_1nY0/hqdefault.jpg' },
                { id: 'song153', title: 'Kygo - Stole The Show', src: 'https://www.youtube.com/embed/4j7dzY1t7W4', imgUrl: 'https://img.youtube.com/vi/4j7dzY1t7W4/hqdefault.jpg' },
                { id: 'song154', title: 'Petit Biscuit - Sunset Lover', src: 'https://www.youtube.com/embed/8K3PTuFQWxI', imgUrl: 'https://img.youtube.com/vi/8K3PTuFQWxI/hqdefault.jpg' },
                { id: 'song155', title: 'San Holo - Light', src: 'https://www.youtube.com/embed/DKcXJjc0xIY', imgUrl: 'https://img.youtube.com/vi/DKcXJjc0xIY/hqdefault.jpg' },
                { id: 'song156', title: 'Mura Masa - Love$ick', src: 'https://www.youtube.com/embed/vdK7dM1bZk0', imgUrl: 'https://img.youtube.com/vi/vdK7dM1bZk0/hqdefault.jpg' },
                { id: 'song157', title: 'RÜFÜS DU SOL - Innerbloom', src: 'https://www.youtube.com/embed/UJ5XbG5h-Aw', imgUrl: 'https://img.youtube.com/vi/UJ5XbG5h-Aw/hqdefault.jpg' },
                { id: 'song158', title: 'Tycho - Awake', src: 'https://www.youtube.com/embed/FpQWQ5J6ekI', imgUrl: 'https://img.youtube.com/vi/FpQWQ5J6ekI/hqdefault.jpg' },
                { id: 'song159', title: 'Jon Hopkins - Emerald Rush', src: 'https://www.youtube.com/embed/8J20gxJtH8c', imgUrl: 'https://img.youtube.com/vi/8J20gxJtH8c/hqdefault.jpg' },
                { id: 'song160', title: 'Bonobo - Cirrus', src: 'https://www.youtube.com/embed/Wl9bZQk3kXc', imgUrl: 'https://img.youtube.com/vi/Wl9bZQk3kXc/hqdefault.jpg' },
                { id: 'song161', title: 'Lane 8 - Fingerprint', src: 'https://www.youtube.com/embed/3yGZ4nE6xFw', imgUrl: 'https://img.youtube.com/vi/3yGZ4nE6xFw/hqdefault.jpg' },
                { id: 'song162', title: 'Kaskade - Atmosphere', src: 'https://www.youtube.com/embed/mSftmRdoGcM', imgUrl: 'https://img.youtube.com/vi/mSftmRdoGcM/hqdefault.jpg' },
                { id: 'song163', title: 'Deadmau5 - Strobe', src: 'https://www.youtube.com/embed/_0K7z0QxN20', imgUrl: 'https://img.youtube.com/vi/_0K7z0QxN20/hqdefault.jpg' },
                { id: 'song164', title: 'Porter Robinson - Sad Machine', src: 'https://www.youtube.com/embed/lcUQe1jxPPs', imgUrl: 'https://img.youtube.com/vi/lcUQe1jxPPs/hqdefault.jpg' },
                { id: 'song165', title: 'Eric Prydz - Opus', src: 'https://www.youtube.com/embed/5uN6Bd3HtbE', imgUrl: 'https://img.youtube.com/vi/5uN6Bd3HtbE/hqdefault.jpg' }
            ]
        }
        ,


        {
            _id: 'st012',
            name: 'Indie Vibes',
            tags: ['Indie', 'Alternative', 'Chill'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'song166', title: 'Tame Impala - The Less I Know The Better', src: 'https://www.youtube.com/embed/NUC2EQvdzmY', imgUrl: 'https://img.youtube.com/vi/NUC2EQvdzmY/hqdefault.jpg' },
                { id: 'song167', title: 'Arctic Monkeys - Do I Wanna Know?', src: 'https://www.youtube.com/embed/bpOSxM0rNPM', imgUrl: 'https://img.youtube.com/vi/bpOSxM0rNPM/hqdefault.jpg' },
                { id: 'song168', title: 'Vampire Weekend - Harmony Hall', src: 'https://www.youtube.com/embed/IQQ2F6dqj3Q', imgUrl: 'https://img.youtube.com/vi/IQQ2F6dqj3Q/hqdefault.jpg' },
                { id: 'song169', title: 'The Strokes - Reptilia', src: 'https://www.youtube.com/embed/6bEJtN3fKqM', imgUrl: 'https://img.youtube.com/vi/6bEJtN3fKqM/hqdefault.jpg' },
                { id: 'song170', title: 'Foster The People - Pumped Up Kicks', src: 'https://www.youtube.com/embed/SDTZ7iX4vTQ', imgUrl: 'https://img.youtube.com/vi/SDTZ7iX4vTQ/hqdefault.jpg' },
                { id: 'song171', title: 'Alt-J - Breezeblocks', src: 'https://www.youtube.com/embed/rVeMiVU77wo', imgUrl: 'https://img.youtube.com/vi/rVeMiVU77wo/hqdefault.jpg' },
                { id: 'song172', title: 'MGMT - Electric Feel', src: 'https://www.youtube.com/embed/mmvXl2c6p7I', imgUrl: 'https://img.youtube.com/vi/mmvXl2c6p7I/hqdefault.jpg' },
                { id: 'song173', title: 'Hozier - Take Me To Church', src: 'https://www.youtube.com/embed/MYSVMgRr6pw', imgUrl: 'https://img.youtube.com/vi/MYSVMgRr6pw/hqdefault.jpg' },
                { id: 'song174', title: 'Imagine Dragons - Radioactive', src: 'https://www.youtube.com/embed/ktvTqknDobU', imgUrl: 'https://img.youtube.com/vi/ktvTqknDobU/hqdefault.jpg' },
                { id: 'song175', title: 'The 1975 - Somebody Else', src: 'https://www.youtube.com/embed/CN6Tj5kP_iQ', imgUrl: 'https://img.youtube.com/vi/CN6Tj5kP_iQ/hqdefault.jpg' },
                { id: 'song176', title: 'Kings of Leon - Use Somebody', src: 'https://www.youtube.com/embed/SLsT5xXfwtU', imgUrl: 'https://img.youtube.com/vi/SLsT5xXfwtU/hqdefault.jpg' },
                { id: 'song177', title: 'Two Door Cinema Club - What You Know', src: 'https://www.youtube.com/embed/Ix0VdNXp2oc', imgUrl: 'https://img.youtube.com/vi/Ix0VdNXp2oc/hqdefault.jpg' },
                { id: 'song178', title: 'The Killers - Mr. Brightside', src: 'https://www.youtube.com/embed/gGdGFtwCNBE', imgUrl: 'https://img.youtube.com/vi/gGdGFtwCNBE/hqdefault.jpg' },
                { id: 'song179', title: 'Bastille - Pompeii', src: 'https://www.youtube.com/embed/FSPb1gU9hWc', imgUrl: 'https://img.youtube.com/vi/FSPb1gU9hWc/hqdefault.jpg' },
                { id: 'song180', title: 'Alt-J - Taro', src: 'https://www.youtube.com/embed/L2N4XtwzI_g', imgUrl: 'https://img.youtube.com/vi/L2N4XtwzI_g/hqdefault.jpg' }
            ]
        },
        {
            _id: 'st013',
            name: 'R&B Essentials',
            tags: ['R&B', 'Soul', 'Smooth'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'song181', title: 'The Weeknd - Blinding Lights', src: 'https://www.youtube.com/embed/fHI8X4OXluQ', imgUrl: 'https://img.youtube.com/vi/fHI8X4OXluQ/hqdefault.jpg' },
                { id: 'song182', title: 'Frank Ocean - Thinkin Bout You', src: 'https://www.youtube.com/embed/pnBhyBCnk38', imgUrl: 'https://img.youtube.com/vi/pnBhyBCnk38/hqdefault.jpg' },
                { id: 'song183', title: 'Beyoncé - Halo', src: 'https://www.youtube.com/embed/fm2aM0tVjiw', imgUrl: 'https://img.youtube.com/vi/fm2aM0tVjiw/hqdefault.jpg' },
                { id: 'song184', title: 'Usher - Yeah!', src: 'https://www.youtube.com/embed/GxBSyx85Kp8', imgUrl: 'https://img.youtube.com/vi/GxBSyx85Kp8/hqdefault.jpg' },
                { id: 'song185', title: 'Alicia Keys - If I Ain’t Got You', src: 'https://www.youtube.com/embed/J1r3bzk3p9Q', imgUrl: 'https://img.youtube.com/vi/J1r3bzk3p9Q/hqdefault.jpg' },
                { id: 'song186', title: 'Miguel - Adorn', src: 'https://www.youtube.com/embed=8tfYwR0Q_8k', imgUrl: 'https://img.youtube.com/vi/8tfYwR0Q_8k/hqdefault.jpg' },
                { id: 'song187', title: 'Chris Brown - With You', src: 'https://www.youtube.com/embed/ZWcZ3lYqBRI', imgUrl: 'https://img.youtube.com/vi/ZWcZ3lYqBRI/hqdefault.jpg' },
                { id: 'song188', title: 'TLC - No Scrubs', src: 'https://www.youtube.com/embed=FrLequ6dUdM', imgUrl: 'https://img.youtube.com/vi/FrLequ6dUdM/hqdefault.jpg' },
                { id: 'song189', title: 'Rihanna - Stay', src: 'https://www.youtube.com/embed=pEj0fQz9mF0', imgUrl: 'https://img.youtube.com/vi/pEj0fQz9mF0/hqdefault.jpg' },
                { id: 'song190', title: 'Beyoncé - Crazy In Love', src: 'https://www.youtube.com/embed/ViwtNLUqkMY', imgUrl: 'https://img.youtube.com/vi/ViwtNLUqkMY/hqdefault.jpg' },
                { id: 'song191', title: 'Jhene Aiko - Spotless Mind', src: 'https://www.youtube.com/embed/ZgDhI1mPu58', imgUrl: 'https://img.youtube.com/vi/ZgDhI1mPu58/hqdefault.jpg' },
                { id: 'song192', title: 'SZA - Good Days', src: 'https://www.youtube.com/embed/xmvyAQmQwS8', imgUrl: 'https://img.youtube.com/vi/xmvyAQmQwS8/hqdefault.jpg' },
                { id: 'song193', title: 'Bruno Mars - That’s What I Like', src: 'https://www.youtube.com/embed/H2QFa5iSHu4', imgUrl: 'https://img.youtube.com/vi/H2QFa5iSHu4/hqdefault.jpg' },
                { id: 'song194', title: 'John Legend - All Of Me', src: 'https://www.youtube.com/embed/450p7goxZqg', imgUrl: 'https://img.youtube.com/vi/450p7goxZqg/hqdefault.jpg' },
                { id: 'song195', title: 'Adele - Hello', src: 'https://www.youtube.com/embed/YQHsXMglC9A', imgUrl: 'https://img.youtube.com/vi/YQHsXMglC9A/hqdefault.jpg' }
            ]
        },
        {
            _id: 'st014',
            name: 'Dance Floor',
            tags: ['Dance', 'Electronic', 'Party'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'song196', title: 'Daft Punk - Get Lucky', src: 'https://www.youtube.com/embed/5NV6Rdv1a3I', imgUrl: 'https://img.youtube.com/vi/5NV6Rdv1a3I/hqdefault.jpg' },
                { id: 'song197', title: 'Calvin Harris - Summer', src: 'https://www.youtube.com/embed/ebXbLfLACGM', imgUrl: 'https://img.youtube.com/vi/ebXbLfLACGM/hqdefault.jpg' },
                { id: 'song198', title: 'Avicii - Levels', src: 'https://www.youtube.com/embed/9ZfN87gSjvI', imgUrl: 'https://img.youtube.com/vi/9ZfN87gSjvI/hqdefault.jpg' },
                { id: 'song199', title: 'David Guetta - Titanium', src: 'https://www.youtube.com/embed/JRfuAukYTKg', imgUrl: 'https://img.youtube.com/vi/JRfuAukYTKg/hqdefault.jpg' },
                { id: 'song200', title: 'Zedd - Clarity', src: 'https://www.youtube.com/embed/IxxstCcJlsc', imgUrl: 'https://img.youtube.com/vi/IxxstCcJlsc/hqdefault.jpg' },
                { id: 'song201', title: 'Kygo - Firestone', src: 'https://www.youtube.com/embed/9Sc-ir2UwGU', imgUrl: 'https://img.youtube.com/vi/9Sc-ir2UwGU/hqdefault.jpg' },
                { id: 'song202', title: 'Martin Garrix - Animals', src: 'https://www.youtube.com/embed/gCYcHz2k5x0', imgUrl: 'https://img.youtube.com/vi/gCYcHz2k5x0/hqdefault.jpg' },
                { id: 'song203', title: 'Major Lazer - Lean On', src: 'https://www.youtube.com/embed/YqeW9_5kURI', imgUrl: 'https://img.youtube.com/vi/YqeW9_5kURI/hqdefault.jpg' },
                { id: 'song204', title: 'The Chainsmokers - Closer', src: 'https://www.youtube.com/embed/PT2_F-1esPk', imgUrl: 'https://img.youtube.com/vi/PT2_F-1esPk/hqdefault.jpg' },
                { id: 'song205', title: 'Sia - Cheap Thrills', src: 'https://www.youtube.com/embed/nYh-n7EOtMA', imgUrl: 'https://img.youtube.com/vi/nYh-n7EOtMA/hqdefault.jpg' },
                { id: 'song206', title: 'Robin Schulz - Sugar', src: 'https://www.youtube.com/embed/QF1slF7q5V0', imgUrl: 'https://img.youtube.com/vi/QF1slF7q5V0/hqdefault.jpg' },
                { id: 'song207', title: 'David Guetta - Play Hard', src: 'https://www.youtube.com/embed/VaL9r6YhRr0', imgUrl: 'https://img.youtube.com/vi/VaL9r6YhRr0/hqdefault.jpg' },
                { id: 'song208', title: 'Calvin Harris - Feel So Close', src: 'https://www.youtube.com/embed/3nQNiWdeH2Q', imgUrl: 'https://img.youtube.com/vi/3nQNiWdeH2Q/hqdefault.jpg' },
                { id: 'song209', title: 'Major Lazer - Powerful', src: 'https://www.youtube.com/embed/_ZC1rgVTS8s', imgUrl: 'https://img.youtube.com/vi/_ZC1rgVTS8s/hqdefault.jpg' },
                { id: 'song210', title: 'Martin Solveig - The Night Out', src: 'https://www.youtube.com/embed/DvM1KO2dEn0', imgUrl: 'https://img.youtube.com/vi/DvM1KO2dEn0/hqdefault.jpg' }
            ]
        },
        {
            _id: 'st015',
            name: 'Rap Legends',
            tags: ['Hip Hop', 'Rap', 'Classic'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'song211', title: 'Snoop Dogg - Drop It Like It’s Hot', src: 'https://www.youtube.com/embed/WILNIXZr2oc', imgUrl: 'https://img.youtube.com/vi/WILNIXZr2oc/hqdefault.jpg' },
                { id: 'song212', title: 'The Notorious B.I.G. - Juicy', src: 'https://www.youtube.com/embed/DksSPZTZES0', imgUrl: 'https://img.youtube.com/vi/DksSPZTZES0/hqdefault.jpg' },
                { id: 'song213', title: 'Tupac - California Love', src: 'https://www.youtube.com/embed/5wBtV3_9ohM', imgUrl: 'https://img.youtube.com/vi/5wBtV3_9ohM/hqdefault.jpg' },
                { id: 'song214', title: 'Dr Dre - Nuthin’ But A G Thang', src: 'https://www.youtube.com/embed/1c9tD7fTi5c', imgUrl: 'https://img.youtube.com/vi/1c9tD7fTi5c/hqdefault.jpg' },
                { id: 'song215', title: 'Jay-Z - 99 Problems', src: 'https://www.youtube.com/embed/h3EjCK5NBzU', imgUrl: 'https://img.youtube.com/vi/h3EjCK5NBzU/hqdefault.jpg' },
                { id: 'song216', title: 'Eminem - Lose Yourself', src: 'https://www.youtube.com/embed/_Yhyp-_hX2s', imgUrl: 'https://img.youtube.com/vi/_Yhyp-_hX2s/hqdefault.jpg' },
                { id: 'song217', title: 'Kendrick Lamar - HUMBLE.', src: 'https://www.youtube.com/embed/tvTRZJ-4EyI', imgUrl: 'https://img.youtube.com/vi/tvTRZJ-4EyI/hqdefault.jpg' },
                { id: 'song218', title: 'Nas - N.Y. State Of Mind', src: 'https://www.youtube.com/embed=UKjj4hk0pV4', imgUrl: 'https://img.youtube.com/vi/UKjj4hk0pV4/hqdefault.jpg' },
                { id: 'song219', title: 'OutKast - Ms. Jackson', src: 'https://www.youtube.com/embed=MYxAiK6VnXw', imgUrl: 'https://img.youtube.com/vi/MYxAiK6VnXw/hqdefault.jpg' },
                { id: 'song220', title: '50 Cent - In Da Club', src: 'https://www.youtube.com/embed/5qm8PH4xAss', imgUrl: 'https://img.youtube.com/vi/5qm8PH4xAss/hqdefault.jpg' },
                { id: 'song221', title: 'Wu-Tang Clan - C.R.E.A.M.', src: 'https://www.youtube.com/embed=PBwAxmrE194', imgUrl: 'https://img.youtube.com/vi/PBwAxmrE194/hqdefault.jpg' },
                { id: 'song222', title: 'Ice Cube - It Was A Good Day', src: 'https://www.youtube.com/embed=5tF7r8dM8C0', imgUrl: 'https://img.youtube.com/vi/5tF7r8dM8C0/hqdefault.jpg' },
                { id: 'song223', title: 'Drake - God’s Plan', src: 'https://www.youtube.com/embed/xpVfcZ0ZcFM', imgUrl: 'https://img.youtube.com/vi/xpVfcZ0ZcFM/hqdefault.jpg' },
                { id: 'song224', title: 'Migos - Bad And Boujee', src: 'https://www.youtube.com/embed/S-sJp1FfG7Q', imgUrl: 'https://img.youtube.com/vi/S-sJp1FfG7Q/hqdefault.jpg' },
                { id: 'song225', title: 'Kanye West - Stronger', src: 'https://www.youtube.com/embed=PsO6ZnUZI0g', imgUrl: 'https://img.youtube.com/vi/PsO6ZnUZI0g/hqdefault.jpg' }
            ]
        },

        {
            _id: 'st016',
            name: 'Israeli Hits',
            tags: ['Israeli', 'Pop', 'Rock', 'Indie'],
            createdBy: { _id: 'u101', fullname: 'Yoav' },
            likedByUsers: [],
            songs: [
                { id: 'song226', title: 'Eifo Hayeled - Ma Nishtana', src: 'https://www.youtube.com/embed/2x_Ax0dL1J4', imgUrl: 'https://img.youtube.com/vi/2x_Ax0dL1J4/hqdefault.jpg' },
                { id: 'song227', title: 'Omer Adam - Tel Aviv', src: 'https://www.youtube.com/embed/7ON0rz4t_xU', imgUrl: 'https://img.youtube.com/vi/7ON0rz4t_xU/hqdefault.jpg' },
                { id: 'song228', title: 'Static & Ben El - Tudo Bom', src: 'https://www.youtube.com/embed/nZnYtZjP72o', imgUrl: 'https://img.youtube.com/vi/nZnYtZjP72o/hqdefault.jpg' },
                { id: 'song229', title: 'Ivri Lider - Ze Lo Osef', src: 'https://www.youtube.com/embed/DN_KZij6L6s', imgUrl: 'https://img.youtube.com/vi/DN_KZij6L6s/hqdefault.jpg' },
                { id: 'song230', title: 'Noa Kirel - Million Dollar', src: 'https://www.youtube.com/embed/3_EZkOdP9uA', imgUrl: 'https://img.youtube.com/vi/3_EZkOdP9uA/hqdefault.jpg' },
                { id: 'song231', title: 'Hanan Ben Ari - Rak Bishvilo', src: 'https://www.youtube.com/embed/4XUh0pRBVlw', imgUrl: 'https://img.youtube.com/vi/4XUh0pRBVlw/hqdefault.jpg' },
                { id: 'song232', title: 'Eden Ben Zaken - Malkat HaShoshanim', src: 'https://www.youtube.com/embed/GmAYnNnYQlE', imgUrl: 'https://img.youtube.com/vi/GmAYnNnYQlE/hqdefault.jpg' },
                { id: 'song233', title: 'Ivri Lider - Ahava', src: 'https://www.youtube.com/embed/Z1LhVvGxeGk', imgUrl: 'https://img.youtube.com/vi/Z1LhVvGxeGk/hqdefault.jpg' },
                { id: 'song234', title: 'Static & Ben El - Silsulim', src: 'https://www.youtube.com/embed/xA8xR1I6DJk', imgUrl: 'https://img.youtube.com/vi/xA8xR1I6DJk/hqdefault.jpg' },
                { id: 'song235', title: 'Omer Adam - Shnei Meshugaim', src: 'https://www.youtube.com/embed/dXkPcgZt5zo', imgUrl: 'https://img.youtube.com/vi/dXkPcgZt5zo/hqdefault.jpg' },
                { id: 'song236', title: 'Roni Dalumi - Nof', src: 'https://www.youtube.com/embed/0lRVd8RjR1A', imgUrl: 'https://img.youtube.com/vi/0lRVd8RjR1A/hqdefault.jpg' },
                { id: 'song237', title: 'Shiri Maimon - Hasheket Shenish’ar', src: 'https://www.youtube.com/embed/y6uJwS_8Mls', imgUrl: 'https://img.youtube.com/vi/y6uJwS_8Mls/hqdefault.jpg' },
                { id: 'song238', title: 'Rita - Yerushalayim Shel Zahav', src: 'https://www.youtube.com/embed/xDkOi1U0FZY', imgUrl: 'https://img.youtube.com/vi/xDkOi1U0FZY/hqdefault.jpg' },
                { id: 'song239', title: 'Ivri Lider - Bo', src: 'https://www.youtube.com/embed/_7TR0Dd7T2Q', imgUrl: 'https://img.youtube.com/vi/_7TR0Dd7T2Q/hqdefault.jpg' },
                { id: 'song240', title: 'Static & Ben El - Tudo Bom Remix', src: 'https://www.youtube.com/embed/GvD4pPpOD3c', imgUrl: 'https://img.youtube.com/vi/GvD4pPpOD3c/hqdefault.jpg' }
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
        imgUrl: "https://misc.scdn.co/liked-songs/liked-songs-300.png",
        averageColor: 'rgba(47, 38, 89, 0.9)'
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
                station.averageColor = 'rgba(0,0,0,1)'

            }
        })
    )
    return stations
}








