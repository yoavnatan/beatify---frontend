import { SET_NOW_PLAYING, SET_SRC } from '../reducers/player.reducer.js'
import { store } from '../store'


export function setSong(song) {
    store.dispatch(({ type: SET_NOW_PLAYING, nowPlaying: song }))
    // store.dispatch(({ type: SET_SRC, src: song.src }))
}
