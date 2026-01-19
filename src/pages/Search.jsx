import { useSelector } from "react-redux"

export function Search() {
    const { searchResults } = useSelector(storeState => storeState.searchModule)

    return (
        <section className="search-index container">
            <h1 className="header">Songs</h1>
            <ul>
                {searchResults.length > 0 && searchResults.map(res => (
                    <li key={res.id} className="result-item">
                        <img className="song-img" src={`https://e-cdns-images.dzcdn.net/images/cover/${res.md5_image}/56x56.jpg`} onClick={() => onPlaySearchedResult(res)} />
                        <div>
                            <div className="song-title">{res.title}</div>
                            <div className="song-artist">{res.artist.name}</div>

                        </div>

                    </li>
                ))}
            </ul>
        </section>
    )
}