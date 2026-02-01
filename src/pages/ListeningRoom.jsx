import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addSongToStation,
  loadLikedSongsStation,
  loadStation,
  loadStations,
  removeSong,
  removeStation,
  updateStation,
  addStationToLibrary,
  addStation,
} from "../store/actions/station.actions.js";
import Play from "../assets/svg/play.svg?react";
import Pause from "../assets/svg/pause.svg?react";
import Shuffle from "../assets/svg/shuffle.svg?react";
import { LOOP_OFF, LOOP_ON, PAUSE, PLAY, SET_LAST_CLICKED, SET_NOW_PLAYING, SHUFFLE_OFF, SHUFFLE_ON, TOGGLE_PLAY } from "../store/reducers/player.reducer.js";
import { setSong } from "../store/actions/player.actions.js";
import { SET_NOW_PLAYING_STATION, SET_STATION_SONGS, UPDATE_STATION } from "../store/reducers/station.reducer.js";
import Tippy from "@tippyjs/react";
import Trash from "../assets/svg/trash.svg?react";
import Delete from "../assets/svg/delete.svg?react";
import DropDownMenu from "../assets/svg/drop-down-menu.svg?react";
import { useNavigate } from "react-router";
import { debounce, toRgbString } from "../services/util.service.js";
import { searchMusicService } from "../services/searchMusic.service.js";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";
import { SongsTable } from "./SongsTable.jsx";
import { LibraryEditStation } from "./LibraryAddStation.jsx";
import { stationService } from "../services/station";
import AddCircle from "../assets/svg/add-circle.svg?react";
import { SOCKET_EMIT_PLAY, SOCKET_EMIT_TOGGLE_PLAY, SOCKET_EVENT_OFF_LOOP, SOCKET_EVENT_OFF_SHUFFLE, SOCKET_EVENT_ON_LOOP, SOCKET_EVENT_ON_SHUFFLE, SOCKET_EVENT_PLAY, SOCKET_EVENT_STATION_UPDATE, SOCKET_EVENT_TOGGLE_PLAY, socketService } from "../services/socket.service.js";
import { use } from "react";
import { LoaderDots } from "../cmps/Loader.jsx";




export function ListeningRoom() {
  const navigate = useNavigate();
  const { stations, stationSongs } = useSelector((storeState) => storeState.stationModule);
  const station = stations.find(station => station.isShared)
  const stationId = station?._id
  const { playing, nowPlaying, lastClickedSong } = useSelector(
    (storeState) => storeState.playerModule,
  );
  const { nowPlaying: nowPlayingStationId } = useSelector(
    (storeState) => storeState.stationModule,
  );
  const dispatch = useDispatch();
  // const lastClickedSong = useRef();
  let isStationPlaying = stationId === nowPlayingStationId;
  const { user } = useSelector((storeState) => storeState.userModule);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [headerOpacity, setHeaderOpacity] = useState(1);
  const debouncedOnSearch = useRef(debounce(onSearchMusic, 300)).current;
  const [showActions, setShowActions] = useState(false);
  // const [avgColor, setAvgColor] = useState()
  const headerRef = useRef();
  if (station) getAvgclr(station)

  useEffect(() => {
    if (station) getAvgclr(station)
  }, [station])

  async function getAvgclr() {
    station.color = await stationService.getAvgColor(station)
  }

  useEffect(() => {
    socketService.on(SOCKET_EVENT_ON_SHUFFLE, data => {
      if (stations.find(s => s.isShared)._id === nowPlayingStationId) {
        dispatch({ type: SET_STATION_SONGS, stationSongs: data.stationSongs })
        dispatch({ type: SHUFFLE_ON })
      }
    })

    return () => {
      socketService.off(SOCKET_EVENT_ON_SHUFFLE)
      dispatch({ type: SHUFFLE_OFF })
      dispatch({ type: LOOP_OFF })

    }
  }, [stations])

  useEffect(() => {
    if (!user) return

    socketService.emit('join-listening-room', user)
  }, [])
  useEffect(() => {
    socketService.on(SOCKET_EVENT_PLAY, playerInfo => {
      onPlayFromSocket(playerInfo.songInfo)
    })
    socketService.on(SOCKET_EVENT_TOGGLE_PLAY, playerInfo => {
      onToggleFromSocket(playerInfo.songInfo)
    })
    socketService.on(SOCKET_EVENT_ON_SHUFFLE, data => {
      dispatch({ type: SET_STATION_SONGS, stationSongs: data.stationSongs })
      dispatch({ type: SHUFFLE_ON })

    })
    socketService.on(SOCKET_EVENT_OFF_SHUFFLE, data => {
      dispatch({ type: SET_STATION_SONGS, stationSongs: data.stationSongs })
      dispatch({ type: SHUFFLE_OFF })
    })
    socketService.on(SOCKET_EVENT_OFF_LOOP, () => {
      dispatch({ type: LOOP_OFF })

    })
    socketService.on(SOCKET_EVENT_ON_LOOP, () => {
      dispatch({ type: LOOP_ON })
    })

    return () => {
      if (user) socketService.emit('leave-listening-room', user)
      socketService.off(SOCKET_EVENT_TOGGLE_PLAY)
      socketService.off(SOCKET_EVENT_PLAY)
      socketService.off(SOCKET_EVENT_ON_SHUFFLE)
      socketService.off(SOCKET_EVENT_OFF_SHUFFLE)
      socketService.off(SOCKET_EVENT_ON_LOOP)
      socketService.off(SOCKET_EVENT_OFF_LOOP)
    }
  }, [stations])



  function onToggleFromSocket(song) {
    const prev = lastClickedSong
    dispatch({ type: SET_LAST_CLICKED, lastClickedSong: song })
    dispatch({ type: TOGGLE_PLAY })
    // if (playing) {
    //   dispatch({ type: PAUSE })
    // } else {
    //   dispatch({ type: PLAY })
    // }
  }


  async function onPlayFromSocket(song) {
    // const prev = lastClickedSong
    // dispatch({ type: SET_LAST_CLICKED, lastClickedSong: song })
    // console.log(prev)
    // console.log(song.id)
    // if (prev?.id === song.id) {
    //   dispatch({ type: TOGGLE_PLAY })

    const stationn = stations.find(station => station.isShared)
    const stationnId = stationn?._id
    // } else {
    dispatch({ type: SET_NOW_PLAYING, nowPlaying: song });
    dispatch({ type: PLAY })
    dispatch({ type: SET_NOW_PLAYING_STATION, nowPlaying: stationnId })
    dispatch({ type: SET_STATION_SONGS, stationSongs: stationn.songs })
    // }
  }

  useEffect(() => {
    socketService.on(SOCKET_EVENT_STATION_UPDATE, update => {
      dispatch({ type: UPDATE_STATION, station: update.updatedStation })
    })

    return () => socketService.off(SOCKET_EVENT_STATION_UPDATE)
  }, [])

  useEffect(() => {
    socketService.on('user-joined-listening-room', (user) => {
      showSuccessMsg(`${user.fullname} joined the listening room`)
    })

    return () => socketService.off('user-joined-listening-room')
  }, [])
  useEffect(() => {
    socketService.on('user-left-listening-room', (user) => {
      showSuccessMsg(`${user.fullname} left the listening room`)
    })

    return () => socketService.off('user-left-listening-room')
  }, [])


  useEffect(() => {
    if (search) debouncedOnSearch(search)
  }, [search])

  useEffect(() => {
    const el = document.querySelector(".main-content")

    function handleScroll() {
      const scrollY = el.scrollTop
      setShowActions(scrollY > 280)
      const headerHeight = headerRef.current?.offsetHeight || 300
      const fade = Math.max(0, 1 - scrollY / headerHeight)
      setHeaderOpacity(fade)
    }

    el.addEventListener("scroll", handleScroll)
    return () => el.removeEventListener("scroll", handleScroll)
  }, [])

  // useEffect(() => {
  //   if (!station) return
  //   if (stationId === 'likedSongs') return
  //   calcColor()
  // }, [station])

  function handleChange({ target }) {
    setSearch(target.value);
  }

  async function calcColor() {
    const color = await stationService.getAvgColor(station)
    setAvgColor(color)
  }


  async function onSearchMusic(search) {
    const searchResults = await searchMusicService.searchMusic(search);
    setSearchResults(searchResults);
  }

  function onSearch(ev) {
    ev.preventDefault();
    onSearchMusic(search);
  }

  async function onPlaySearchedResult(search) {
    let song = search

    if (!search.src) {
      song = await searchMusicService.getYoutubeURL(search)
      const songsToUpdate = station.songs.map(s =>
        s.id === song.id ? { ...s, src: song.src } : s
      )
      const stationToUpdate = { ...station, songs: songsToUpdate }
      await updateStation(stationToUpdate)

    }

    const data = { song: search, user }
    const prev = lastClickedSong
    dispatch({ type: SET_LAST_CLICKED, lastClickedSong: song })
    console.log(data)
    if (prev?.id === song.id) {
      dispatch({ type: TOGGLE_PLAY })
      socketService.emit(SOCKET_EMIT_TOGGLE_PLAY, data)
    } else {
      setSong(song)
      dispatch({ type: PLAY })
      socketService.emit(SOCKET_EMIT_PLAY, data)
      dispatch({ type: SET_NOW_PLAYING_STATION, nowPlaying: station._id })
      dispatch({ type: SET_STATION_SONGS, stationSongs: station.songs })
    }
  }
  if (!station) return <LoaderDots text="" />;
  const stationImg = station.songs[0]?.imgUrl;

  async function deleteStation(ev, stationId) {
    ev.stopPropagation();
    if (!user) {
      showErrorMsg("You must be logged in to delete a playlist");
      return;
    }

    await removeStation(stationId);
    navigate("/");
  }

  async function addToLibrary(ev, station) {
    ev.stopPropagation();
    if (!user) {
      showErrorMsg("You must be logged in to add songs to a playlist");
      return;
    }
    await addStationToLibrary(user, station._id);
    showSuccessMsg("Playlist added to your library");
  }

  async function deleteSong(ev, songId, stationId) {
    ev.stopPropagation();

    if (!user) {
      showErrorMsg("You must be logged in to delete songs");
      return;
    }

    await removeSong(stationId, songId);
    dispatch({ type: SET_STATION_SONGS, stationSongs: stationSongs.filter(song => song.id !== songId) })
    showSuccessMsg("Song removed from playlist");
  }

  async function onAddSong(ev, song, stationId) {
    ev.stopPropagation();

    if (!user) {
      showErrorMsg("You must be logged in to add songs to a playlist");
      return;
    }

    await addSongToStation(song, stationId);
    showSuccessMsg("Song added to playlist");
  }


  async function onUpdateStation(stationToUptade) {
    const updatedStation = await stationService.save(stationToUptade)
    dispatch({ type: UPDATE_STATION, station: updatedStation })
  }

  const coverImg =
    station._id === "likedSongs"
      ? "https://misc.scdn.co/liked-songs/liked-songs-300.png"
      : station.songs?.[0]?.imgUrl || station.imgUrl || "/img/blank-screen.png";

  return (
    <section className="station-details container " style={{
      backgroundColor: `rgba(${toRgbString(station.color)})`,
      "--avg-color": station.color,
    }}
    >
      <div className="gradient-wrapper"
        style={{

          backgroundColor: `rgba(${toRgbString(station.color)})`
        }}>
        <div
          className="ent-spacing"
          style={{
            backgroundColor: `rgba(${toRgbString(station.color)}, ${1 - headerOpacity})`,
          }}
        >
          {showActions && (
            <div className="station-actions sticky-actions">
              <div className="station-actions-wrapper">
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
                      dispatch({ type: SET_LAST_CLICKED, lastClickedSong: nowPlaying });

                      if (isStationPlaying) {
                        dispatch({ type: TOGGLE_PLAY });
                        socketService.emit(SOCKET_EMIT_TOGGLE_PLAY, { song: nowPlaying })
                      } else {
                        onPlaySearchedResult(station.songs[0])
                        dispatch({ type: PLAY });

                      }

                      dispatch({
                        type: SET_NOW_PLAYING_STATION,
                        nowPlaying: station._id,
                      });
                    }}
                  >
                    {(!isStationPlaying || !playing) && (
                      <Play className="icon-large-black" />
                    )}
                    {isStationPlaying && playing && (
                      <Pause className="icon-large-black" />
                    )}
                  </button>
                </Tippy>

                <button className="shuffle-btn">
                  <Shuffle className="icon medium-large" />
                </button>

              </div>
            </div>
          )}
        </div>
      </div>

      <header
        // ref={headerRef}
        className="station-header"
        style={{
          backgroundColor: `rgba(${toRgbString(station.color)},1)` || "rgba(18,18,18,1)",
          opacity: headerOpacity
        }}

      >

        <div className="image-wrapper">
          <LibraryEditStation coverImg={coverImg} />
          {/* <img className="station-cover" src={coverImg} alt={station.name} /> */}
        </div>

        <div className="station-meta">

          <span className="playlist-label">Shared Playlist</span>

          <h1 className="station-title">{station.name}</h1>

          <div className="station-subinfo">

            <span className="dot">•</span>
            <span className="song-count">{station.songs.length} songs</span>
          </div>
        </div>
      </header>

      <div className="station-actions"

      >
        <div className="station-actions-wrapper">
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
                dispatch({ type: SET_LAST_CLICKED, lastClickedSong: nowPlaying });
                if (isStationPlaying) {
                  dispatch({ type: TOGGLE_PLAY });
                  socketService.emit(SOCKET_EMIT_TOGGLE_PLAY, { song: nowPlaying })

                } else {
                  onPlaySearchedResult(station.songs[0])
                  dispatch({ type: PLAY });
                }

                dispatch({
                  type: SET_NOW_PLAYING_STATION,
                  nowPlaying: station._id,
                });
              }}
            >
              {(!isStationPlaying || !playing) && (
                <Play className="icon-large-black" />
              )}
              {isStationPlaying && playing && (
                <Pause className="icon-large-black" />
              )}
            </button>
          </Tippy>

          <Tippy
            content={"Shuffle"}
            delay={[500, 0]}
            offset={[0, 0]}
            arrow={false}
          >
            <button className="shuffle-btn">
              <Shuffle className="icon medium-large" />
            </button>
          </Tippy>



        </div>
      </div>
      <SongsTable

        deleteSong={deleteSong}
        station={station}
        onSearch={onSearch}
        onPlaySearchedResult={onPlaySearchedResult}
        search={search}
        handleChange={handleChange}
        searchResults={searchResults}
        onAddSong={onAddSong}
        onUpdateStation={onUpdateStation}
      />

    </section>
  );
}
