import { httpService } from '../http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    getLoggedinUser,
    saveLoggedinUser,
    getEmptyCredentials
}

function getUsers() {
    return httpService.get('user')
}

async function getById(userId) {
    return httpService.get(`user/${userId}`)
}

function remove(userId) {
    return httpService.delete(`user/${userId}`)
}

async function update(user) {
    const updatedUser = await httpService.put(`user/${user._id}`, user)

    const loggedinUser = getLoggedinUser()
    if (loggedinUser && loggedinUser._id === updatedUser._id) {
        saveLoggedinUser(updatedUser)
    }

    return updatedUser
}

async function login(userCred) {
    try {
        const user = await httpService.post('auth/login', userCred)
        return saveLoggedinUser(user)
    } catch (err) {
        throw new Error('Invalid credentials')
    }
}


async function signup(userCred) {
    if (!userCred.imgUrl) {
        userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    }

    const user = await httpService.post('auth/signup', userCred)
    return saveLoggedinUser(user)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    return httpService.post('auth/logout')
}

function getLoggedinUser() {
    const user = sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)
    return user ? JSON.parse(user) : null
}

function saveLoggedinUser(user) {
    const userToSave = {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        imgUrl: user.imgUrl,
        isAdmin: user.isAdmin
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}
function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: ''
    }
}
