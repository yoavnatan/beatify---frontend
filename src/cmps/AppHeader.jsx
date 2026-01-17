import { Link, NavLink } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import Broswe from "../assets/svg/browse.svg?react"
import Home from "../assets/svg/home.svg?react"
import HomeActive from "../assets/svg/home-active.svg?react"
import Search from "../assets/svg/search.svg?react"
import logoImg from '../assets/img/logo_symbol.png'
import profileImg from '../assets/img/profile-pic.jpg'
import { userService } from '../services/user/user.service.js'
import { searchMusicService } from '../services/searchMusic.service.js'
import { debounce } from '../services/util.service.js'

export function AppHeader() {
    const user = useSelector(storeState => storeState.userModule.user)
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])

    const debouncedOnSearch = useRef(debounce(onSearchMusic, 300)).current
    const navigate = useNavigate()
    const location = useLocation();

    useEffect(() => {
        // console.log(search)
        if (search) debouncedOnSearch(search)
    }, [search])

    async function onSearchMusic(search) {
        const searchResults = await searchMusicService.searchMusic(search)
        setSearchResults(searchResults)
    }

    function handleChange({ target }) {
        setSearch(target.value)
    }

    async function onLogout() {
        try {
            await logout()
            navigate('/')
            showSuccessMsg(`Bye now`)
        } catch (err) {
            showErrorMsg('Cannot logout')
        }
    }

    async function onPlaySearchedResult(search) {
        const song = await searchMusicService.getYoutubeURL(search)
        console.log(song)
        const prev = lastClickedSong.current
        lastClickedSong.current = song

        if (prev?.id === song.id) {
            dispatch({ type: TOGGLE_PLAY })
        } else {
            setSong(song)
            dispatch({ type: PLAY })
            dispatch({ type: SET_NOW_PLAYING_STATION, nowPlaying: station._id })
        }
    }

    return (
        <header className="app-header full">
            <nav className="header-nav">

                <div className="nav-left">
                    <NavLink to="/" className="logo">
                        <img src={logoImg} alt="Logo" />
                    </NavLink>

                    {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}
                </div>

                <div className="nav-center">
                    <NavLink to="/" className="nav-icon icon-home">
                        {(location.pathname === '/') && <HomeActive className="icon medium active" />}
                        {(location.pathname !== '/') && <Home className="icon medium" />}
                    </NavLink>
                    <div className="search-wrapper">
                        <Search className="icon medium icon-search" />
                        <input value={search} onChange={handleChange}
                            type="text"
                            className="main-search-input"
                            placeholder="What do you want to play?"
                        />
                        <div className="broswe-wrapper">
                            <Broswe className="icon medium" />
                        </div>
                        <div className="search-result container">
                            {!searchResults && <h3>Recent Search</h3>}
                            <ul>
                                {search && searchResults.length > 0 && searchResults.map(res => (
                                    <li key={res.id} className="result-item">
                                        <img className="song-img" src={`https://e-cdns-images.dzcdn.net/images/cover/${res.md5_image}/56x56.jpg`} onClick={() => onPlaySearchedResult(res)} />
                                        <div>
                                            <div className="song-title">{res.title}</div>
                                            <div className="song-artist">{res.artist.name}</div>
                                        </div>

                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="nav-right">
                    {!user && (
                        <NavLink to="auth/login" className="login-link">
                            Login
                        </NavLink>
                    )}

                    {user && (
                        <div className="user-info">
                            <Link to={`user/${user._id}`} className="user-link">
                                {user.imgUrl && <img className='profile-pic' src={profileImg} alt="User" />}
                            </Link>
                            {/* 
                            <span className="score">
                                {user.score?.toLocaleString()}
                            </span>

                            <button onClick={onLogout} className="logout-btn">
                                Logout
                            </button> */}
                        </div>
                    )}
                </div>

            </nav>
        </header>
    )
}
