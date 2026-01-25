export const TOGGLE_PLAY = 'TOGGLE_PLAY'
export const SET_SRC = 'SET_SRC'
export const SET_IS_SEEKING = 'SET_IS_SEEKING'
export const SET_PLAYED = 'SET_PLAYED'
export const SET_PLAYED_SECONDS = 'SET_PLAYED_SECONDS'
export const SET_VOLUME = 'SET_VOLUME'
export const TOGGLE_MUTE = 'TOGGLE_MUTE'
export const SET_LAST_VOLUME = 'SET_LAST_VOLUME'
export const TOGLLE_SHUFFLE = 'TOGLLE_SHUFFLE'
export const TOGLLE_LOOP = 'TOGLLE_LOOP'
export const SET_NOW_PLAYING = 'SET_NOW_PLAYING'
export const PLAY = 'PLAY'
export const SET_LAST_CLICKED = 'SET_LAST_CLICKED'
export const TOGGLE_QUEUE_SHOW = 'TOGGLE_QUEUE_SHOW'

const initialState = {
    playing: false,
    // src: null,
    nowPlaying: {},
    muted: false,
    seeking: false,
    played: 0,
    duration: 0,
    loop: false,
    volume: 1,
    playedSeconds: 0,
    queue: [],
    queueShown: false,
    shuffle: false,
    lastVolume: 0,
    lastClickedSong: '',
}

export function playerReducer(state = initialState, action) {
    var newState = state
    switch (action.type) {
        case SET_NOW_PLAYING:
            newState = { ...state, nowPlaying: action.nowPlaying }
            break
        case TOGGLE_PLAY:
            newState = { ...state, playing: !state.playing }
            break
        case PLAY:
            newState = { ...state, playing: true }
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
        case SET_LAST_CLICKED:
            newState = { ...state, lastClickedSong: action.lastClickedSong }
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
        case TOGLLE_SHUFFLE:
            newState = { ...state, shuffle: !state.shuffle }
            break
        case TOGLLE_LOOP:
            newState = { ...state, loop: !state.loop }
            break
        case TOGGLE_QUEUE_SHOW:
            newState = { ...state, queueShown: !state.queueShown }
            break
        default:
    }
    return newState
}


