import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'

import logoImg from '../assets/img/logo.png'

export function AppHeader() {
    const user = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()

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
                    <NavLink to="/" className="nav-icon">
                        <i className="fa-solid fa-house"></i>
                    </NavLink>
                    <div className="search-wrapper">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="What do you want to play?"
                        />
                        <i className="fa-solid fa-basket-shopping"></i>
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
