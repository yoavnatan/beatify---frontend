import { loadFromStorage } from "../../services/util.service.js"

export const SET_RESULTS = 'SET_RESULTS'
export const SET_ARTIST_RESULTS = 'SET_ARTIST_RESULTS'
export const UPDATE_RECENT_SEARCH = 'UPDATE_RECENT_SEARCH'
export const CLEAR_RECENT_SEARCH = 'CLEAR_RECENT_SEARCH'

const initialState = {
    searchResults: [],
    artistResults: [],
    recentSearch: loadFromStorage('recent-search') || [],
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
        case UPDATE_RECENT_SEARCH:
            newState = { ...state, recentSearch: [action.search, ...state.recentSearch] }
            break
        case CLEAR_RECENT_SEARCH:
            newState = { ...state, recentSearch: [] }
            break
        default:
    }
    return newState
}