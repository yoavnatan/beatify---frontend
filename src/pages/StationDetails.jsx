import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadLikedSongsStation, loadStation, loadStations, removeSong, removeStation, updateStation } from '../store/actions/station.actions.js'
import Play from "../assets/svg/play.svg?react"
import Pause from "../assets/svg/pause.svg?react"
import Shuffle from "../assets/svg/shuffle.svg?react"
import Duration from "../assets/svg/duration.svg?react"
import { PLAY, TOGGLE_PLAY } from '../store/reducers/player.reducer.js'
import { setSong } from '../store/actions/player.actions.js'
import { SET_NOW_PLAYING_STATION } from '../store/reducers/station.reducer.js'
import Tippy from "@tippyjs/react"
import WhiteArrow from "../assets/svg/white-arrow.svg?react"
import Trash from "../assets/svg/trash.svg?react"
import Search from "../assets/svg/search.svg?react"
import { useNavigate } from 'react-router'





import { debounce } from '../services/util.service.js'
import { searchMusicService } from '../services/searchMusic.service.js'
import { stationService } from '../services/station/station.service.js'

export function StationDetails() {
  const navigate = useNavigate()
  const { stationId } = useParams()
  const station = useSelector(storeState => storeState.stationModule.station)
  const { playing, nowPlaying } = useSelector(storeState => storeState.playerModule)
  const { nowPlaying: nowPlayingStationId } = useSelector(storeState => storeState.stationModule)
  const dispatch = useDispatch()
  const lastClickedSong = useRef()
  let isStationPlaying = (stationId === nowPlayingStationId)
  const { user } = useSelector(storeState => storeState.userModule)

  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const debouncedOnSearch = useRef(debounce(onSearchMusic, 300)).current

  useEffect(() => {
      if (!stationId) return

      if (stationId === 'likedSongs') {
          loadLikedSongsStation()
      } else {
          loadStation(stationId)
      }
  }, [stationId])


  useEffect(() => {
    if (search) debouncedOnSearch(search)
  }, [search])

  function handleChange({ target }) {
    setSearch(target.value)
  }

  async function onSearchMusic(search) {
    const searchResults = await searchMusicService.searchMusic(search)
    console.log(searchResults)
    setSearchResults(searchResults)
  }

  function onSearch(ev) {
    ev.preventDefault()
    onSearchMusic(search)
  }

  if (!station) return <div>Loading...</div>

  const stationImg = station._id === 'likedSongs'
    ? "https://misc.scdn.co/liked-songs/liked-songs-300.png"
    : station.songs[0]?.imgUrl



  async function deleteStation(ev, stationId) {
    ev.stopPropagation()
    await removeStation(stationId)   
    navigate("/")
  }


  async function deleteSong(ev,songId,stationId) {
    ev.stopPropagation()
    await removeSong(songId,stationId)   
  }



  return (
    <section className="station-details container">

      <header className="station-header" style={{ "--avg-color": station.averageColor }} >
        <div className="image-wrapper">
          <img className="station-cover" src={stationImg} alt={station.name} />
        </div>

        <div className="station-meta">
          <span className="playlist-label">Playlist</span>

          <h1 className="station-title">{station.name}</h1>

          <div className="station-subinfo">
            <span className="creator">
              Created by {station.createdBy.fullname}
            </span>
            <span className="dot">•</span>
            <span className="song-count">
              {station.songs.length} songs
            </span>
          </div>
        </div>
      </header>


      <div className="station-actions">

        <div className='station-actions-wrapper'>
              <Tippy
              content={`Play ${station.name}`}
              delay={[1200, 0]}
              offset={[0, -100]}
              arrow={false}
              placement="bottom"
            >
              <button
                className="play-btn"
                onClick={() => {
                  lastClickedSong.current = nowPlaying

                  if (isStationPlaying) {
                    dispatch({ type: TOGGLE_PLAY })
                  } else {
                    setSong(station.songs[0])
                    dispatch({ type: PLAY })
                  }

                  dispatch({ type: SET_NOW_PLAYING_STATION, nowPlaying: station._id })
                }}
              >
                {(!isStationPlaying || !playing) && <Play className="icon-large-black" />}
                {isStationPlaying && playing && <Pause className="icon-large-black" />}
              </button>

            </Tippy>

            <button className="shuffle-btn">
              <Shuffle className="icon large" />
            </button>


        </div>
        
        
        <span className='big-icon-trash' onClick={(ev) => deleteStation(ev, station._id)}>
            <Trash />
        </span>


      </div>


      <div className="table-header">
        <div className="col-index">#</div>
        <div className="col title">Title</div>
        <div className="col album">Album</div>
        <div className="col date">Date Added</div>
        <div className="col duration">
          <Duration className="duration-icon" />
        </div>
      </div>

      <ul className="song-list">
        {station.songs.map((song, idx) => (
          <li
            key={`${station._id}-${song.id}-${idx}`}
            className="song-row"
            onClick={() => {
              const prev = lastClickedSong.current
              lastClickedSong.current = nowPlaying

              setSong(song)

              if (prev?.id === song.id) {
                dispatch({ type: TOGGLE_PLAY })
              } else {
                dispatch({ type: PLAY })
                dispatch({ type: SET_NOW_PLAYING_STATION, nowPlaying: station._id })
              }
            }}
          >
            <div className='song-row-inner'>
              <div className="song-index-wrapper">
                <span className="song-index">{idx + 1}</span>
                <Tippy
                  content={`Play ${song.title}`}
                  delay={[800, 0]}
                  offset={[0, -60]}
                  arrow={false}
                  placement="bottom"
                >
                  <span className="icon-white-arrow-details"><WhiteArrow /></span>
                </Tippy>
              </div>

              <div className="song-title-wrapper">
                <img className="song-img" src={song.imgUrl} alt={song.title} />
                <div className="song-info">
                  <div className="song-title">{song.title}</div>
                  <div className="song-artist">Artist Name</div>
                </div>
              </div>

              <div className="song-album">Album Name</div>
              <div className="song-date">2 days ago</div>
              <div className='song-duration-wrapper'>
                <div className="song-duration">3:45</div>
                <span className='icon-trash' onClick={(ev) => deleteSong(ev, song.id, station._id)}>
                    <Trash />
                </span>
              </div>

            </div>
          </li>
        ))}
      </ul>
      <hr />
      <div className='search container'>
        <h1>Let's find something for your playlist</h1>
        <form onSubmit={onSearch}>
          <div className="wrapper">
            <Tippy content={'Search'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
              <span className="tooltip-wrapper">
                <Search className="icon" />
              </span>
            </Tippy>
            <input className='search-input open'
              value={search}
              onChange={handleChange}
              type="text"
              placeholder='Search for songs'
            />
          </div>
        </form>
        <ul className='search-results'>
          {search && searchResults.length > 0 && searchResults.map(res => (
            <li key={res.id} className="result-item">
              <img className="song-img" src={`https://e-cdns-images.dzcdn.net/images/cover/${res.md5_image}/56x56.jpg`} />
              <div>
                <div className="song-title">{res.title}</div>
                <div className="song-artist">{res.artist.name}</div>
              </div>

            </li>
          ))}
        </ul>
      </div >
    </section >


  )
}
