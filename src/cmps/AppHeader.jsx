import { Link, NavLink } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
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
import { userService } from '../services/user/user.service'

export function AppHeader() {
    const user = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()
    const location = useLocation();
    console.log(user)


    async function onLogout() {
        try {
            await logout()
            navigate('/')
            showSuccessMsg(`Bye now`)
        } catch (err) {
            showErrorMsg('Cannot logout')
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
                        <input
                            type="text"
                            className="search-input"
                            placeholder="What do you want to play?"
                        />
                        <div className="broswe-wrapper">
                            <Broswe className="icon medium" />
                        </div>
                        <DropDownSearchMenu />
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
                                {user.imgUrl && <img src={user.imgUrl} alt="User" />}
                                <span>{user.fullname}</span>
                            </Link>

                            <span className="score">
                                {user.score?.toLocaleString()}
                            </span>

                            <button onClick={onLogout} className="logout-btn">
                                Logout
                            </button>
                        </div>
                    )}
                </div>

            </nav>
        </header>
    )
}

function DropDownSearchMenu() {
    return (
        <div className="search-result container">
            <h3>Recent Search</h3>
            <ul>
                <li>Search result</li>
                <li>Search result</li>
                <li>Search result</li>
                <li>Search result</li>
                <li>Search result</li>
                <li>Search result</li>
            </ul>
        </div>
    )

}