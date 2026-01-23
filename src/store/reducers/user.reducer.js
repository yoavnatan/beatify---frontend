import { userService } from '../../services/user'

export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'
export const CHANGE_COUNT = 'CHANGE_COUNT'
export const SET_USER = 'SET_USER'
export const SET_WATCHED_USER = 'SET_WATCHED_USER'
export const REMOVE_USER = 'REMOVE_USER'
export const SET_USERS = 'SET_USERS'
export const SET_SCORE = 'SET_SCORE'
export const USER_UNDO = 'USER_UNDO'

const initialState = {
    user: userService.getLoggedinUser(),
    users: [],
    // likedSongs,
}

export function userReducer(state = initialState, action) {
    switch (action.type) {

        case SET_USER:
            return {
                ...state,
                user: action.user,
                lastUser: state.user
            }

        case SET_WATCHED_USER:
            return {
                ...state,
                watchedUser: action.user
            }

        case REMOVE_USER:
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.userId)
            }

        case USER_UNDO:
            return {
                ...state,
                user: state.lastUser
            }

        case SET_SCORE:
            const updatedUser = { ...state.user, score: action.score }
            userService.saveLoggedinUser(updatedUser)
            return {
                ...state,
                user: updatedUser
            }

        default:
            return state
    }
}

