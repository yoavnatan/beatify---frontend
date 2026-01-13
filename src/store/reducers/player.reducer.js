export const SET_IS_PLAYING = 'SET_IS_PLAYING'
export const SET_SRC = 'SET_SRC'
export const SET_IS_SEEKING = 'SET_IS_SEEKING'
export const SET_PLAYED = 'SET_PLAYED'
export const SET_PLAYED_SECONDS = 'SET_PLAYED_SECONDS'
export const SET_VOLUME = 'SET_VOLUME'
export const TOGGLE_MUTE = 'TOGGLE_MUTE'
export const SET_LAST_VOLUME = 'SET_LAST_VOLUME'

const initialState = {
    playing: false,
    src: null,
    nowPlaying: null,
    muted: false,
    seeking: false,
    played: 0,
    duration: 0,
    loop: false,
    volume: 1,
    playedSeconds: 0,
    queue: [],
    suffle: false,
    lastVolume: 0,
}

export function playerReducer(state = initialState, action) {
    var newState = state
    switch (action.type) {
        case SET_IS_PLAYING:
            newState = { ...state, playing: !state.playing }
            break
        case SET_SRC:
            newState = { ...state, src: action.src }
            break
        case SET_IS_SEEKING:
            newState = { ...state, seeking: action.seeking }
            break
        case SET_PLAYED:
            newState = { ...state, played: action.played }
            break
        case SET_VOLUME:
            newState = { ...state, volume: action.volume }
            break
        case TOGGLE_MUTE:
            newState = { ...state, muted: action.muted }
            break
        case SET_LAST_VOLUME:
            newState = { ...state, lastVolume: action.lastVolume }
            break

        default:
    }
    return newState
}


