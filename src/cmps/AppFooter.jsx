import { useSelector } from 'react-redux'
import { Player } from './Player.jsx'

export function AppFooter() {
	const count = useSelector(storeState => storeState.userModule.count)

	return (
		<footer className="app-footer full">
			<div>Now playing</div>
			<Player />
			{import.meta.env.VITE_LOCAL ?
				<span className="local-services">Local Services</span> :
				<span className="remote-services">Remote Services</span>}
		</footer>
	)
}