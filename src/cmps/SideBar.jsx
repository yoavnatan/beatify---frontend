import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import Arrow from "../assets/svg/nav-arrow.svg?react"
import Collapse from "../assets/svg/collapse-library.svg?react"
import Tippy from '@tippyjs/react';
import Delete from "../assets/svg/delete.svg?react";
import { updateUser } from "../store/actions/user.actions";
import Like from "../assets/svg/like.svg?react"
import Liked from "../assets/svg/liked.svg?react"
import Exit from "../assets/svg/exit.svg?react"
import { searchMusicService } from "../services/searchMusic.service";
import { LongTxt } from "../assets/styles/cmps/LongTxt";
import { stationService } from "../services/station";
import { addSongToStation, addStation } from "../store/actions/station.actions";
import { useLocation, useNavigate } from "react-router";
import { showSuccessMsg } from "../services/event-bus.service";
import { DropDown } from "../pages/SongsTable.jsx";
import { PLAY, REMOVE_FROM_QUEUE, SET_LAST_CLICKED, SET_QUEUE, SHOW_QUEUE, TOGGLE_PLAY, TOGGLE_QUEUE_SHOW } from "../store/reducers/player.reducer";
import { setSong } from "../store/actions/player.actions";
import WhiteArrow from "../assets/svg/white-arrow.svg?react"
import Pause from "../assets/svg/pause.svg?react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableQueueItem } from "./SortableQueueItem.jsx";
import { SortableStationItem } from "./SortableStationItem.jsx";
export function SideBar() {

    const [isBarOpen, SetIsBarOpen] = useState(false)
    const [artistBio, setArtistBio] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const location = useLocation()

    const { queue, queueShown, playing, nowPlaying, lastClickedSong } = useSelector(
        (storeState) => storeState.playerModule,
    )
    const { stations, stationSongs, nowPlaying: nowPlayingStationId } = useSelector(
        (storeState) => storeState.stationModule,
    )


    const { user } = useSelector(storeState => storeState.userModule)

    const sidebarRef = useRef()

    useEffect(() => {
        if (location.pathname === '/queueMobile') dispatch({ type: SHOW_QUEUE })
        if (nowPlaying.id) handleOpenBar()
        if (nowPlaying.artist && nowPlaying.artist.name) onGetArtistBio()
    }, [nowPlaying])

    useEffect(() => {
        if (queueShown) handleOpenBar()
    }, [queueShown])


    useEffect(() => {
        if (location.pathname === '/listeningRoom') handleCloseBar()
    }, [location])

    async function onGetArtistBio() {
        const bio = await searchMusicService.getArtistBio(nowPlaying.artist.name)
        setArtistBio(bio)
    }

    // DND
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // עוזר להבדיל בין לחיצה לנגינה לבין גרירה
            },
        })
    );

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            const oldIndex = queue.findIndex((song) => song.queueId === active.id);
            const newIndex = queue.findIndex((song) => song.queueId === over.id);

            const newQueue = arrayMove(queue, oldIndex, newIndex);

            // כאן אנחנו מעדכנים את Redux
            dispatch({ type: SET_QUEUE, queue: newQueue });
        }
    }

    function handleStationDragEnd(event) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            const oldIndex = stationSongs.findIndex(s => s.id === active.id);
            const newIndex = stationSongs.findIndex(s => s.id === over.id);

            const newStationSongs = arrayMove(stationSongs, oldIndex, newIndex);
            // Dispatch לעדכון המערך המלא ב-Redux
            dispatch({ type: 'SET_STATION_SONGS', stationSongs: newStationSongs });
        }
    }
    //

    function onMouseDown(e) {
        e.preventDefault()

        const rect = sidebarRef.current.getBoundingClientRect();
        const rightAnchor = rect.right;

        document.body.style.cursor = "col-resize";

        const onMouseMove = (moveEvent) => {
            if (sidebarRef.current) {

                let newWidth = rightAnchor - moveEvent.clientX;

                const MIN_WIDTH = 50;
                const MAX_WIDTH = 420;

                if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
                if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;

                if (newWidth < 200) {
                    SetIsBarOpen(false)
                    newWidth = MIN_WIDTH
                }

                if (!isBarOpen && newWidth > 200) {
                    if (location.pathname === '/listeningRoom') return

                    SetIsBarOpen(true)
                }
                sidebarRef.current.style.width = `${newWidth}px`;
            }
        }

        function onMouseUp() {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            document.body.style.cursor = "default";
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }

    function handleOpenBar() {
        if (location.pathname === '/listeningRoom') return

        if (!isBarOpen) {
            SetIsBarOpen(true)
            sidebarRef.current.style.width = `${300}px`;
            if (location.pathname === "/queueMobile") sidebarRef.current.style.width = `98%`;


        }
    }

    function handleCloseBar() {
        SetIsBarOpen(false)
        sidebarRef.current.style.width = `${50}px`;
    }


    async function likeSong(ev, songId) {
        ev.stopPropagation()
        const likedSongs = user?.likedSongs
        if (user?.likedSongs?.includes(songId)) {
            let userToUpdate = { ...user, likedSongs: likedSongs.filter(song => song !== songId) }
            await updateUser(userToUpdate)
            showSuccessMsg('Song removed from Liked Songs')


        } else {
            const userToUpdate = { ...user, likedSongs: [...likedSongs, songId] }
            await updateUser(userToUpdate)
            showSuccessMsg('Song added to Liked Songs')



        }
    }



    async function createArtistStation(ev, artist) {
        ev.stopPropagation()
        const artistStation = await stationService.getArtistStation(artist)
        const savedStation = await addStation(artistStation)
        navigate(`/station/${savedStation._id}`)
    }

    async function likeSong(songId) {
        const likedSongs = user?.likedSongs
        if (user?.likedSongs?.includes(songId)) {
            let userToUpdate = { ...user, likedSongs: likedSongs.filter(song => song !== songId) }
            await updateUser(userToUpdate)
            showSuccessMsg('Song removed from Liked Songs')

        } else {
            const userToUpdate = { ...user, likedSongs: [songId, ...likedSongs] }
            await updateUser(userToUpdate)
            showSuccessMsg('Song added to Liked Songs')
        }
    }

    function onRemoveFromQueue(ev, song) {
        ev.stopPropagation()
        dispatch({ type: REMOVE_FROM_QUEUE, song: song })
    }

    function onToggleQueueShow() {
        dispatch({ type: TOGGLE_QUEUE_SHOW })
    }

    function onTogglePlay() {
        dispatch({ type: TOGGLE_PLAY })
    }

    function onPlayQueueItem(song) {
        onPlayFromQueue(song)
        dispatch({ type: REMOVE_FROM_QUEUE, song: song })
    }

    async function onAddSong(ev, song, stationId) {
        ev.stopPropagation();
        await addSongToStation(song, stationId);
    }

    async function onPlayFromQueue(search, stationId) {
        let song = search
        let songsToUpdate
        if (!search.src) {
            song = await searchMusicService.getYoutubeURL(search)
            if (stationId && stationId !== 'likedSongs') {
                songsToUpdate = stations.find(s => s._id === stationId).songs.map(s =>
                    s.id === song.id ? { ...s, src: song.src } : s)
                const stationToUpdate = { ...stations.find(s => s._id === stationId), songs: songsToUpdate }
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
            // dispatch({ type: SET_STATION_SONGS, stationSongs: station.songs })
        }
    }
    let currentIdx

    if (nowPlayingStationId === "likedSongs") {
        currentIdx = stationSongs.findIndex(s => s === nowPlaying.id) || 0
    } else {
        currentIdx = stationSongs.findIndex(s => s.id === nowPlaying.id) || 0
    }

    let displayedSongs = [];

    // if (stationSongs.length >= 15) {
    for (let i = 1; i <= stationSongs.length - 1; i++) {
        displayedSongs.push(stationSongs[(currentIdx + i) % stationSongs.length]);
    }
    // } else {
    //     displayedSongs = stationSongs
    // }

    return (
        <>
            <section className={`sidebar container ${!isBarOpen ? "close" : "open"} `}
                onClick={handleOpenBar}
                ref={sidebarRef}
                style={{ width: '50px' }}>

                <div className="resizer-handle" onMouseDown={onMouseDown}>
                    <div className="resizer-line" />
                </div>

                {!isBarOpen && <div className="small arrow-side-bar"
                >
                    <Tippy content={'Expand sidebar'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                        <span className="tooltip-wrapper">
                            <Arrow className='icon medium' />
                        </span>
                    </Tippy>
                </div>}

                {isBarOpen && nowPlaying.artist && <div className='sidebar-content'>

                    <header className="flex" onClick={handleCloseBar}>
                        <Tippy content={'Collapse sidebar'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                            <span className="tooltip-wrapper">
                                <Collapse className="icon small collapse-side" style={{ rotate: '180deg' }} />
                            </span>
                        </Tippy>
                        <h1>Now Playing</h1>
                    </header>
                    <article className="side-bar-item now-playing-song">
                        <img src={nowPlaying.imgUrl} onClick={onTogglePlay}></img>
                        <div className="inner-container" >
                            <div className="song-info" onClick={onTogglePlay}>
                                <div className="song-title">{nowPlaying.title}</div>
                                <div className="song-artist" onClick={(ev) => createArtistStation(ev, nowPlaying.artist)}>{nowPlaying.artist.name}</div>
                            </div>
                            <div className={`like-icon ${user?.likedSongs?.includes(nowPlaying.id) ? 'on' : ''}`}>
                                <Tippy content={`${user?.likedSongs?.includes(nowPlaying.id) ? 'Remove from' : 'Add to'} Liked Songs`} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                                    <span className="tooltip-wrapper">
                                        {!user?.likedSongs?.includes(nowPlaying.id) && <Like className="icon small" onClick={(ev) => {
                                            ev.stopPropagation()
                                            likeSong(nowPlaying.id)
                                        }} />}
                                        {user?.likedSongs?.includes(nowPlaying.id) && <Liked className="icon small" onClick={(ev) => {
                                            ev.stopPropagation()
                                            likeSong(nowPlaying.id)
                                        }} />}
                                    </span>
                                </Tippy>
                            </div>
                            <DropDown onAdd={onAddSong}
                                canDelete={false}
                                song={nowPlaying}
                                stationId={''}
                                stations={stations}

                            />
                        </div>
                    </article>
                    <article className="artist-bio">
                        <img src={nowPlaying.artist.picture_medium} />
                        <div className="artist-bio-header">About the artist</div>
                        <LongTxt txt={artistBio} />
                    </article>
                    {queueShown && <div className="queue">
                        {(location.pathname !== '/queueMobile') && <div className="exit-btn" onClick={onToggleQueueShow} ><Exit className="icon small" /></div>}

                        <header style={{ marginBottom: '1em' }} className="flex" onClick={handleCloseBar}>
                            <Tippy content={'Collapse sidebar'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                                <span className="tooltip-wrapper">
                                    <Collapse className="icon small collapse-side" style={{ rotate: '180deg' }} />
                                </span>
                            </Tippy>
                            <h1 >Queue</h1>
                        </header>
                        <h3>Now Playing</h3>
                        <div className="result-item playing" >
                            {/* <div className="drag-handle"></div> */}
                            <div className="img-overlay" onClick={onTogglePlay}>
                                {!playing && <WhiteArrow className="icon medium white" />}
                                {playing && <Pause className="icon medium white" />}
                                <img className="song-img" src={nowPlaying.album.cover_big} />
                            </div>
                            <div className="song-info" onClick={onTogglePlay}>
                                <div className="song-title">{nowPlaying.title}</div>
                                <div className="song-artist">{nowPlaying.artist.name}</div>
                            </div>
                            <div className={`like-icon ${user?.likedSongs?.includes(nowPlaying.id) ? 'on' : ''}`}>
                                <Tippy content={`${user?.likedSongs?.includes(nowPlaying.id) ? 'Remove from' : 'Add to'} Liked Songs`} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                                    <span className="tooltip-wrapper">
                                        {!user?.likedSongs?.includes(nowPlaying.id) && <Like className="icon small" onClick={(ev) => {
                                            ev.stopPropagation()
                                            likeSong(nowPlaying.id)
                                        }} />}
                                        {user?.likedSongs?.includes(nowPlaying.id) && <Liked className="icon small" onClick={(ev) => {
                                            ev.stopPropagation()
                                            likeSong(nowPlaying.id)
                                        }} />}
                                    </span>
                                </Tippy>
                            </div>

                        </div>
                        <h2 >Next</h2>
                        {queue.length > 0 && <h3 >From queue</h3>}

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                            modifiers={[restrictToVerticalAxis]}
                        >
                            <SortableContext className='queue-drag'
                                items={queue.map((song) => song.queueId)}
                                strategy={verticalListSortingStrategy}
                            >
                                <ul className="queue-list-container">
                                    {queue.map((song) => (
                                        <SortableQueueItem
                                            key={song.queueId}
                                            song={song}
                                            user={user}
                                            onPlayQueueItem={onPlayQueueItem}
                                            likeSong={likeSong}
                                            onRemoveFromQueue={onRemoveFromQueue}
                                        />
                                    ))}
                                </ul>
                            </SortableContext>
                        </DndContext>
                        <h3>From station</h3>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleStationDragEnd}
                            modifiers={[restrictToVerticalAxis]}
                        >
                            <SortableContext
                                items={displayedSongs.map(s => s.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <ul className="station-list-container">
                                    {displayedSongs.map(song => (
                                        <SortableStationItem
                                            key={song.id}
                                            song={song}
                                            user={user}
                                            likeSong={likeSong}
                                            onPlayFromQueue={onPlayFromQueue}
                                            nowPlayingStationId={nowPlayingStationId}
                                        />
                                    ))}
                                </ul>
                            </SortableContext>
                        </DndContext>

                    </div>}
                </div>}
            </section >
        </>


    )
}