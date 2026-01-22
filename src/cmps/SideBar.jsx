import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import Arrow from "../assets/svg/nav-arrow.svg?react"
import Collapse from "../assets/svg/collapse-library.svg?react"
import Tippy from '@tippyjs/react';
import { updateUser } from "../store/actions/user.actions";
import Like from "../assets/svg/like.svg?react"
import Liked from "../assets/svg/liked.svg?react"

export function SideBar() {
    const [isBarOpen, SetIsBarOpen] = useState(false)

    const { playing, nowPlaying } = useSelector(
        (storeState) => storeState.playerModule,
    )
    const { nowPlaying: nowPlayingStationId } = useSelector(
        (storeState) => storeState.stationModule,
    )
    const { user } = useSelector(storeState => storeState.userModule)


    const sidebarRef = useRef()

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

                if (newWidth < 100) {
                    SetIsBarOpen(false)
                    newWidth = MIN_WIDTH
                }

                if (!isBarOpen && newWidth > 100) SetIsBarOpen(true)
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
        if (!isBarOpen) {
            SetIsBarOpen(true)
            sidebarRef.current.style.width = `${300}px`;
        }
    }

    function handleCloseBar() {
        SetIsBarOpen(false)
        sidebarRef.current.style.width = `${50}px`;
    }


    async function likeSong(ev, songId) {
        ev.stopPropagation()
        const likedSongs = user.likedSongs
        if (user.likedSongs.includes(songId)) {
            let userToUpdate = { ...user, likedSongs: likedSongs.filter(song => song !== songId) }
            await updateUser(userToUpdate)

        } else {
            const userToUpdate = { ...user, likedSongs: [...likedSongs, songId] }
            await updateUser(userToUpdate)


        }
    }

    async function likeSong(ev, songId) {
        ev.stopPropagation()
        const likedSongs = user.likedSongs
        if (user.likedSongs.includes(songId)) {
            let userToUpdate = { ...user, likedSongs: likedSongs.filter(song => song !== songId) }
            await updateUser(userToUpdate)

        } else {
            console.log(songId)
            const userToUpdate = { ...user, likedSongs: [...likedSongs, songId] }
            await updateUser(userToUpdate)


        }
    }

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
                {isBarOpen && <div className='sidebar-content'>

                    <header className="flex" onClick={handleCloseBar}>
                        <Tippy content={'Collapse sidebar'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                            <span className="tooltip-wrapper">
                                <Collapse className="icon small collapse-side" style={{ rotate: '180deg' }} />
                            </span>
                        </Tippy>
                        <h1>Now Playing</h1>
                    </header>
                    <article className="side-bar-item now-playing-song">
                        <img src={nowPlaying.imgUrl}></img>
                        <h1>{nowPlaying.title}</h1>
                        <h2>{nowPlaying.artist.name}</h2>
                        <div className={`like-icon ${user.likedSongs.includes(song.id) ? 'on' : ''}`}>
                            <Tippy content={`${user.likedSongs.includes(song.id) ? 'Remove from' : 'Add to'} Liked Songs`} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                                <span className="tooltip-wrapper">
                                    {!user.likedSongs.includes(song.id) && <Like className="icon small" onClick={(ev) => likeSong(ev, song.id)} />}
                                    {user.likedSongs.includes(song.id) && <Liked className="icon small" onClick={(ev) => likeSong(ev, song.id)} />}
                                </span>
                            </Tippy>
                        </div>
                    </article>
                </div>}
            </section>
        </>


    )
}