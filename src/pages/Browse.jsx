import { useEffect, useState } from "react"
import { searchMusicService } from "../services/searchMusic.service.js"
import { stationService } from "../services/station"
import { addStation } from "../store/actions/station.actions.js"
import { useNavigate } from "react-router"

export function Browse() {
    const [genres, setGenres] = useState([])
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const browseColors = [
        '#1b5e20', '#27856a', '#1e3264', '#8d67ab', '#e8115b',
        '#8c1932', '#7358ff', '#148a08', '#ba5d07', '#e91429',
        '#e1118c', '#d84000', '#503750', '#1db954', '#0d3b66'
    ]

    useEffect(() => {
        loadGenres()
    }, [])

    async function loadGenres() {
        try {
            setIsLoading(true)
            const genresToLoad = await searchMusicService.getGenres()
            setGenres(genresToLoad)
        } catch (err) {
            console.error('Failed to load genres', err)
        } finally {
            setIsLoading(false)
        }
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
                {isLoading ? (
                    // סקלטונים צבעוניים
                    [...Array(15)].map((_, idx) => (
                        <div
                            key={idx}
                            className="genre-card-skeleton"
                            style={{ '--skeleton-bg': browseColors[idx % browseColors.length] }}
                        ></div>
                    ))
                ) : (
                    // כרטיסים אמיתיים
                    genres.slice(1).map((genre, idx) => (
                        <article key={genre.id}
                            onClick={(ev) => createGenreStation(ev, genre)}
                            className="genre-card"
                            style={{ backgroundColor: browseColors[idx % browseColors.length] }}>
                            <span>{genre.name}</span>
                            <img src={genre.picture_big} />
                        </article>
                    ))
                )}
            </div>
        </section>
    )

}
