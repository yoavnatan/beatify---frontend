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
} from "../store/actions/station.actions.js";
import Play from "../assets/svg/play.svg?react";
import Pause from "../assets/svg/pause.svg?react";
import Shuffle from "../assets/svg/shuffle.svg?react";
import { PLAY, SET_LAST_CLICKED, TOGGLE_PLAY } from "../store/reducers/player.reducer.js";
import { setSong } from "../store/actions/player.actions.js";
import { SET_NOW_PLAYING_STATION } from "../store/reducers/station.reducer.js";
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



export function StationDetails() {
  const navigate = useNavigate();
  const { stationId } = useParams();
  const station = useSelector((storeState) => storeState.stationModule.station);
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
  const [avgColor, setAvgColor] = useState('rgba(18,18,18,1)')

  const headerRef = useRef();

  useEffect(() => {
    if (!stationId) return;
    if (stationId === "likedSongs") {
      loadLikedSongsStation();
    } else {
      loadStation(stationId);
    }
  }, [stationId, user]);

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

    async function calcColor() {
      if (station.averageColor) {
        setAvgColor(station.averageColor)
        return
      }
      const avg = await stationService.getAvgColor(station)
      setAvgColor(avg)
      if (user) {
        const updated = { ...station, averageColor: avg }
        await updateStation(updated)
      }
    }
    calcColor()
  }, [stationId])



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

    if (!user) {
      if (!search.src) {
        song = await searchMusicService.getYoutubeURL(search)
      }

      setSong(song)
      dispatch({ type: PLAY })
      dispatch({ type: SET_LAST_CLICKED, lastClickedSong: song })
      return
    }

    if (!search.src) {
      song = await searchMusicService.getYoutubeURL(search)
      const songsToUpdate = station.songs.map(s =>
        s.id === song.id ? { ...s, src: song.src } : s
      )
      if (station._id !== 'likedSongs') {
        const stationToUpdate = { ...station, songs: songsToUpdate }
        await updateStation(stationToUpdate)
      }
    }

    const prev = lastClickedSong
    dispatch({ type: SET_LAST_CLICKED, lastClickedSong: song })

    if (prev?.id === song.id) {
      dispatch({ type: TOGGLE_PLAY })
    } else {
      setSong(song)
      dispatch({ type: PLAY })
      dispatch({ type: SET_NOW_PLAYING_STATION, nowPlaying: station._id })
    }
  }


  if (!station) return <div>Loading...</div>;

  const stationImg =
    station._id === "likedSongs"
      ? "https://misc.scdn.co/liked-songs/liked-songs-300.png"
      : station.songs[0]?.imgUrl;

  async function deleteStation(ev, stationId) {
    ev.stopPropagation();
    if (!user) {
      showErrorMsg("You must be logged in to delete a playlist");
      return;
    }

    await removeStation(stationId);
    navigate("/");
  }

  async function deleteSong(ev, songId, stationId) {
    ev.stopPropagation();

    if (!user) {
      showErrorMsg("You must be logged in to delete songs");
      return;
    }

    await removeSong(stationId, songId);
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

  const coverImg =
    station._id === "likedSongs"
      ? "https://misc.scdn.co/liked-songs/liked-songs-300.png"
      : station.songs?.[0]?.imgUrl || station.imgUrl || "/img/blank-screen.png";

  return (
    <section className="station-details container " style={{
      backgroundColor: `rgba(${toRgbString(station.averageColor)})`,
      "--avg-color": station.averageColor,
    }}
    >
      <div className="gradient-wrapper"
        style={{

          backgroundColor: station.averageColor
        }}>
        <div
          className="ent-spacing"
          style={{
            backgroundColor: station.averageColor || "rgba(18,18,18,1)",
            opacity: 1 - headerOpacity
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
                        setSong(station.songs[0]);
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
                  <Shuffle className="icon medium" />
                </button>

                <Tippy
                  content={"Delete"}
                  delay={[500, 0]}
                  offset={[0, 15]}
                  arrow={false}
                >
                  <span className="tooltip-wrapper">
                    <Delete
                      className="icon medium"
                      onClick={(ev) => deleteStation(ev, station._id)}
                    />
                  </span>
                </Tippy>
              </div>
            </div>
          )}
        </div>
      </div>

      <header
        // ref={headerRef}
        className="station-header"
        style={{
          backgroundColor: station.averageColor || "rgba(18,18,18,1)",
          opacity: headerOpacity
        }}

      >

        <div className="image-wrapper">
          <LibraryEditStation coverImg={coverImg} />
          {/* <img className="station-cover" src={coverImg} alt={station.name} /> */}
        </div>

        <div className="station-meta">

          <span className="playlist-label">Playlist</span>

          <h1 className="station-title">{station.name}</h1>

          <div className="station-subinfo">
            <span className="creator">
              Created by {station.createdBy.fullname}
            </span>
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
                  setSong(station.songs[0]);
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
            <Shuffle className="icon medium" />
          </button>
          <Tippy
            content={"Delete"}
            delay={[500, 0]}
            offset={[0, 15]}
            arrow={false}
          >
            <span className="tooltip-wrapper">
              <Delete
                className="icon medium"
                onClick={(ev) => deleteStation(ev, station._id)}
              />
            </span>
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
      />

    </section>
  );
}
