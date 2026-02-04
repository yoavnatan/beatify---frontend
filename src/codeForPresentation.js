function onToggleShuffle() {

    if (currentPlayingStation && !shuffle) {
        const shuffledPlaylist = shuffleArray(currentStation.songs)
        dispatch({ type: SET_STATION_SONGS, stationSongs: shuffledPlaylist })
        if (sharedStation._id === currentPlayingStation._id) {
            socketService.emit(SOCKET_EMIT_ON_SHUFFLE, { stationSongs: shuffledPlaylist })
        }
    } else if (currentPlayingStation._id && shuffle) {
        dispatch({ type: SET_STATION_SONGS, stationSongs: currentPlayingStation.songs })
        if (sharedStation._id === nowPlayingStationId) {
            socketService.emit(SOCKET_EMIT_OFF_SHUFFLE, { stationSongs: currentPlayingStation.songs })
        }
    }
    dispatch({ type: TOGLLE_SHUFFLE })
}



export function shuffleArray(array) {
    let shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

