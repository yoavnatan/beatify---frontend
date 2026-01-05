import { Library} from "../cmps/Library"
import { StationIndex } from "./StationIndex"



export function HomePage() {
    return (
        <div className="home">
            <Library />   
            <StationIndex />
        </div>
    )
}

