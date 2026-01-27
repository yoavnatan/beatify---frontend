import Duration from "../assets/svg/duration.svg?react"
import WhiteArrow from "../assets/svg/white-arrow.svg?react"
// import Search from "../assets/svg/search.svg?react"
import Tippy from "@tippyjs/react"
import Trash from "../assets/svg/trash.svg?react"
import Delete from "../assets/svg/delete.svg?react"
import Plus from "../assets/svg/plus.svg?react"
import Remove from "../assets/svg/remove.svg?react"
import ArrowInMenu from "../assets/svg/arrow-in-menu.svg?react"
import DropDownMenu from "../assets/svg/drop-down-menu.svg?react"
import Like from "../assets/svg/like.svg?react"
import Liked from "../assets/svg/liked.svg?react"
import Play from "../assets/svg/play.svg?react"
import { Popover } from 'react-tiny-popover';
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "../store/actions/user.actions.js"
import { DropDown } from "./SongsTable.jsx"
import { PLAY, TOGGLE_PLAY, SET_LAST_CLICKED } from "../store/reducers/player.reducer.js";
import { setSong } from "../store/actions/player.actions.js"
import { searchMusicService } from "../services/searchMusic.service.js"
import { addSongToStation, addStation } from "../store/actions/station.actions.js"
import { SET_NOW_PLAYING_STATION } from "../store/reducers/station.reducer.js"
import { stationService } from "../services/station"
import { useNavigate } from "react-router"


export function Search() {
    const { searchResults, artistResults } = useSelector(storeState => storeState.searchModule)
    const { user } = useSelector(storeState => storeState.userModule)
    let { playing, nowPlaying, lastClickedSong } = useSelector(storeState => storeState.playerModule)
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const dispatch = useDispatch();
    const navigate = useNavigate()


    useEffect(() => {
        dispatch({ type: SET_NOW_PLAYING_STATION, nowPlaying: '' })
    }, [])

    async function likeSong(songId) {
        const likedSongs = user.likedSongs
        if (user.likedSongs.includes(songId)) {
            let userToUpdate = { ...user, likedSongs: likedSongs.filter(song => song !== songId) }
            await updateUser(userToUpdate)
            showSuccessMsg('Song removed from Liked Songs')


        } else {
            const userToUpdate = { ...user, likedSongs: [...likedSongs, songId] }
            await updateUser(userToUpdate)
            showSuccessMsg('Song added to Liked Songs')


        }
    }

    async function onAddSong(ev, song, stationId) {
        ev.stopPropagation();
        await addSongToStation(song, stationId);
    }

    async function onPlaySearchedResult(search) {
        const song = await searchMusicService.getYoutubeURL(search);
        const prev = lastClickedSong;
        // lastClickedSong.current = song;
        dispatch({ type: SET_LAST_CLICKED, lastClickedSong: song })

        if (prev?.id === song.id) {
            dispatch({ type: TOGGLE_PLAY });
        } else {
            setSong(song);
            dispatch({ type: PLAY });
        }
    }

    async function createArtistStation(ev, artist) {
        ev.stopPropagation()
        const artistStation = await stationService.getArtistStation(artist)
        const savedStation = await addStation(artistStation)
        navigate(`/station/${savedStation._id}`)
    }


    return (
        <section className="search-index container">
            <h1 className="header">Artists</h1>
            <div className="artist-search-results container flex">
                {artistResults.length > 0 && artistResults.map(res => (
                    <article className="artist-result" key={res.id}>
                        <img className="artist-img" src={res.picture_medium} style={{
                            width: '180px',
                            heigth: '180px',
                            borderRadius: '50%'
                        }}></img>
                        <div className="artist-info">
                            <div className="song-title" onClick={(ev,) => { createArtistStation(ev, res) }}>{res.name}</div>
                            <div className="song-artist">{res.type}</div>
                        </div>
                    </article>
                ))}
            </div>
            <h1 className="header">Songs</h1>
            <ul>
                {searchResults.length > 0 && searchResults.map(res => (
                    <li key={res.id} className="result-item"
                        onClick={() => onPlaySearchedResult(res)}
                    >
                        <img className="song-img" src={`https://e-cdns-images.dzcdn.net/images/cover/${res.md5_image}/220x220.jpg`} onClick={() => onPlaySearchedResult(res)} />
                        <div className="song-info">
                            <div className="song-title">{res.title}</div>
                            <div className="song-artist">{res.artist.name}</div>
                        </div>
                        <div className={`like-icon ${user.likedSongs.includes(res.id) ? 'on' : ''}`}>
                            <Tippy content={`${user.likedSongs.includes(res.id) ? 'Remove from' : 'Add to'} Liked Songs`} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                                <span className="tooltip-wrapper">
                                    {!user.likedSongs.includes(res.id) && <Like className="icon small" onClick={() => likeSong(res.id)} />}
                                    {user.likedSongs.includes(res.id) && <Liked className="icon small" onClick={() => likeSong(res.id)} />}
                                </span>
                            </Tippy>
                        </div>
                        <DropDown onAdd={onAddSong}
                            canDelete={false}
                            song={res}
                            stationId={''}
                            stations={stations}

                        />
                    </li>
                ))}
            </ul>
        </section>
    )
}
