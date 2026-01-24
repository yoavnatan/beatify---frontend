import { useEffect, useState } from "react"
import { searchMusicService } from "../services/searchMusic.service.js"
import { stationService } from "../services/station"
import { addStation } from "../store/actions/station.actions.js"
import { useNavigate } from "react-router"

export function Browse() {
    const [genres, setGenres] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        loadGenres()
    }, [])

    async function loadGenres() {
        console.log('hi')
        const genresToLoad = await searchMusicService.getGenres()
        setGenres(genresToLoad)
    }

    async function createGenreStation(ev, genre) {
        console.log(genre)
        ev.stopPropagation()
        const genreStation = await stationService.getGenreStation(genre)
        const savedStation = await addStation(genreStation)
        console.log(savedStation)
        navigate(`/station/${savedStation._id}`)
    }

    if (!genres.length) return <div>Loading...</div>

    return (
        <section className="browse container">
            <header>
                <h1>Browse all</h1>
            </header>

            <div className="main-browse">
                {genres.slice(1).map((genre, idx) => (
                    <article key={genre.id}
                        onClick={(ev) => createGenreStation(ev, genre)}
                        className="genre-card" style={{
                            backgroundColor: `var(--browse-clr-${idx})`
                        }}>
                        <span>{genre.name}</span>
                        <img src={genre.picture_big} />
                    </article>
                ))}
            </div>
        </section>
    )
}
