import { useDispatch, useSelector } from "react-redux";
import Play from "../assets/svg/play.svg?react"
import Pause from "../assets/svg/pause.svg?react";
import { searchMusicService } from "../services/searchMusic.service";
import { updateStation } from "../store/actions/station.actions";
import { PLAY, SET_LAST_CLICKED, TOGGLE_PLAY } from "../store/reducers/player.reducer";
import { SET_NOW_PLAYING_STATION, SET_STATION_SONGS } from "../store/reducers/station.reducer";

export function StationPreview({ station, gradient, setGradientColor }) {

    const { playing, nowPlaying, lastClickedSong } = useSelector(
        (storeState) => storeState.playerModule,
    );
    const { stations, nowPlaying: nowPlayingStationId } = useSelector(
        (storeState) => storeState.stationModule,
    );

    const dispatch = useDispatch();

    function onChangeGradient(s) {

        setGradientColor(gradient)
    }

    function onRevertGradient() {
        setGradientColor('rgba(47, 38, 89, 0.9)')
    }

    async function onPlaySearchedResult(ev, search) {
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

    const coverImg =
        station._id === 'likedSongs'
            ? "https://misc.scdn.co/liked-songs/liked-songs-300.png"
            : station.songs?.[0]?.imgUrl ||
            station.imgUrl ||
            "/img/blank-screen.png"



    return (
        <article
            className="station-preview"
            onMouseOver={() => onChangeGradient(station)}
            onMouseOut={onRevertGradient}
        >
            <img
                src={coverImg}
                alt={station.name}
            />

            <h3 className="station-name-preview">{station.name}</h3>

            <div
                className="btn-play"
                onClick={(ev) => {
                    ev.stopPropagation()
                    dispatch({ type: SET_LAST_CLICKED, lastClickedSong: nowPlaying });
                    if (station._id === nowPlayingStationId) {
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
                {(station._id !== nowPlayingStationId || !playing) && (
                    <Play className="icon small black" />
                )}
                {station._id === nowPlayingStationId && playing && (
                    <Pause className="icon small black" />
                )}
            </div>
        </article>
    )
}
