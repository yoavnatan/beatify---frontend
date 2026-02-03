import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import WhiteArrow from "../assets/svg/white-arrow.svg?react"
import Tippy from '@tippyjs/react';
import Like from "../assets/svg/like.svg?react"
import Liked from "../assets/svg/liked.svg?react"
import Delete from "../assets/svg/delete.svg?react";

export function SortableQueueItem({ song, user, onPlayQueueItem, likeSong, onRemoveFromQueue }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: song.queueId }); // משתמשים ב-queueId הייחודי

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.6 : 1,
        position: 'relative',
        touchAction: 'none'

    };

    return (
        <li
            ref={setNodeRef}
            style={{ ...style, cursor: 'grab' }}
            className={`result-item ${isDragging ? 'dragging' : ''}`}
            onClick={() => onPlayQueueItem(song)}
            {...attributes}
            {...listeners}
        >
            {/* ידית גרירה קטנה בצד שמאל */}
            {/* <div
                className="drag-handle"
                {...attributes}
                {...listeners}
                onClick={(e) => e.stopPropagation()} // חשוב: שלא יפעיל play בטעות
                style={{ cursor: 'grab', paddingRight: '10px', display: 'flex', alignItems: 'center' }}
            >
                <span style={{ fontSize: '18px', color: '#888' }}>⠿</span>
            </div> */}

            <div className="img-overlay">
                <WhiteArrow className="icon medium white" />
                <img className="song-img" src={song.album.cover_big} alt="" />
            </div>

            <div className="song-info">
                <div className="song-title">{song.title}</div>
                <div className="song-artist">{song.artist.name}</div>
            </div>

            <div className={`like-icon ${user.likedSongs.includes(song.id) ? 'on' : ''}`}>
                <Tippy content="..." delay={[500, 0]} offset={[0, 15]} arrow={false} >
                    <span className="tooltip-wrapper" onClick={(e) => e.stopPropagation()}>
                        {!user.likedSongs.includes(song.id) && <Like className="icon small" onClick={() => likeSong(song.id)} />}
                        {user.likedSongs.includes(song.id) && <Liked className="icon small" onClick={() => likeSong(song.id)} />}
                    </span>
                </Tippy>
            </div>

            <div className="delete-icon">
                <Tippy content={'Remove from queue'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                    <span className="tooltip-wrapper" onClick={(e) => e.stopPropagation()}>
                        <Delete className="icon small" style={{ marginInlineStart: 'auto' }} onClick={(ev) => onRemoveFromQueue(ev, song)} />
                    </span>
                </Tippy>
            </div>
        </li>
    );
}