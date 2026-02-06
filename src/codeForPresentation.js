function onToggleShuffle() {

    if (nowPlayingStation && !shuffle) { // Checks if theres is a playlist to shuffle
        const shuffledPlaylist = shuffleArray(nowStation.songs)
        dispatch({ type: SET_STATION_SONGS, stationSongs: shuffledPlaylist }) // A tamporary song list we can manipulte
        if (sharedStation._id === nowPlayingStation._id) { // Checks if we're on the shared playlist 
            socketService.emit(SOCKET_EMIT_ON_SHUFFLE, { stationSongs: shuffledPlaylist }) // sharing the shuffled station
        }
    } else if (nowPlayingStation._id && shuffle) { // Unshuffle
        dispatch({ type: SET_STATION_SONGS, stationSongs: nowPlayingStation.songs })
        if (sharedStation._id === nowPlayingStationId) {
            socketService.emit(SOCKET_EMIT_OFF_SHUFFLE, { stationSongs: nowPlayingStation.songs })
        }
    }
    dispatch({ type: TOGGLE_SHUFFLE }) // Goes anyway
}



export function shuffleArray(array) {

    let shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

