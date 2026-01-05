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
			<nav>
				<NavLink to="/" className="logo">
					<img src={logoImg} />
				</NavLink>
				<NavLink to="/"><i className="fa-solid fa-house"></i></NavLink>
				<div className="search-wrapper">
				<i className="fa-solid fa-magnifying-glass"></i>
				<input
					type="text"
					className="search-input"
					placeholder="What do you want to play?"
				/>
				<i className="fa-solid fa-basket-shopping"></i>
				</div>
				<NavLink to="about">About</NavLink>
				{/* <NavLink to="station">Stations</NavLink> */}
				<NavLink to="chat">Chat</NavLink>

				{user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

				{!user && <NavLink to="auth/login" className="login-link">Login</NavLink>}
				{user && (
					<div className="user-info">
						<Link to={`user/${user._id}`}>
							{user.imgUrl && <img src={user.imgUrl} />}
							{user.fullname}
						</Link>
						<span className="score">{user.score?.toLocaleString()}</span>
						<button onClick={onLogout}>logout</button>
					</div>
				)}
			</nav>
		</header>
	)
}
