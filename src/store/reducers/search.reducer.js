export const SET_RESULTS = 'SET_RESULTS'
export const SET_ARTIST_RESULTS = 'SET_ARTIST_RESULTS'

const initialState = {
    searchResults: [],
    artistResults: [],
    recentSearch: [],
}

export function searchReducer(state = initialState, action) {
    var newState = state
    switch (action.type) {
        case SET_RESULTS:
            newState = { ...state, searchResults: action.searchResults }
            break
        case SET_ARTIST_RESULTS:
            newState = { ...state, artistResults: action.artistResults }
            break
        default:
    }
    return newState
}