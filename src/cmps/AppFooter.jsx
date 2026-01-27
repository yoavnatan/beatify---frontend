import { useSelector } from 'react-redux'
import { Player } from './Player.jsx'
import Home from "../assets/svg/home.svg?react"
import HomeActive from "../assets/svg/home-active.svg?react"
import Broswe from "../assets/svg/browse.svg?react"
import BrosweActive from "../assets/svg/browser-active.svg?react"
import LibraryBooksShelves from "../assets/svg/library-books-shelves.svg?react"

import Queue from "../assets/svg/queue.svg?react"
import { NavLink, useLocation } from 'react-router-dom'

export function AppFooter() {
	const count = useSelector(storeState => storeState.userModule.count)
	const location = useLocation()

	return (
		<footer className="app-footer full">
			<Player />
			<div className="mobile-nav-bar">
				<NavLink to="/queueMobile" className="nav-icon icon-queue">
					{(location.pathname === '/queueMobile') && <Queue className="icon medium white" />}
					{(location.pathname !== '/queueMobile') && <Queue className="icon medium" />}
				</NavLink>
				<NavLink to="/libraryMobile" className="nav-icon icon-library">
					{(location.pathname === '/libraryMobile') && <LibraryBooksShelves className="icon medium white" />}
					{(location.pathname !== '/libraryMobile') && <LibraryBooksShelves className="icon medium" />}
				</NavLink>
				<NavLink to="/browse" className="nav-icon icon-broswe">
					{(location.pathname !== '/browseMobile') && <Broswe className="icon medium" />}
					{(location.pathname === '/browseMobile') && <BrosweActive className="icon medium active" />}
				</NavLink>
				<NavLink to="/" className="nav-icon icon-home">
					{(location.pathname === '/') && <HomeActive className="icon medium active" />}
					{(location.pathname !== '/') && <Home className="icon medium" />}
				</NavLink>

			</div>
		</footer>
	)
}