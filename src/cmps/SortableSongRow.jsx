import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Popover } from 'react-tiny-popover';

import WhiteArrow from "../assets/svg/white-arrow.svg?react"

import Like from "../assets/svg/like.svg?react"
import Liked from "../assets/svg/liked.svg?react"


export function SortableSongRow({
    song, idx, station, playing, nowPlaying, user,
    onPlaySearchedResult, likeSong, formatTime,
    deleteSong, onAddSong, stations, DropDown
}) {
    // השתמשנו ב-song.id (בהנחה שאין כפילויות בתחנה)
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: song.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 9999 : undefined,
        opacity: isDragging ? 0.7 : 1,
        isolation: 'isolate'
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={`song-row ${isDragging ? 'dragging' : ''}`}
            onClick={() => onPlaySearchedResult(song)}
        >
            <div className='song-row-inner'>
                <div className="song-index-wrapper">

                    {/* הידית המדויקת מה-SideBar */}
                    <div
                        className="drag-handle"
                        {...attributes}
                        {...listeners}
                        onClick={(e) => e.stopPropagation()}
                        style={{ cursor: 'grab', paddingRight: '10px', display: 'flex', alignItems: 'center' }}
                    >
                        <span style={{ fontSize: '18px', color: '#888' }}>⠿</span>
                    </div>

                    <span className="song-index">
                        {playing && song.id === nowPlaying.id ? (
                            <img style={{ width: '14px', height: '14px' }} src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif" alt="playing" />
                        ) : (
                            idx + 1
                        )}
                    </span>

                    <span className="play-icon-row">
                        <WhiteArrow className="icon small white" />
                    </span>
                </div>

                <div className="song-title-wrapper">
                    <img className="song-img" src={song.imgUrl} alt={song.title} />
                    <div className="song-info">
                        <div className="song-title">{song.title}</div>
                        <div className="song-artist">{song.artist.name}</div>
                    </div>
                </div>

                <div className="song-album">{song.album.title}</div>

                <div className={`like-icon ${(user?.likedSongs || []).includes(song.id) ? 'on' : ''}`}>
                    <span onClick={(e) => e.stopPropagation()}>
                        {!(user?.likedSongs || []).includes(song.id) ?
                            <Like className="icon small" onClick={(ev) => likeSong(ev, song.id)} /> :
                            <Liked className="icon small" onClick={(ev) => likeSong(ev, song.id)} />
                        }
                    </span>
                </div>

                <div className="song-date">2 days ago</div>

                <div className='song-duration-wrapper'>
                    <div className="song-duration">{formatTime(song.duration)}</div>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                    <DropDown
                        onAdd={onAddSong}
                        onDelete={deleteSong}
                        canDelete={'true'}
                        song={song}
                        stationId={station._id}
                        stations={stations}
                    />
                </div>
            </div>
        </li>
    );
}