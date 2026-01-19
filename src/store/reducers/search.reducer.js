export const SET_RESULTS = 'SET_RESULTS'

const initialState = {
    searchResults: [],
    recentSearch: [],
}

export function searchReducer(state = initialState, action) {
    var newState = state
    switch (action.type) {
        case SET_RESULTS:
            newState = { ...state, searchResults: action.searchResults }
            break
        default:
    }
    return newState
}