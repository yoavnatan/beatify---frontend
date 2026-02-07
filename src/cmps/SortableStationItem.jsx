import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import WhiteArrow from "../assets/svg/white-arrow.svg?react"
import Tippy from '@tippyjs/react';
import Like from "../assets/svg/like.svg?react"
import Liked from "../assets/svg/liked.svg?react"


export function SortableStationItem({ song, user, likeSong, onPlayFromQueue, nowPlayingStationId }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: song.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.6 : 1,
        touchAction: 'none'

    };

    return (
        <li ref={setNodeRef} style={{ ...style, cursor: 'grab' }} className={`result-item ${isDragging ? 'dragging' : ''}`}
            onClick={() => onPlayFromQueue(song, nowPlayingStationId)}
            {...attributes} {...listeners}>

            {/* <div className="drag-handle" >
                <span style={{ cursor: 'grab', paddingRight: '10px' }}>⠿</span>
            </div> */}

            <div className="img-overlay">
                <WhiteArrow className="icon medium white" />
                <img className="song-img" src={song.album.cover_big} />
            </div>

            <div className="song-info">
                <div className="song-title">{song.title}</div>
                <div className="song-artist">{song.artist.name}</div>
            </div>

            <div className={`like-icon ${user.likedSongs.includes(song.id) ? 'on' : ''}`}>
                <Tippy content="..." delay={[500, 0]} offset={[0, 15]} arrow={false} >
                    <span className="tooltip-wrapper" onClick={(e) => e.stopPropagation()}>
                        {!user.likedSongs.includes(song.id) ? <Like className="icon small" onClick={() => likeSong(song.id)} /> : <Liked className="icon small" onClick={() => likeSong(song.id)} />}
                    </span>
                </Tippy>
            </div>
        </li>
    );
}