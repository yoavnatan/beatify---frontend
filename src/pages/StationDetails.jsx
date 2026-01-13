import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadStation } from '../store/actions/station.actions.js'
import Play from "../assets/svg/play.svg?react"
import Shuffle from "../assets/svg/shuffle.svg?react"
import Duration from "../assets/svg/duration.svg?react"

export function StationDetails() {

  const { stationId } = useParams()
  const station = useSelector(storeState => storeState.stationModule.station)
  

  useEffect(() => {
    loadStation(stationId)
  }, [stationId])

  if (!station) return <div>Loading...</div>

  const stationImg = station._id === 'likedSongs'
    ? "https://misc.scdn.co/liked-songs/liked-songs-300.png"
    : station.songs[0]?.imgUrl

  return (
    <section className="station-details">

      <header className="station-header" style={{ '--avg-color': station.averageColor }}>
        <img className="station-cover" src={stationImg} alt={station.name} />

        <div className="station-meta">
          <span className="playlist-label">Playlist</span>
          <h1 className="station-title">{station.name}</h1>

          <div className="station-subinfo">
            <span className="creator">This playlist was created by : {station.createdBy.fullname}</span>
            <span className="dot">•</span>
            <span className="song-count">{station.songs.length} songs</span>
          </div>
        </div>
      </header>

      <div className="station-actions">
        <button className="play-btn">
          <Play className="icon large black" />
        </button>
        <button className="shuffle-btn">
          <Shuffle className="icon large"/>
        </button>
      </div>
            
      <div className="table-header">
        <div className="col index">#</div>
        <div className="col title">Title</div>
        <div className="col album">Album</div>
        <div className="col date">Date Added</div>
        <div className="col duration">
          <Duration className="duration-icon" />
        </div>
      </div>
      <ul className="song-list">
        {station.songs.map((song, idx) => (
          <li key={song.id} className="song-row">
            <div className="song-index">{idx + 1}</div>

            <div className="song-title-wrapper">
              <img className="song-img" src={song.imgUrl} alt={song.title} />
              <div className="song-info">
                <div className="song-title">{song.title}</div>
                <div className="song-artist">Artist Name</div>
              </div>
            </div>

            <div className="song-album">Album Name</div>

            <div className="song-date">2 days ago</div>

            <div className="song-duration">3:45</div>
          </li>
        ))}
      </ul>

    </section>
  )
}
