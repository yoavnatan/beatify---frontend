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
import { PLAY, SET_LAST_CLICKED, TOGGLE_PLAY } from "../store/reducers/player.reducer.js";
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
import { SOCKET_EVENT_STATION_UPDATE, socketService } from "../services/socket.service.js";




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
  const [avgColor, setAvgColor] = useState()
  const headerRef = useRef();



  useEffect(() => {
    if (!stationId) return;
    loadStation(stationId);
    stationService.getAvgColor(station)

  }, [user]);

  useEffect(() => {
    socketService.on(SOCKET_EVENT_STATION_UPDATE, upate => {
      dispatch({ type: UPDATE_STATION, station: upate.updatedStation })
    })
    return () => {
      socketService.off(SOCKET_EVENT_STATION_UPDATE)
    }
  }, [])


  useEffect(() => {
    if (search) debouncedOnSearch(search);
  }, [search]);

  function handleChange({ target }) {
    setSearch(target.value);
  }
  useEffect(() => {
    const el = document.querySelector(".main-content");

    function handleScroll() {
      const scrollY = el.scrollTop;
      setShowActions(scrollY > 280);
      const headerHeight = headerRef.current?.offsetHeight || 300;
      const fade = Math.max(0, 1 - scrollY / headerHeight);
      setHeaderOpacity(fade);
    }

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!station) return
    if (stationId === 'likedSongs') return
    calcColor()
  }, [stationId])

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

    const prev = lastClickedSong
    dispatch({ type: SET_LAST_CLICKED, lastClickedSong: song })

    if (prev?.id === song.id) {
      dispatch({ type: TOGGLE_PLAY })
    } else {
      setSong(song)
      dispatch({ type: PLAY })
      dispatch({ type: SET_NOW_PLAYING_STATION, nowPlaying: station._id })
      dispatch({ type: SET_STATION_SONGS, stationSongs: station.songs })
    }
  }
  if (!station) return <div>Loading...</div>;
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
