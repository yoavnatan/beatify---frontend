import { useSelector } from 'react-redux'
import { Player } from './Player.jsx'

export function AppFooter() {
	const count = useSelector(storeState => storeState.userModule.count)

	return (
		<footer className="app-footer full">
			<Player />
		</footer>
	)
}