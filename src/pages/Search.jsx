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
import { Popover } from 'react-tiny-popover';
import { useState } from "react"
import { useSelector } from "react-redux"
import { updateUser } from "../store/actions/user.actions.js"


export function Search() {
    const { searchResults } = useSelector(storeState => storeState.searchModule)
    const { user } = useSelector(storeState => storeState.userModule)
    let { playing, nowPlaying } = useSelector(storeState => storeState.playerModule)


    async function likeSong(songId) {
        const likedSongs = user.likedSongs
        if (user.likedSongs.includes(songId)) {
            let userToUpdate = { ...user, likedSongs: likedSongs.filter(song => song !== songId) }
            await updateUser(userToUpdate)

        } else {
            const userToUpdate = { ...user, likedSongs: [...likedSongs, songId] }
            await updateUser(userToUpdate)


        }
    }

    return (
        <section className="search-index container">
            <h1 className="header">Songs</h1>
            <ul>
                {searchResults.length > 0 && searchResults.map(res => (
                    <li key={res.id} className="result-item">
                        <img className="song-img" src={`https://e-cdns-images.dzcdn.net/images/cover/${res.md5_image}/56x56.jpg`} onClick={() => onPlaySearchedResult(res)} />
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
                    </li>
                ))}
            </ul>
        </section>
    )
}

{/* <ul className="song-list">
    {station.songs.map((song, idx) => (
        <li
            key={`${station._id}-${song.id}-${idx}`}
            className="song-row"
            onClick={() => onPlaySearchedResult(song)}
        >
            <div className='song-row-inner'>
                <div className="song-index-wrapper">
                    <span className="song-index">
                        {playing && song.id === nowPlaying.id && <img style={{ width: '14px', heigth: '14px' }} src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif" />}
                        {(!playing || song.id !== nowPlaying.id) && idx + 1}</span>

                    <Tippy content={`Play ${song.title}`} delay={[800, 0]} offset={[0, -60]} arrow={false} placement="bottom">
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
                <div className={`like-icon ${user.likedSongs.includes(song.id) ? 'on' : ''}`}>
                    <Tippy content={`${user.likedSongs.includes(song.id) ? 'Remove from' : 'Add to'} Liked Songs`} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                        <span className="tooltip-wrapper">
                            {!user.likedSongs.includes(song.id) && <Like className="icon small" onClick={() => likeSong(song.id)} />}
                            {user.likedSongs.includes(song.id) && <Liked className="icon small" onClick={() => likeSong(song.id)} />}
                        </span>
                    </Tippy>
                </div>
                <div className="song-date">2 days ago</div>

                <div className='song-duration-wrapper'>
                    <div className="song-duration">3:45</div>
                </div>
                <DropDown onAdd={onAddSong}
                    onDelete={deleteSong}
                    song={song}
                    stationId={station._id}
                    stations={stations}
                />

            </div>
        </li>
    ))}
</ul> */}