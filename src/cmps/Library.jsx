export function Library() {
    return (
        <div className="library">
            <div className="library-header">
                <h1>Your Library</h1>
                <div className="header-actions">
                    <i className="fa-solid fa-plus"></i>
                    <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
                </div>
            </div>

            <div className="library-filter">
                <button>Playlists</button>
                <button>Artists</button>
            </div>

            <div className="search-bar">
                <div className="search-input-wrapper">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search in Your Library" />
                </div>

                <div className="sort-wrapper">
                    <label>Recents</label>
                    <i className="fa-solid fa-list"></i>
                </div>
            </div>

            <section className="library-list">
                <ul>
                    <li>Liked Songs</li>
                    <li>Discover Weekly</li>
                    <li>Release Radar</li>
                    <li>Chill Hits</li>
                    <li>Top Hits 2024</li>
                    <li>Indie Mix</li>
                    <li>Workout Playlist</li>
                    <li>Jazz Classics</li>
                    <li>Rock Anthems</li>
                </ul>
            </section>
        </div>
    )
}
