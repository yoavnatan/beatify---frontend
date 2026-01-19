import { Link, NavLink } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'

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
import { PLAY, SET_LAST_CLICKED, TOGGLE_PLAY } from '../store/reducers/player.reducer.js'
import { setSong } from '../store/actions/player.actions.js'
import { SET_NOW_PLAYING_STATION } from '../store/reducers/station.reducer.js'
import { SET_RESULTS } from '../store/reducers/search.reducer.js'

export function AppHeader() {
    const user = useSelector(storeState => storeState.userModule.user)
    const [search, setSearch] = useState('')
    // const [searchResults, setSearchResults] = useState([])
    const { searchResults } = useSelector(storeState => storeState.searchModule)

    const [isResultsOpen, setIsResultsOpen] = useState(false)
    const { lastClickedSong } = useSelector(storeState => storeState.playerModule)

    const debouncedOnSearch = useRef(debounce(onSearchMusic, 300)).current
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const resRef = useRef()

    useEffect(() => {
        // console.log(search)
        if (search) debouncedOnSearch(search)
    }, [search])


    async function onSearchMusic(search) {
        const searchResults = await searchMusicService.searchMusic(search)
        dispatch({ type: SET_RESULTS, searchResults: searchResults })
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
        dispatch({ type: SET_LAST_CLICKED, lastClickedSong: song })
        setSong(song)
        dispatch({ type: PLAY })
        // dispatch({ type: SET_NOW_PLAYING_STATION, nowPlaying: station._id })
        setIsResultsOpen(false)
    }

    function handleFocus() {
        setIsResultsOpen(true)
        document.addEventListener('mousedown', handleClickOutside);

    }

    function handleBlear() {
        document.removeEventListener('mousdown', handleClickOutside)

    }

    function handleClickOutside(ev) {
        if (resRef.current && !resRef.current.contains(ev.target)) {
            setIsResultsOpen(false)
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }

    function onSubmitSearch(ev) {
        ev.preventDefault()
        setIsResultsOpen(false)
        // dispatch({ type: SET_RESULTS, searchResults: searchResults })
        navigate('/search')
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
                        <form onSubmit={onSubmitSearch} className="main-search-input"
                        >
                            <input value={search}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlear}
                                type="text"
                                placeholder="What do you want to play?"

                            />
                        </form>
                        <div className="broswe-wrapper">
                            <Broswe className="icon medium" />
                        </div>
                        <div ref={resRef} className={`search-result container ${isResultsOpen ? "open" : ''}`}>
                            {searchResults.length <= 0 && <h3 style={{ marginBlockStart: '1em' }}>Recent Search</h3>}
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

                        </div>
                    )}
                </div>

            </nav>
        </header>
    )
}
