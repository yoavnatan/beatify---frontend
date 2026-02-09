// import Axios from 'axios'

// // const BASE_URL = import.meta.env.PROD
// //     ? '/api/'
// //     : 'http://localhost:3030/api/'
// console.log('Current BASE_URL is:', import.meta.env.PROD ? 'RENDER' : 'LOCAL');
// const BASE_URL = import.meta.env.PROD
//     ? 'https://beatify-backend-jyvg.onrender.com/api/' // הכתובת המלאה של Render
//     : 'http://localhost:3030/api/'

// const axios = Axios.create({ withCredentials: true })

// export const httpService = {
//     get(endpoint, data) {
//         return ajax(endpoint, 'GET', data)
//     },
//     post(endpoint, data) {
//         return ajax(endpoint, 'POST', data)
//     },
//     put(endpoint, data) {
//         return ajax(endpoint, 'PUT', data)
//     },
//     delete(endpoint, data) {
//         return ajax(endpoint, 'DELETE', data)
//     }
// }

// async function ajax(endpoint, method = 'GET', data = null) {
//     const url = `${BASE_URL}${endpoint}`
//     const params = method === 'GET' ? data : null

//     const options = { url, method, data, params }

//     try {
//         const res = await axios(options)
//         return res.data
//     } catch (err) {
//         console.log(`HTTP ERROR: ${method} ${url}`, data)
//         console.dir(err)
//         throw err
//     }
// }


import Axios from 'axios'

const BASE_URL = import.meta.env.PROD
    ? 'https://beatify-backend-jyvg.onrender.com/api/'
    : 'http://localhost:3030/api/'

const axios = Axios.create({ withCredentials: true })

export const httpService = {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint, data) {
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data)
    }
}

async function ajax(endpoint, method = 'GET', data = null) {
    // מנקה לוכסן מיותר אם ה-endpoint מתחיל ב- /
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
    const url = `${BASE_URL}${cleanEndpoint}`

    console.log(`🚀 Requesting: ${url}`)

    try {
        const res = await axios({
            url,
            method,
            data,
            params: (method === 'GET') ? data : null
        })
        return res.data
    } catch (err) {
        console.error(`❌ API Error context: ${url}`)
        throw err
    }
}