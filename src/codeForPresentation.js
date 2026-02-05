function onToggleShuffle() {

    if (nowPlayingStation && !shuffle) { // Checks if theres is a Playlist to shuffle
        const shuffledPlaylist = shuffleArray(nowStation.songs)
        dispatch({ type: SET_STATION_SONGS, stationSongs: shuffledPlaylist }) // a tamporary song list
        if (sharedStation._id === nowPlayingStation._id) {
            socketService.emit(SOCKET_EMIT_ON_SHUFFLE, { stationSongs: shuffledPlaylist })
        }
    } else if (nowPlayingStation._id && shuffle) {
        dispatch({ type: SET_STATION_SONGS, stationSongs: nowPlayingStation.songs })
        if (sharedStation._id === nowPlayingStationId) {
            socketService.emit(SOCKET_EMIT_OFF_SHUFFLE, { stationSongs: nowPlayingStation.songs })
        }
    }
    dispatch({ type: TOGGLE_SHUFFLE })
}



export function shuffleArray(array) {
    let shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

