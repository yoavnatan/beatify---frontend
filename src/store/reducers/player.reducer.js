export const SET_IS_PLAYING = 'SET_IS_PLAYING'
export const SET_SRC = 'SET_SRC'

const initialState = {
    playing: false,
    src: null,
    nowPlaying: null,
    muted: false,
    queue: [],
}

export function playerReducer(state = initialState, action) {
    var newState = state
    switch (action.type) {
        case SET_IS_PLAYING:
            newState = { ...state, playing: !state.playing }
            break
        case SET_SRC:
            newState = { ...state, src: action.src }
        default:
    }
    return newState
}


