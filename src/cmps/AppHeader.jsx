import { Link, NavLink } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import WhiteArrow from "../assets/svg/white-arrow.svg?react"
import Pause from "../assets/svg/pause.svg?react";
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import Broswe from "../assets/svg/browse.svg?react"
import BrosweActive from "../assets/svg/browser-active.svg?react"
import Home from "../assets/svg/home.svg?react"
import Logo from "../assets/svg/home.svg?react"
import HomeActive from "../assets/svg/home-active.svg?react"
import Search from "../assets/svg/search.svg?react"
import logoImg from '../assets/img/logo.svg'
import profileImg from '../assets/img/profile-pic.jpg'
import { userService } from '../services/user/user.service.js'
import { searchMusicService } from '../services/searchMusic.service.js'
import { debounce, saveToStorage } from '../services/util.service.js'
import { PLAY, SET_LAST_CLICKED, TOGGLE_PLAY } from '../store/reducers/player.reducer.js'
import { setSong } from '../store/actions/player.actions.js'
import { SET_NOW_PLAYING_STATION } from '../store/reducers/station.reducer.js'
import { CLEAR_RECENT_SEARCH, SET_ARTIST_RESULTS, SET_RESULTS, UPDATE_RECENT_SEARCH } from '../store/reducers/search.reducer.js'
import { ADD_TO_QUEUE } from "../store/reducers/player.reducer.js"
import AddToQueue from "../assets/svg/queue-add.svg?react"
import Tippy from '@tippyjs/react';
import Exit from "../assets/svg/exit.svg?react"
import UsersGroup from "../assets/svg/users-group.svg?react"




export function AppHeader() {
    const user = useSelector(storeState => storeState.userModule.user)
    const [search, setSearch] = useState('')
    // const [searchResults, setSearchResults] = useState([])
    const { searchResults, recentSearch } = useSelector(storeState => storeState.searchModule)

    const [isResultsOpen, setIsResultsOpen] = useState(false)
    const { playing, nowPlaying, lastClickedSong } = useSelector(storeState => storeState.playerModule)

    const debouncedOnSearch = useRef(debounce(onSearchMusic, 300)).current
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const resRef = useRef()
    const menuRef = useRef()

    useEffect(() => {
        // console.log(search)
        if (search) debouncedOnSearch(search)
    }, [search])


    useEffect(() => {
        function handleClickOutside(ev) {
            if (menuRef.current && !menuRef.current.contains(ev.target)) {
                setIsMenuOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])



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
            showSuccessMsg(`Bye for now`)
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

    async function onSearchRecent(recent) {
        const artistResults = await searchMusicService.searchArtist(recent)
        dispatch({ type: SET_ARTIST_RESULTS, artistResults: artistResults })
        setIsResultsOpen(false)
        navigate('/search')
    }

    function onClearRecentSearches() {
        localStorage.removeItem('recent-search')
        dispatch({ type: CLEAR_RECENT_SEARCH })
    }

    function onAddToQueue(ev, song) {
        ev.stopPropagation()
        dispatch({ type: ADD_TO_QUEUE, song: song })
    }

    async function onSubmitSearch(ev) {
        ev.preventDefault()
        if (!search) return
        const artistResults = await searchMusicService.searchArtist(search)
        {
            saveToStorage('recent-search', [search, ...recentSearch])
            dispatch({ type: UPDATE_RECENT_SEARCH, search: search })
        }
        dispatch({ type: SET_ARTIST_RESULTS, artistResults: artistResults })
        setIsResultsOpen(false)
        // dispatch({ type: SET_RESULTS, searchResults: searchResults })
        navigate('/search')
    }
    function onLogOut() {
        onLogout()
    }
    const randomUserImg = `https://robohash.org/${user?._id}?&set=set2`

    return (
        <header className="app-header full">
            <nav className="header-nav">

                <div className="nav-left">
                    <NavLink to="/" className="logo">
                        <img src={logoImg} alt="Logo" />
                        {/* <Logo classna/> */}
                    </NavLink>

                    {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}
                </div>

                <div className="nav-center">
                    <NavLink to="/" className="nav-icon icon-home">
                        {(location.pathname === '/') && <HomeActive className="icon medium active" />}
                        {(location.pathname !== '/') && <Home className="icon medium" />}
                    </NavLink>
                    <div className="search-wrapper">
                        <Tippy content={'Search'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                            <span className="tooltip-wrapper">
                                <Search className="icon medium icon-search" onClick={onSubmitSearch} />
                            </span>
                        </Tippy>
                        {search && <Tippy content={'Clear'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                            <span className="tooltip-wrapper">
                                <Exit className="icon small icon-clear" onClick={(ev) => {
                                    ev.stopPropagation()
                                    setSearch('')
                                }
                                } />
                            </span>
                        </Tippy>}

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
                        <NavLink to="/browse" className="broswe-wrapper">
                            {(location.pathname !== '/browse') && <Broswe className="icon medium" />}
                            {(location.pathname === '/browse') && <BrosweActive className="icon medium active" />}
                        </NavLink>
                        <div ref={resRef} className={`search-result container ${isResultsOpen ? "open" : ''}`}>
                            {!search && <div>
                                <h3 style={{ marginBlockStart: '1em' }}>Recent Searches</h3>
                                <ul>
                                    {recentSearch.length > 0 && recentSearch.slice(0, 3).map((res, idx) => <li className="result-item"
                                        key={idx}
                                        onClick={() => {
                                            setSearch(res)
                                            onSearchRecent(res)
                                        }}>
                                        <Search className="icon medium" />
                                        {res}
                                    </li>)}
                                </ul>
                                {recentSearch.length <= 0 && 'No recent searches yet...'}
                                {recentSearch.length > 0 && <button className="btn-clear-recents" onClick={() => onClearRecentSearches()}>Clear recent searchs</button>}
                            </div>
                            }
                            <ul>
                                {search && searchResults.length > 0 && searchResults.map(res => (
                                    <li key={res.id} className="result-item">

                                        <div className="img-overlay" onClick={() => onPlaySearchedResult(res)}>
                                            {(!playing || nowPlaying.id === res.id) &&
                                                <Tippy content={'Play'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                                                    <span className="tooltip-wrapper">
                                                        <WhiteArrow className="icon medium white" />
                                                    </span>
                                                </Tippy>
                                            }
                                            {playing && nowPlaying.id === res.id &&
                                                <Tippy content={'Pause'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                                                    <span className="tooltip-wrapper">
                                                        <Pause className="icon medium white" />
                                                    </span>
                                                </Tippy>
                                            }
                                            <img className="song-img" src={res.album.cover_big} onClick={() => onPlaySearchedResult(res)} />
                                        </div>
                                        <div>
                                            <div className="song-title" onClick={() => onPlaySearchedResult(res)}>{res.title}</div>
                                            <div className="song-artist" onClick={() => onPlaySearchedResult(res)}>{res.artist.name}</div>
                                        </div>
                                        <Tippy content={'Add to queue'} delay={[500, 0]} offset={[0, 0]} arrow={false} >
                                            <span className="tooltip-wrapper">
                                                <AddToQueue className="icon small" onClick={(ev) => onAddToQueue(ev, res)} style={{ marginInlineStart: 'auto', marginInlineEnd: '1em' }} />
                                            </span>
                                        </Tippy>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="nav-right" ref={menuRef}>

                    {!user && (
                        <NavLink to="auth" className="login-link">
                            Login
                        </NavLink>
                    )}
                    {user && (
                        <div className="user-menu-wrapper">
                        <Tippy content="Friend Activity" delay={[300, 0]} offset={[0, 5]} arrow={false} >
                            <UsersGroup className="icon small users-group"/>
                        </Tippy>

                            <Tippy content={user.fullname} delay={[300, 0]} offset={[0, 5]} arrow={false} >
                                <img
                                    className="profile-pic"
                                    src={randomUserImg}
                                    alt="User"
                                    onClick={() => setIsMenuOpen(prev => !prev)}
                                />
                            </Tippy>
                            {isMenuOpen && (
                                <div className="user-dropdown">
                                    <button className="dropdown-item" onClick={onLogOut}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>


            </nav>
        </header>
    )
}
