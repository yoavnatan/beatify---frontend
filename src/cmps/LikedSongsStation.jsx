export function LikedSongsStation({likedSongs}){
    return(
        <li className="liked-songs">
        <img src="https://misc.scdn.co/liked-songs/liked-songs-300.png" />
        <div className="station-info">
            <div className="station-name">Liked Songs</div>
            <div className="station-created-by">
                {likedSongs.length} liked songs
            </div>
        </div>
    </li>
    )
}