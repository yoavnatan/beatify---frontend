import { useEffect, useRef, useState } from "react"
import Arrow from "../assets/svg/nav-arrow.svg?react"
import Play from "../assets/svg/play.svg?react"
import { useNavigate } from "react-router"
import { PLAY, SET_LAST_CLICKED, TOGGLE_PLAY } from "../store/reducers/player.reducer"
import { SET_NOW_PLAYING_STATION, SET_STATION_SONGS } from "../store/reducers/station.reducer"
import { useDispatch, useSelector } from "react-redux"
import { searchMusicService } from "../services/searchMusic.service"
import { updateStation } from "../store/actions/station.actions"
import Pause from "../assets/svg/pause.svg?react";
import { setSong } from "../store/actions/player.actions"

export function StationCarousel({ stations }) {
    const listRef = useRef()
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(true)
    const [fadeLeft, setFadeLeft] = useState(0)
    const [fadeRight, setFadeRight] = useState(1)
    const { playing, nowPlaying, lastClickedSong } = useSelector(
        (storeState) => storeState.playerModule,
    );
    const { nowPlaying: nowPlayingStationId } = useSelector(
        (storeState) => storeState.stationModule,
    );

    function onScrollEvent() {
        if ((listRef.current.scrollWidth - (listRef.current.scrollLeft + listRef.current.offsetWidth + 1)) / 100 <= 1) setFadeRight((listRef.current.scrollWidth - (listRef.current.scrollLeft + listRef.current.offsetWidth + 1)) / 100)

        if (listRef.current.scrollLeft / 100 <= 1) setFadeLeft(listRef.current.scrollLeft / 100)
        setShowLeftArrow(true)
        setShowRightArrow(true)
        if (listRef.current.scrollLeft + listRef.current.offsetWidth + 1 >= listRef.current.scrollWidth) {
            setShowRightArrow(false)
        }
        if (listRef.current.scrollLeft === 0) {
            setShowLeftArrow(false)
        }
    }
    function scrollCarousel(side) {
        if (side === 'right') {
            listRef.current.scrollBy({
                left: 350,
                behavior: 'smooth'
            })
        }
        else {
            listRef.current.scrollBy({
                left: -350,
                behavior: 'smooth'
            })
        }


    }

    function onChooseStation(station) {
        navigate(`station/${station._id}`)
    }

    async function onPlaySearchedResult(search, station) {
        let song = search

        if (!search.src) {
            song = await searchMusicService.getYoutubeURL(search)
            const songsToUpdate = stations.find(s => s._id === station._id).songs.map(s =>
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
            dispatch({ type: SET_STATION_SONGS, stationSongs: station.songs })
        }
    }

    return (

        <section className="station-carousel" >
            <div className="fade-left"
                style={{ opacity: `${fadeLeft}` }} >
            </div>
            <div className="fade-right"
                style={{ opacity: `${fadeRight}` }} >
            </div>
            <h2 className="carusel-title">More of your taste</h2>
            {showLeftArrow && <div className="arrow-wrapper left " onClick={() => scrollCarousel('left')}  >
                <Arrow className="icon small arrow-left" />
            </div>}
            {showRightArrow && <div className="arrow-wrapper right " onClick={() => scrollCarousel('right')}>
                <Arrow className="icon small arrow-right" />
            </div>}
            <ul ref={listRef} className="list" onScroll={onScrollEvent}>
                {stations.map(station => {

                    const coverImg =
                        station._id === 'likedSongs'
                            ? "https://misc.scdn.co/liked-songs/liked-songs-300.png"
                            : station.songs?.[0]?.imgUrl ||
                            station.imgUrl ||
                            "/img/blank-screen.png"

                    return (
                        <li key={station._id} className="item">
                            <div className="img-container">
                                <img
                                    src={coverImg}
                                    alt={station.name}
                                    onClick={() => onChooseStation(station)}
                                />
                                <div
                                    className="btn-play"
                                    onClick={() => {
                                        dispatch({ type: SET_LAST_CLICKED, lastClickedSong: nowPlaying });
                                        if (station._id === nowPlayingStationId) {
                                            dispatch({ type: TOGGLE_PLAY });
                                        } else {
                                            onPlaySearchedResult(station.songs[0], station)
                                            dispatch({ type: PLAY });
                                        }

                                        dispatch({
                                            type: SET_NOW_PLAYING_STATION,
                                            nowPlaying: station._id,
                                        });
                                    }}
                                >
                                    {(station._id !== nowPlayingStationId || !playing) && (
                                        <Play className="icon small-medium black" />
                                    )}
                                    {station._id === nowPlayingStationId && playing && (
                                        <Pause className="icon small-medium black" />
                                    )}
                                </div>
                            </div>

                            <div className="description">{station.name}</div>
                        </li>
                    )
                })}
            </ul>

        </section >
    )
}